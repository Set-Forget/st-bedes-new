const [isLoggedIn, setIsLoggedIn] = useState(false);

useEffect(() => {
    const loggedInUser = sessionStorage.getItem("user");
    if (loggedInUser) {
        setIsLoggedIn(true);
    }
}, []);
