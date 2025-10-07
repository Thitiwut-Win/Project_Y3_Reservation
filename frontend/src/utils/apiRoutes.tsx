const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export const API_ROUTES = {
    register: `${API_BASE}/api/auth/register`,
    login: `${API_BASE}/api/auth/login`,
    tickets: `${API_BASE}/api/tickets`,
    events: `${API_BASE}/api/events`
};
