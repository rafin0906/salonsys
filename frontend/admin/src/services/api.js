const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export const api = {
  // Authentication
  async verifyPasscode(passcode) {
    const res = await fetch(`${API_BASE}/auth/verify-passcode`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ passcode }),
    });
    if (!res.ok) throw new Error('Invalid passcode');
    return res.json();
  },

  // Dashboard
  async getDashboardSummary(branch = '') {
    const url = branch && branch !== 'All Sanctuaries'
      ? `${API_BASE}/dashboard/summary?branch=${encodeURIComponent(branch)}`
      : `${API_BASE}/dashboard/summary`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch summary');
    return res.json();
  },

  // Appointments
  async getAppointments(branch = '') {
    const url = branch && branch !== 'All Sanctuaries'
      ? `${API_BASE}/appointments?branch=${encodeURIComponent(branch)}`
      : `${API_BASE}/appointments`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch appointments');
    return res.json();
  },

  async createAppointment(data) {
    const res = await fetch(`${API_BASE}/appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create appointment');
    return res.json();
  },

  async updateAppointmentStatus(id, status) {
    const res = await fetch(`${API_BASE}/appointments/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error('Failed to update status');
    return res.json();
  },

  // Barbers
  async getBarbers(branch = '') {
    const url = branch && branch !== 'All Sanctuaries'
      ? `${API_BASE}/barbers?branch=${encodeURIComponent(branch)}`
      : `${API_BASE}/barbers`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch barbers');
    return res.json();
  },

  async createBarber(data) {
    const res = await fetch(`${API_BASE}/barbers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create barber');
    return res.json();
  },

  // Packages
  async getPackages() {
    const res = await fetch(`${API_BASE}/packages`);
    if (!res.ok) throw new Error('Failed to fetch packages');
    return res.json();
  },

  async updatePackage(id, data) {
    const res = await fetch(`${API_BASE}/packages/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update package');
    return res.json();
  },

  async createPackage(data) {
    const res = await fetch(`${API_BASE}/packages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create package');
    return res.json();
  },

  // Customers / Users
  async getUsers() {
    const res = await fetch(`${API_BASE}/users`);
    if (!res.ok) throw new Error('Failed to fetch users');
    return res.json();
  },
};
