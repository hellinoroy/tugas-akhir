import { createContext } from "react";

export type User = {
    name: string;
    age: number;
    genderValue: number;
};

export const UserContext = createContext<User>({
    name: "",
    age: 0,
    genderValue: 0,
});
