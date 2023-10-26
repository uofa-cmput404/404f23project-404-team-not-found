import { createContext } from "react";

type UserContextType = {
  userToken: string | null;
  setUserToken: React.Dispatch<React.SetStateAction<string | null>>;
};

const iUserContextState = {
  userToken: null,
  setUserToken: () => {},
};

const UserContext = createContext<UserContextType>(iUserContextState);

export default UserContext;
