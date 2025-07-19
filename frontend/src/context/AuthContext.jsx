import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  axios.defaults.withCredentials = true;
  const [islogged, setIsLogged] = useState(false);
  const [userdata, setUserData] = useState(null); // Changed from false to null

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const getUserData = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/user/data`, {
        withCredentials: true,
      });

      console.log(response.data);

      if (response.data.success) {
        // setIsLogged(true)
        setUserData(response.data.userData);
      } else {
        toast.error(response.data.message || "Failed to fetch user data");
      }
    } catch (error) {
      //  setIsLogged(false);
      toast.error(
        error?.response?.data?.message || error.message || "Something went wrong"
      );
    }
  };

 const getAuthState = async () => {
  try {
    const response = await axios.get(`${backendUrl}/api/user-auth`, {
      withCredentials: true
    });

    if (response.data.success) {
      setIsLogged(true);
      getUserData();
    } else {
      setIsLogged(false);
    }
  } catch (error) {
    setIsLogged(false); // <- fallback for unauthenticated users
    console.warn("Not logged in:", error?.response?.data?.message);
  }
};

 
      useEffect(()=>{
    getAuthState();
  },[])

  const value = {
    backendUrl,
    getUserData,
    islogged,
    setIsLogged,
    userdata,
    setUserData,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
