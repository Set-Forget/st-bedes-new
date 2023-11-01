import { useEffect, useState } from "react";

const useCheckLoginStatus = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
      const loggedInUser = sessionStorage.getItem("user");
      if (loggedInUser) {
          setIsLoggedIn(true);
      }
  }, []);

  return isLoggedIn;
};

export default useCheckLoginStatus;
