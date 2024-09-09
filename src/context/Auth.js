import { createContext, useContext } from "react";
import { useState } from "react";
import { getUserCookie, removeUserCookie } from "../helpers/cookies";
import { API_BASE_URL } from "../utils";
import Cookies from "js-cookie";

const userCookie = getUserCookie();
const initialAuthenticated = userCookie.token ? true : false;
const initialUser = Cookies.get("user")
  ? JSON.parse(Cookies.get("user"))
  : null;

const AuthContext = createContext({
  authenticated: initialAuthenticated,
  user: initialUser,
  token: userCookie.token || null,
  onLogin: async () => {},
  logout: () => {},
  updateUser: () => {},
  updateToken: () => {},
});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(initialAuthenticated);
  const [user, setUser] = useState(initialUser);
  const [token, setToken] = useState(userCookie.token);

  const updateToken = (token) => {
    setToken(token);
    Cookies.set("token", token, { expires: 7 });
  };

  const onLogin = async (token) => {
    setAuthenticated(true);
    const res = await fetch(API_BASE_URL + "/auth/account", {
      headers: {
        Authorization: `${token}`,
      },
    });
    const data = await res.json();
    setUser(data?.user);
    Cookies.set("user", JSON.stringify(data?.user), { expires: 7 });
    Cookies.set("token", token, { expires: 7 });
    updateToken(token);
  };

  const logout = () => {
    removeUserCookie();
    setAuthenticated(false);
    setUser(null);

    window.location.href = "/login-register";
  };

  console.log("Authenticated: ", authenticated);
  console.log("User: ", user);

  const updateUser = (data) => {
    setUser((prev) => ({ ...prev, ...data }));
    const savedUser = Cookies.get("user");
    const user = JSON.parse(savedUser);
    const newUser = { ...user, ...data };
    Cookies.set("user", JSON.stringify(newUser), { expires: 7 });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        onLogin,
        logout,
        authenticated,
        updateUser,
        token,
        updateToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
