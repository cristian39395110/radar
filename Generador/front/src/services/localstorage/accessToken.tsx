const ACCESS_TOKEN_KEY = "accessToken";

export const saveAccessToken = (accessToken: string) =>
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);

export const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);

export const deleteAccessToken = () =>
  localStorage.removeItem(ACCESS_TOKEN_KEY);
