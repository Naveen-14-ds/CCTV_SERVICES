// Helper function for API requests
async function fetchApi(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers
    }
  };

  try {
    const response = await fetch(`http://localhost:3001/api${endpoint}`, config);
    const data = await safeJson(response);
        
    if (!response.ok) {
      throw new Error(data.message || data.msg || 'API request failed');
    }
        
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// Safe response JSON parser
async function safeJson(res) {
  const txt = await res.text();
  if (!txt) return {};
  try {
    return JSON.parse(txt);
  } catch (err) {
    console.warn('JSON parse error:', err);
    return { message: txt };
  }
}

// Helper to check if user is logged in and has specific role
function checkRole(allowedRoles) {
  try {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const token = localStorage.getItem('token');
        
    if (!user || !token) {
      window.location.href = 'login.html';
      return false;
    }
        
    if (allowedRoles && !allowedRoles.includes(user.role)) {
      alert('Access denied: insufficient permissions');
      window.location.href = 'index.html';
      return false;
    }
        
    return true;
  } catch (err) {
    console.error('Auth check error:', err);
    window.location.href = 'login.html';
    return false;
  }
}

// Expose helpers in global scope
window.fetchApi = fetchApi;
window.safeJson = safeJson;
window.checkRole = checkRole;
