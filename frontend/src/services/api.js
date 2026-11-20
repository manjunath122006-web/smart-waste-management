const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '') + '/api/v1';

export async function fetchCategories() {
  const res = await fetch(`${API_BASE}/complaints/categories`);
  if (!res.ok) throw new Error('Failed to load waste categories');
  return res.json();
}

export async function submitComplaint(formData) {
  const res = await fetch(`${API_BASE}/complaints`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Complaint submission failed');
  }
  return res.json();
}

export async function trackComplaint(trackingNumber) {
  const res = await fetch(`${API_BASE}/complaints/track/${encodeURIComponent(trackingNumber)}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Complaint not found');
  }
  return res.json();
}

export async function fetchComplaints(filters = {}) {
  const params = new URLSearchParams();
  if (filters.status) params.append('status', filters.status);
  if (filters.category) params.append('category', filters.category);
  const res = await fetch(`${API_BASE}/complaints?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch complaints');
  return res.json();
}

export async function overrideComplaint(complaintId, payload) {
  const res = await fetch(`${API_BASE}/complaints/${complaintId}/override`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to override category');
  return res.json();
}

export async function updateComplaintStatus(complaintId, status, token) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}/complaints/${complaintId}/status`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({ status })
  });
  if (!res.ok) throw new Error('Failed to update complaint status');
  return res.json();
}

export async function fetchDashboardSummary() {
  const res = await fetch(`${API_BASE}/admin/summary`);
  if (!res.ok) throw new Error('Failed to load dashboard summary');
  return res.json();
}

export async function fetchHotspots() {
  const res = await fetch(`${API_BASE}/admin/hotspots`);
  if (!res.ok) throw new Error('Failed to load hotspots');
  return res.json();
}

export async function optimizeRoute(payload) {
  const res = await fetch(`${API_BASE}/routes/optimize`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Route optimization failed');
  }
  return res.json();
}

export async function loginUser(email, password) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Login failed');
  }
  return res.json();
}

export async function fetchBins(filters = {}) {
  const params = new URLSearchParams();
  if (filters.zone) params.append('zone', filters.zone);
  if (filters.status) params.append('status', filters.status);
  if (filters.waste_type) params.append('waste_type', filters.waste_type);
  const res = await fetch(`${API_BASE}/bins?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to load waste bins');
  return res.json();
}

export async function updateBin(binId, payload) {
  const res = await fetch(`${API_BASE}/bins/${binId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to update waste bin');
  return res.json();
}

export async function fetchVehicles(filters = {}) {
  const params = new URLSearchParams();
  if (filters.status) params.append('status', filters.status);
  const res = await fetch(`${API_BASE}/vehicles?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to load fleet vehicles');
  return res.json();
}

export async function updateVehicle(vehicleId, payload) {
  const res = await fetch(`${API_BASE}/vehicles/${vehicleId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to update vehicle');
  return res.json();
}

export async function assignVehicleRoute(vehicleId, routeId) {
  const res = await fetch(`${API_BASE}/vehicles/${vehicleId}/assign-route/${routeId}`, {
    method: 'POST'
  });
  if (!res.ok) throw new Error('Failed to assign route to vehicle');
  return res.json();
}

export async function fetchLatestRoute() {
  const res = await fetch(`${API_BASE}/routes/latest`);
  if (!res.ok) return null;
  return res.json();
}

