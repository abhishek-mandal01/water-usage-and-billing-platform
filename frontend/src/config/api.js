// Central API configuration for Smart Water Platform
export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081').replace(/\/+$/, '');

export default API_BASE_URL;
