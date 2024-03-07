import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { saveAccessToken } from "../../services/localstorage/accessToken";
import { useAuthStore } from "../../state";
import { User } from "../../types/User";
import { dopplerApi } from "../doppler";
import { AuthUser } from "../types/AuthUser";
import { useMutation } from "react-query";
import { loginToFirebase } from "../../apis/reportUpload/firebase";

export const USER_KEY = "user";

const useAuth = () => {
  const { user, updateUser } = useAuthStore();

  const rest = useMutation("login", async (authUser: AuthUser) => {
    const { data: user } = await dopplerApi.post<User>("/auth", authUser);
    updateUser(user);
    const firebaseUser = await loginToFirebase();

    saveAccessToken(user.access_token);
    return user;
  });

  useEffect(() => {
    loginToFirebase();
    updateToken();
  }, []);

  const updateToken = async () => {
    const { data } = await dopplerApi.put<User>("/auth");
    updateUser(data);
  };

  return rest;
};

export default useAuth;
