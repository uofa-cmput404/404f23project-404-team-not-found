import { createContext } from "react";
import { getToken } from "../utils/localStorageUtils";

type UserContextType = {
  userToken: string | null;
  setUserToken: React.Dispatch<React.SetStateAction<string | null>>;
};

const iUserContextState = {
  userToken: getToken(),
  setUserToken: () => {},
};

const UserContext = createContext<UserContextType>(iUserContextState);

export default UserContext;
