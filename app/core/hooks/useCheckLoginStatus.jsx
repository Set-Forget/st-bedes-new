import { useEffect, useState } from "react";

export const useCheckLoginStatus = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loggedInUser = sessionStorage.getItem("user");

    if (loggedInUser) {
      setIsLoggedIn(true);
    }
  }, []);

  return isLoggedIn;
};
