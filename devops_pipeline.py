"""
Double A Hair Studio - full-stack verification pipeline.

Runs every layer of the system against an isolated throwaway database so that
nothing here touches the live Supabase records:

  1. environment   - venv, node_modules and .env files are in place
  2. backend       - every module compiles and the FastAPI app imports
  3. api           - every route exercised in-process (TestClient + SQLite)
  4. database      - read-only reachability check against the real Supabase
  5. frontend      - oxlint + production build for the web and admin apps
  6. integration   - a real uvicorn server answering real HTTP requests

Usage:  python devops_pipeline.py [--skip-frontend] [--skip-live-db]
"""

from __future__ import annotations

import argparse
import os
import socket
import subprocess
import sys
import tempfile
import time
import traceback
from pathlib import Path

ROOT = Path(__file__).resolve().parent
BACKEND = ROOT / "backend"
FRONTENDS = {"web": ROOT / "frontend" / "web", "admin": ROOT / "frontend" / "admin"}
VENV_PY = BACKEND / ".venv" / ("Scripts/python.exe" if os.name == "nt" else "bin/python")

PASS, FAIL = "PASS", "FAIL"


class Pipeline:
    """Collects check results and renders the final report."""

    def __init__(self) -> None:
        self.results: list[tuple[str, str, str, str]] = []
        self.stage = "-"

    def begin(self, stage: str) -> None:
        self.stage = stage
        print(f"\n\033[1m== {stage} ==\033[0m", flush=True)

    def check(self, name: str, condition, detail: object = "") -> bool:
        """Record one assertion. `condition` may be a bool or a zero-arg callable."""
        try:
            ok = bool(condition() if callable(condition) else condition)
        except Exception as exc:
            ok, detail = False, f"{type(exc).__name__}: {exc}"
            if os.environ.get("PIPELINE_TRACE"):
                traceback.print_exc()
        detail = str(detail)
        status = PASS if ok else FAIL
        colour = "\033[32m" if ok else "\033[31m"
        shown = detail if len(detail) <= 88 else detail[:85] + "..."
        print(f"  {colour}{status}\033[0m  {name}" + (f"  -- {shown}" if shown else ""), flush=True)
        self.results.append((self.stage, name, status, detail))
        return ok

    def report(self) -> int:
        failed = [r for r in self.results if r[2] == FAIL]
        width = 64
        print("\n" + "=" * width)
        print(f"  PIPELINE SUMMARY  ({len(self.results) - len(failed)}/{len(self.results)} checks passed)")
        print("=" * width)
        for stage in dict.fromkeys(r[0] for r in self.results):
            rows = [r for r in self.results if r[0] == stage]
            bad = sum(1 for r in rows if r[2] == FAIL)
            mark = "\033[31mFAIL\033[0m" if bad else "\033[32mPASS\033[0m"
            print(f"  {mark}  {stage:<28} {len(rows) - bad}/{len(rows)}")
        if failed:
            print("\n  Failures:")
            for stage, name, _, detail in failed:
                print(f"    - [{stage}] {name}" + (f"\n        {detail}" if detail else ""))
            print("\n\033[31m  RESULT: FAILED\033[0m\n")
            return 1
        print("\n\033[32m  RESULT: ALL CHECKS PASSED\033[0m\n")
        return 0


def run(cmd: list[str], cwd: Path, timeout: int = 300) -> tuple[int, str]:
    """Run a command, returning (exit_code, combined_output)."""
    proc = subprocess.run(
        cmd, cwd=cwd, capture_output=True, text=True, encoding="utf-8",
        errors="replace", timeout=timeout, shell=(os.name == "nt"),
    )
    return proc.returncode, (proc.stdout or "") + (proc.stderr or "")


def free_port() -> int:
    with socket.socket() as s:
        s.bind(("127.0.0.1", 0))
        return s.getsockname()[1]


# --------------------------------------------------------------------------
# 1. Environment
# --------------------------------------------------------------------------
def stage_environment(p: Pipeline) -> None:
    p.begin("environment")
    p.check("backend virtualenv present", VENV_PY.exists(), str(VENV_PY))
    p.check("backend/.env present", (BACKEND / ".env").exists())
    for name, path in FRONTENDS.items():
        p.check(f"{name}: node_modules installed", (path / "node_modules").exists())
        p.check(f"{name}: .env present", (path / ".env").exists())


# --------------------------------------------------------------------------
# 2. Backend static checks
# --------------------------------------------------------------------------
def stage_backend(p: Pipeline) -> None:
    p.begin("backend")
    sources = sorted((BACKEND / "app").rglob("*.py"))
    p.check("python sources discovered", len(sources) > 0, f"{len(sources)} modules")
    code, out = run([str(VENV_PY), "-m", "compileall", "-q", str(BACKEND / "app")], BACKEND)
    p.check("all modules byte-compile", code == 0, out.strip()[:400])
    code, out = run(
        [str(VENV_PY), "-c", "import app.main; print(len(app.main.app.routes))"], BACKEND
    )
    p.check("FastAPI app imports", code == 0, out.strip()[:400])


# --------------------------------------------------------------------------
# 3. API behaviour (in-process, isolated SQLite)
# --------------------------------------------------------------------------
API_TESTS = r'''
import sys, json
sys.stdout.reconfigure(encoding="utf-8")
from fastapi.testclient import TestClient
from app.main import app
from app.database import DATABASE_URL
from app.services.crud import studio_date
from datetime import datetime, timezone

results = []
def check(name, ok, detail=""):
    results.append({"name": name, "ok": bool(ok), "detail": str(detail)[:300]})

check("isolated test database in use", DATABASE_URL.startswith("sqlite"), DATABASE_URL)

with TestClient(app) as c:
    r = c.get("/")
    check("GET / returns service banner", r.status_code == 200 and r.json()["status"] == "online", r.status_code)
    check("GET /docs served", c.get("/docs").status_code == 200)
    check("GET /openapi.json valid", "paths" in c.get("/openapi.json").json())

    # --- seeded catalogue ---
    pkgs = c.get("/api/packages").json()
    check("GET /api/packages seeded", len(pkgs) == 4, f"{len(pkgs)} packages")
    check("packages carry service lists", all(isinstance(p["services"], list) and p["services"] for p in pkgs))
    barbers = c.get("/api/barbers").json()
    check("GET /api/barbers seeded", len(barbers) == 6, f"{len(barbers)} barbers")
    users = c.get("/api/users").json()
    check("GET /api/users seeded", len(users) == 5, f"{len(users)} users")
    apts = c.get("/api/appointments").json()
    check("GET /api/appointments seeded", len(apts) == 5, f"{len(apts)} appointments")

    # --- branch filtering ---
    raj = c.get("/api/appointments", params={"branch": "Rajshahi Atelier"}).json()
    check("appointments filter by branch", len(raj) == 2 and all("Rajshahi" in a["branch"] for a in raj), len(raj))
    empty = c.get("/api/appointments", params={"branch": "Uttara Atelier"}).json()
    check("empty branch returns empty list", empty == [], empty)
    rajb = c.get("/api/barbers", params={"branch": "Rajshahi Atelier"}).json()
    check("barbers filter by branch", len(rajb) == 2, len(rajb))
    # --- public chair roster (client portal) ---
    roster = c.get("/api/barbers/roster").json()
    check("GET /api/barbers/roster lists every chair", len(roster) == 6, len(roster))
    check("roster withholds staff contact and dob",
          all({"contact", "dob", "joining_date"}.isdisjoint(b) for b in roster),
          sorted(roster[0]) if roster else "empty")
    check("roster exposes what a client picks by",
          all({"id", "name", "branch", "role", "rating"} <= set(b) for b in roster))
    raj_roster = c.get("/api/barbers/roster", params={"branch": "Rajshahi Atelier"}).json()
    check("roster filters to the chosen sanctuary",
          len(raj_roster) == 2 and all(b["branch"] == "Rajshahi" for b in raj_roster), len(raj_roster))
    check("roster is empty for a branch with no chairs",
          c.get("/api/barbers/roster", params={"branch": "Sylhet Atelier"}).json() == [])

    check("All Sanctuaries bypasses filter",
          len(c.get("/api/appointments", params={"branch": "All Sanctuaries"}).json()) == 5)

    # --- ordering ---
    check("appointments newest first",
          [a["created_at"] for a in apts] == sorted((a["created_at"] for a in apts), reverse=True))

    # --- auth ---
    ok = c.post("/api/auth/verify-passcode", json={"passcode": "atelier2026"})
    check("auth accepts master passcode", ok.status_code == 200 and ok.json()["authenticated"], ok.status_code)
    bad = c.post("/api/auth/verify-passcode", json={"passcode": "wrong"})
    check("auth rejects wrong passcode", bad.status_code == 401, bad.status_code)
    check("auth rejects malformed body", c.post("/api/auth/verify-passcode", json={}).status_code == 422)

    # --- booking flow writes through to the customer ledger ---
    booking = {"customer": "Pipeline Guest", "contact": "01900000001",
               "package": "Royal Hair Spa & Scalp Therapy", "price": 1800,
               "assigned_to": "Hasan Ali", "branch": "Rajshahi Atelier",
               "scheduled_time": "Today 05:00 PM", "status": "Confirmed"}
    created = c.post("/api/appointments", json=booking)
    check("POST /api/appointments creates", created.status_code == 200, created.text[:200])
    apt = created.json()
    check("created appointment gets a uuid", len(apt["id"]) == 36, apt["id"])
    check("created appointment keeps its price", apt["price"] == 1800, apt["price"])

    check("booking records the chosen stylist", apt["assigned_to"] == "Hasan Ali", apt["assigned_to"])

    ledger = [u for u in c.get("/api/users").json() if u["contact"] == "01900000001"]
    check("new booking creates the patron", len(ledger) == 1, len(ledger))
    check("patron spend recorded", ledger and ledger[0]["total_spent"] == "৳1,800", ledger and ledger[0]["total_spent"])
    check("chosen stylist becomes the patron's preferred barber",
          ledger and ledger[0]["preferred_barber"] == "Hasan Ali", ledger and ledger[0]["preferred_barber"])

    c.post("/api/appointments", json={**booking, "price": 500, "package": "Essential Maintenance Clean"})

    ledger = [u for u in c.get("/api/users").json() if u["contact"] == "01900000001"][0]
    check("repeat visit increments count", ledger["total_visits"] == "2", ledger["total_visits"])
    check("repeat visit accumulates spend", ledger["total_spent"] == "৳2,300", ledger["total_spent"])
    check("no duplicate patron row",
          sum(1 for u in c.get("/api/users").json() if u["contact"] == "01900000001") == 1)

    any_stylist = c.post("/api/appointments", json={**booking, "contact": "01900000008",
                                                    "assigned_to": "Any available stylist"})
    check("booking without a stylist preference is accepted",
          any_stylist.status_code == 200 and any_stylist.json()["assigned_to"] == "Any available stylist",
          any_stylist.text[:160])

    # --- status transitions and validation ---
    patched = c.patch(f"/api/appointments/{apt['id']}", json={"status": "In-Service"})
    check("PATCH status transition", patched.status_code == 200 and patched.json()["status"] == "In-Service", patched.text[:200])
    check("PATCH rejects unknown status",
          c.patch(f"/api/appointments/{apt['id']}", json={"status": "Teleported"}).status_code == 422)
    check("POST rejects unknown status",
          c.post("/api/appointments", json={**booking, "status": "Nope"}).status_code == 422)
    check("PATCH unknown id is 404",
          c.patch("/api/appointments/does-not-exist", json={"status": "Completed"}).status_code == 404)
    check("PATCH reassigns barber",
          c.patch(f"/api/appointments/{apt['id']}", json={"assigned_to": "Sohel Rana"}).json()["assigned_to"] == "Sohel Rana")

    # --- creation endpoints ---
    nb = c.post("/api/barbers", json={"name": "Pipeline Barber", "contact": "01900000002", "branch": "Banani"})
    check("POST /api/barbers creates", nb.status_code == 200 and nb.json()["branch"] == "Banani", nb.text[:200])
    np = c.post("/api/packages", json={"name": "Pipeline Package", "actual_price": 1000,
                                       "discount_price": 700, "services": ["A", "B"], "package_number": "09"})
    check("POST /api/packages creates", np.status_code == 200 and np.json()["services"] == ["A", "B"], np.text[:200])
    # Discount is optional: omitting it must not 422, and the package must come
    # back priced at list so clients render a single figure with no strikethrough.
    plain = c.post("/api/packages", json={"name": "List Price Only", "actual_price": 1200,
                                          "services": ["Cut"], "package_number": "10"})
    check("POST /api/packages accepts no discount", plain.status_code == 200, plain.text[:160])
    check("omitted discount falls back to list price",
          plain.status_code == 200 and plain.json()["discount_price"] == 1200,
          plain.status_code == 200 and plain.json()["discount_price"])
    check("explicit null discount accepted",
          c.post("/api/packages", json={"name": "Null Discount", "actual_price": 900,
                                        "discount_price": None, "services": ["Cut"],
                                        "package_number": "11"}).json()["discount_price"] == 900)
    check("a real discount is still stored as given",
          c.post("/api/packages", json={"name": "Real Discount", "actual_price": 1000,
                                        "discount_price": 600, "services": ["Cut"],
                                        "package_number": "12"}).json()["discount_price"] == 600)
    # --- editing an existing package ---
    target = plain.json()
    renamed = c.patch(f"/api/packages/{target['id']}", json={"name": "Renamed Routine"})
    check("PATCH /api/packages renames", renamed.status_code == 200 and renamed.json()["name"] == "Renamed Routine",
          renamed.text[:160])
    check("PATCH leaves untouched fields alone",
          renamed.json()["actual_price"] == 1200 and renamed.json()["services"] == ["Cut"],
          renamed.json()["services"])
    repriced = c.patch(f"/api/packages/{target['id']}", json={"actual_price": 1500, "discount_price": 1100})
    check("PATCH reprices a package",
          repriced.json()["actual_price"] == 1500 and repriced.json()["discount_price"] == 1100)
    cleared = c.patch(f"/api/packages/{target['id']}", json={"discount_price": None})
    check("clearing the discount falls back to list price",
          cleared.json()["discount_price"] == 1500, cleared.json()["discount_price"])
    check("PATCH rewrites the service list",
          c.patch(f"/api/packages/{target['id']}", json={"services": ["A", "B", "C"]}).json()["services"] == ["A", "B", "C"])
    check("PATCH unknown package is 404",
          c.patch("/api/packages/nope", json={"name": "x"}).status_code == 404)
    check("PATCH rejects a bad price type",
          c.patch(f"/api/packages/{target['id']}", json={"actual_price": "free"}).status_code == 422)
    check("edits persist to the catalogue listing",
          next(p for p in c.get("/api/packages").json() if p["id"] == target["id"])["name"] == "Renamed Routine")

    check("POST /api/packages validates price type",
          c.post("/api/packages", json={"name": "Bad", "actual_price": "free", "discount_price": 1}).status_code == 422)
    nu = c.post("/api/users", json={"name": "Pipeline Patron", "contact": "01900000003"})
    check("POST /api/users creates", nu.status_code == 200, nu.text[:200])
    check("POST /api/users requires a name",
          c.post("/api/users", json={"contact": "01900000004"}).status_code == 422)

    # --- dashboard maths ---
    s = c.get("/api/dashboard/summary").json()
    apts_now = c.get("/api/appointments").json()
    check("summary counts every patron", s["total_customers"] == len(c.get("/api/users").json()), s["total_customers"])
    check("summary counts every barber", s["total_barbers"] == len(c.get("/api/barbers").json()), s["total_barbers"])
    check("today's appointments = rows created today", s["today_appointments"] == len(apts_now), s["today_appointments"])
    check("today's revenue = sum of prices",
          abs(s["today_revenue"] - sum(a["price"] for a in apts_now)) < 0.01, s["today_revenue"])
    check("revenue formatted in taka", s["revenue_formatted"].startswith("৳"), s["revenue_formatted"])
    check("activity chart spans 7 days", len(s["activity_chart"]) == 7, len(s["activity_chart"]))
    check("chart totals match appointment count",
          sum(d["appointments"] for d in s["activity_chart"]) == len(apts_now))
    peaks = [d for d in s["activity_chart"] if d["is_peak"]]
    check("exactly one peak day highlighted", len(peaks) == 1, len(peaks))
    check("peak day is the busiest day",
          peaks and peaks[0]["appointments"] == max(d["appointments"] for d in s["activity_chart"]))
    # The business day must follow Asia/Dhaka, not UTC: 22:30 UTC is already
    # 04:30 the next morning in Dhaka and belongs to that day's takings.
    check("business day rolls over at Dhaka midnight",
          studio_date(datetime(2026, 9, 16, 22, 30, tzinfo=timezone.utc)).isoformat() == "2026-09-17")
    check("naive timestamps are read as UTC",
          studio_date(datetime(2026, 9, 16, 22, 30)) == studio_date(datetime(2026, 9, 16, 22, 30, tzinfo=timezone.utc)))
    check("chart ends on the studio's today",
          s["activity_chart"][-1]["day"] == studio_date().strftime("%a"), s["activity_chart"][-1]["day"])

    quiet_chart = c.get("/api/dashboard/summary", params={"branch": "Uttara Atelier"}).json()["activity_chart"]
    check("quiet branch highlights no peak", not any(d["is_peak"] for d in quiet_chart), len(quiet_chart))
    check("bar heights stay inside the viewBox",
          all(2 <= d["bar_height"] <= 145 for d in s["activity_chart"]))
    check("recent appointments capped at 5", len(s["recent_appointments"]) <= 5, len(s["recent_appointments"]))
    check("recent appointments are the newest",
          [a["id"] for a in s["recent_appointments"]] == [a["id"] for a in apts_now[:5]])

    sb = c.get("/api/dashboard/summary", params={"branch": "Dhanmondi Atelier"}).json()
    check("summary honours branch filter",
          sb["today_appointments"] == len(c.get("/api/appointments", params={"branch": "Dhanmondi Atelier"}).json()),
          sb["today_appointments"])
    se = c.get("/api/dashboard/summary", params={"branch": "Uttara Atelier"}).json()
    check("empty branch reports zero, not placeholders",
          se["today_appointments"] == 0 and se["today_revenue"] == 0, se["revenue_formatted"])

    # --- CORS for the Vite dev servers ---
    cors = c.get("/api/packages", headers={"Origin": "http://localhost:5174"})
    check("CORS header present for browser clients",
          cors.headers.get("access-control-allow-origin") is not None,
          cors.headers.get("access-control-allow-origin"))

print("PIPELINE_JSON:" + json.dumps(results))
'''


def stage_api(p: Pipeline) -> None:
    p.begin("api")
    with tempfile.TemporaryDirectory(ignore_cleanup_errors=True) as tmp:
        env = {**os.environ, "DATABASE_URL": f"sqlite:///{Path(tmp).as_posix()}/pipeline.db",
               "ADMIN_SECRET_KEY": "atelier2026", "PYTHONIOENCODING": "utf-8"}
        proc = subprocess.run(
            [str(VENV_PY), "-c", API_TESTS], cwd=BACKEND, env=env, capture_output=True,
            text=True, encoding="utf-8", errors="replace", timeout=300,
        )
    marker = "PIPELINE_JSON:"
    line = next((l for l in proc.stdout.splitlines() if l.startswith(marker)), None)
    if not line:
        p.check("api test suite ran", False, (proc.stdout + proc.stderr).strip()[-800:])
        return
    import json

    for r in json.loads(line[len(marker):]):
        p.check(r["name"], r["ok"], r["detail"])


# --------------------------------------------------------------------------
# 4. Live database reachability (read-only)
# --------------------------------------------------------------------------
LIVE_DB = r'''
import sys
sys.stdout.reconfigure(encoding="utf-8")
from sqlalchemy import inspect, text
from app.database import engine, DATABASE_URL
if DATABASE_URL.startswith("sqlite"):
    raise SystemExit("backend/.env did not yield a PostgreSQL URL")
with engine.connect() as conn:
    version = conn.execute(text("select version()")).scalar()
tables = set(inspect(engine).get_table_names())
missing = {"users", "barbers", "packages", "appointments"} - tables
print(f"OK|{version.split(',')[0]}|missing={sorted(missing)}")
'''


def stage_live_db(p: Pipeline) -> None:
    p.begin("database")
    env = {**os.environ, "PYTHONIOENCODING": "utf-8"}
    env.pop("DATABASE_URL", None)  # force backend/.env to supply the URL
    proc = subprocess.run(
        [str(VENV_PY), "-c", LIVE_DB], cwd=BACKEND, env=env, capture_output=True,
        text=True, encoding="utf-8", errors="replace", timeout=180,
    )
    line = next((l for l in proc.stdout.splitlines() if l.startswith("OK|")), "")
    p.check("Supabase PostgreSQL reachable", bool(line),
            line.split("|")[1] if line else (proc.stdout + proc.stderr).strip()[-400:])
    p.check("all four tables exist on Supabase", "missing=[]" in line,
            line.split("missing=")[-1] if line else "not checked")


# --------------------------------------------------------------------------
# 5. Frontend lint + build
# --------------------------------------------------------------------------
def stage_frontend(p: Pipeline) -> None:
    p.begin("frontend")
    for name, path in FRONTENDS.items():
        code, out = run(["npm", "run", "lint"], path, timeout=300)
        errors = [l for l in out.splitlines() if " error " in l or l.strip().startswith("error")]
        p.check(f"{name}: oxlint reports no errors", code == 0 and not errors,
                errors[0][:300] if errors else "")
        code, out = run(["npm", "run", "build"], path, timeout=600)
        p.check(f"{name}: production build succeeds", code == 0, out.strip()[-400:] if code else "")
        p.check(f"{name}: bundle emitted", (path / "dist" / "index.html").exists())


# --------------------------------------------------------------------------
# 6. Live HTTP integration against a real uvicorn server
# --------------------------------------------------------------------------
def stage_integration(p: Pipeline) -> None:
    p.begin("integration")
    import httpx

    port = free_port()
    with tempfile.TemporaryDirectory(ignore_cleanup_errors=True) as tmp:
        env = {**os.environ, "DATABASE_URL": f"sqlite:///{Path(tmp).as_posix()}/integration.db",
               "ADMIN_SECRET_KEY": "atelier2026", "PYTHONIOENCODING": "utf-8"}
        server = subprocess.Popen(
            [str(VENV_PY), "-m", "uvicorn", "app.main:app", "--host", "127.0.0.1",
             "--port", str(port), "--log-level", "warning"],
            cwd=BACKEND, env=env, stdout=subprocess.PIPE, stderr=subprocess.STDOUT,
            text=True, encoding="utf-8", errors="replace",
        )
        base = f"http://127.0.0.1:{port}"
        try:
            up, deadline = False, time.time() + 60
            while time.time() < deadline and server.poll() is None:
                try:
                    up = httpx.get(f"{base}/", timeout=2).status_code == 200
                    if up:
                        break
                except httpx.HTTPError:
                    time.sleep(0.4)
            if not p.check("uvicorn server boots", up,
                           "" if up else (server.communicate()[0] or "")[-500:]):
                return

            p.check("live GET /api/packages", httpx.get(f"{base}/api/packages", timeout=10).status_code == 200)
            p.check("live GET /api/dashboard/summary",
                    httpx.get(f"{base}/api/dashboard/summary", timeout=10).status_code == 200)

            # Exactly the request the client portal's booking modal sends.
            booking = httpx.post(f"{base}/api/appointments", timeout=10, json={
                "customer": "Integration Guest", "contact": "01900000009",
                "package": "Executive Grooming Routine", "price": 800,
                "assigned_to": "Assigned Master Stylist", "branch": "Dhanmondi Atelier",
                "scheduled_time": "Today 06:30 PM", "status": "Confirmed"})
            p.check("live booking round-trip", booking.status_code == 200, booking.text[:200])

            if booking.status_code == 200:
                apt_id = booking.json()["id"]
                listed = httpx.get(f"{base}/api/appointments", timeout=10).json()
                p.check("booking visible to the admin desk", any(a["id"] == apt_id for a in listed))
                done = httpx.patch(f"{base}/api/appointments/{apt_id}", json={"status": "Completed"}, timeout=10)
                p.check("live status update persists", done.json().get("status") == "Completed", done.text[:200])

            # Browser preflight from the Vite dev origins.
            pre = httpx.request("OPTIONS", f"{base}/api/appointments", timeout=10, headers={
                "Origin": "http://localhost:5174", "Access-Control-Request-Method": "POST",
                "Access-Control-Request-Headers": "content-type"})
            p.check("CORS preflight accepted", pre.status_code in (200, 204), pre.status_code)
        finally:
            server.terminate()
            try:
                server.wait(timeout=15)
            except subprocess.TimeoutExpired:
                server.kill()


def main() -> int:
    ap = argparse.ArgumentParser(description="Verify the Double A Hair Studio stack.")
    ap.add_argument("--skip-frontend", action="store_true", help="skip npm lint/build")
    ap.add_argument("--skip-live-db", action="store_true", help="skip the Supabase reachability check")
    args = ap.parse_args()

    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")

    print("\033[1mDouble A Hair Studio - DevOps Pipeline\033[0m")
    print(f"repository: {ROOT}")

    p = Pipeline()
    started = time.time()

    stage_environment(p)
    if not VENV_PY.exists():
        print("\n\033[31mCannot continue: create the venv with "
              "`uv venv backend/.venv && uv pip install --python backend/.venv "
              "-r backend/requirements.txt -r backend/requirements-dev.txt`\033[0m")
        return p.report()

    stage_backend(p)
    stage_api(p)
    if not args.skip_live_db:
        stage_live_db(p)
    if not args.skip_frontend:
        stage_frontend(p)
    stage_integration(p)

    print(f"\n  elapsed: {time.time() - started:.1f}s")
    return p.report()


if __name__ == "__main__":
    sys.exit(main())
