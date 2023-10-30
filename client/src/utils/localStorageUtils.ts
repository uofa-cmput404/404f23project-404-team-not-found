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
