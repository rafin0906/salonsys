const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export const webApi = {
  async getPackages() {
    try {
      const res = await fetch(`${API_BASE}/packages`);
      if (!res.ok) throw new Error('API failed');
      return await res.json();
    } catch {
      return [
        {
          id: 'pkg-1',
          package_number: '01',
          name: 'Signature Atelier Cut & Beard Sculpt',
          actual_price: 1500,
          discount_price: 990,
          services: ['Bespoke Scissor Cut', 'Beard Trim & Hot Towel', 'Head Acupressure Massage', 'Cologne & Tonic Finish'],
        },
        {
          id: 'pkg-2',
          package_number: '02',
          name: 'Executive Grooming Routine',
          actual_price: 1200,
          discount_price: 800,
          services: ['Hair Cut & Styling', 'Deep Cleansing Hair Wash', 'Invigorating Mini-Facial', 'Botanical Beard Oil'],
        },
        {
          id: 'pkg-3',
          package_number: '03',
          name: 'Essential Maintenance Clean',
          actual_price: 750,
          discount_price: 500,
          services: ['Basic Precision Hair Cut', 'Straight Razor Neck Clean', 'Classic Cologne Splash'],
        },
        {
          id: 'pkg-4',
          package_number: '04',
          name: 'Royal Hair Spa & Scalp Therapy',
          actual_price: 2400,
          discount_price: 1800,
          services: ['Artisanal Cranial Scrub', 'Organic Steam Hair Mask', 'Precision Shears Hair Cut', 'Neck & Shoulder Release'],
        },
      ];
    }
  },

  async bookAppointment(data) {
    const res = await fetch(`${API_BASE}/appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Reservation submission failed');
    return await res.json();
  },
};
