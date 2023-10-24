export const storeToken = (token: string) => {
  localStorage.setItem("authToken", token);
};

export const getToken = () => {
  return localStorage.getItem("authToken");
};

export const storeAuthorId = (authorId: string) => {
  localStorage.setItem("author_id", authorId);
};

export const getAuthorId = () => {
  return localStorage.getItem("authToken");
};
