import Cookies from "js-cookie";

export const getUserCookie = () => {
  const token = Cookies.get("token");
  const role = Cookies.get("role");
  return { token, role };
};

export const setUserCookie = (token, role) => {
  Cookies.set("token", token, { expires: 1 });
  Cookies.set("role", role, { expires: 1 });
};

export const removeUserCookie = () => {
  Cookies.remove("token");
  Cookies.remove("role");
  Cookies.remove("user");
};
