export const storeToken = (token: string) => {
  localStorage.setItem("authToken", token);
};

export const getToken = (token: string) => {
  return localStorage.getItem("authToken");
};
