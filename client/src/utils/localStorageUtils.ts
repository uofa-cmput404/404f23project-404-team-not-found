export const storeToken = (token: string) => {
  localStorage.setItem("authToken", token);
};

export const getToken = () => {
  return localStorage.getItem("authToken");
};

export const removeToken = () => {
  return localStorage.removeItem("authToken");
};

export const storeAuthorId = (authorId: string) => {
  localStorage.setItem("author_id", authorId);
};

export const getAuthorId = () => {
  return localStorage.getItem("author_id");
};

export const removeAuthorId = () => {
  return localStorage.removeItem("author_id");
};

export const storeUserData = (data: string) => {
  localStorage.setItem("user_data", data);
};

export const getUserData = () => {
  const user_data = localStorage.getItem("user_data");
  return user_data ? JSON.parse(user_data) : null;
};

export const removeUserData = () => {
  return localStorage.removeItem("user_data");
};

export const storeUserCredentials = (username: string, password: string) => {
  localStorage.setItem("username", username);
  localStorage.setItem("password", password);
};

export const getUserCredentials = () => {
  const username = localStorage.getItem("username");
  const password = localStorage.getItem("password");
  return { username: username, password: password };
};

export const removeUserCredentials = () => {
  localStorage.removeItem("username");
  localStorage.removeItem("password");
};
