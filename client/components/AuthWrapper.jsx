import React, { useEffect, useState } from "react";

const AuthRole = ({ component: Component }) => {
  const [token, setToken] = useState(false);

  const validateToken = (token) => {
    if (!token) {
      return false;
    }
    const decodedToken = decodeJWT(token);
    if (!decodedToken || Date.now() >= decodedToken.exp * 1000) {
      return false;
    }
    return true;
  };

  const decodeJWT = (token) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      return null;
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("userRole");
    const isValidToken = validateToken(storedToken);
    setToken(isValidToken);
  }, []);

  return token ? <Component /> : null;
};

export default AuthRole;
