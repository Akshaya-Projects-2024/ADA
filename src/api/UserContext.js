import React, { createContext, useCallback, useContext, useState, useEffect } from "react";


import { useDispatch } from "react-redux";
import { decryptService } from "../utils/storageFunc";
import { getProfile } from "../redux-store/actions/auth";
import { dispatchUserData } from "../redux-store/actions/registerAction";


const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const dispatch = useDispatch();

  const apiInitCall = useCallback(async () => {
    try {
      const obj = {
        userid: await decryptService("userId"),
      };
      const response = await getProfile(obj);
      if (response?.status === 200) {
        dispatch(dispatchUserData(response?.data?.data));
        setUserData(response?.data?.data);
        console.log("User Data:", response?.data?.data);
      }
      return response?.data?.data || false;
    } catch (error) {
      console.log("Error fetching user data:", error);
      return false;
    }
  }, [dispatch]);

  useEffect(() => {
    apiInitCall(); // Fetch user data when component mounts
  }, [apiInitCall]);

  return (
    <UserContext.Provider value={{ userData, apiInitCall }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
