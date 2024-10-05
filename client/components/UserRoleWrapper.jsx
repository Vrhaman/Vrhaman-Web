import React, { useEffect, useState } from "react";

const UserRole = ({ component: Component, role }) => {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const storedRole = localStorage.getItem("userRole");
    setUserRole(storedRole);
  }, []);

  return userRole === role ? <Component /> : null;
};

export default UserRole;
