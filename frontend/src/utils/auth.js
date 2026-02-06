export const isLoggedIn = () => {
  return localStorage.getItem("token") ? true : false;
};

export const isAdmin = () => {
  return localStorage.getItem("role") === "admin";
};
