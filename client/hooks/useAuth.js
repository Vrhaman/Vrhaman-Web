import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';

const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const role = Cookies.get('role');
    const token = Cookies.get('token');
    const userId = Cookies.get('userId') ? Cookies.get('userId').slice(3, 27) : null;
    const loggedIn = Cookies.get('loggedIn');

    setIsLoggedIn(Boolean(loggedIn));
    setUserRole(role);
    setUserId(userId);
    setToken(token);
  }, []);


  return { isLoggedIn, userRole, userId, token, loading, error };
};

export default useAuth;
