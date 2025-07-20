/* eslint-disable no-undef */
const { useEffect, useState } = require("react");
const { decodeToken, getToken } = require("../../utils/auth/auth");

const useAuth = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = getToken();
    if (token) {
      const decode = decodeToken(token);
      setUser(decode);
      localStorage.setItem("userInfo", JSON.stringify(decode));
      console.log("userInfo saved to localStorage");
    }
  }, []);

  return {
    isAuthencicated: !!user,
    user,
  };
};

export default useAuth;
