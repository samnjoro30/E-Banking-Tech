// utils/auth.js
export const getToken = () => {
    try {
      const token = sessionStorage.getItem('token');
      if (!token) return null;
      
      // Optional: Verify token structure before returning
      if (token.split('.').length !== 3) {
        console.error('Malformed token detected');
        removeToken();
        return null;
      }
      
      return token;
    } catch (error) {
      console.error('Error accessing localStorage:', error);
      return null;
    }
  };
  
  export const removeToken = () => {
    try {
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('token'); // Clear both for safety
    } catch (error) {
      console.error('Error removing token:', error);
    }
  };
  
  export const isAuthenticated = () => {
    const token = getToken();
    if (!token) return false;
    
    // Optional: Add basic JWT expiration check (client-side)
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  };
  
  // New function to handle token storage securely
  export const setToken = (token, remember = true) => {
    try {
      if (remember) {
        sessionStorage.setItem('token', token);
      } else {
        sessionStorage.setItem('token', token);
      }
    } catch (error) {
      console.error('Error storing token:', error);
    }
  };