"use client";
import React, {
  createContext,
  PropsWithChildren,
  useReducer,
  Dispatch,
} from "react";

interface UserType {
  userid: string;
  roles: string[];
}

interface UserState {
  user: UserType;
}

// Define Action Type
type UserAction = { type: "GENERATE_USER"; payload: string };

// Define Context Type
interface UserContextType {
  state: UserState;
  dispatch: Dispatch<UserAction>;
}

// Initial State
const initialState: UserState = { user: { userid: "", roles: [] } };

// Reducer Function
const reducer = (state: UserState, action: UserAction): UserState => {
  switch (action.type) {
    case "GENERATE_USER":
      return { ...state, user: { ...state.user, userid: action.payload } };
    default:
      return state;
  }
};

// Create Context with Correct Type
export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

type UserProviderProps = {} & PropsWithChildren;
export const UserProvider = ({ children }: UserProviderProps) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      {children}
    </UserContext.Provider>
  );
};
