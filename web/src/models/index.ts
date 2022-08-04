export interface DataUpdate {
    device: string;
    value: string;
}

export interface User {
    name: string;
    color: string;
    icon: string;
    age: number;
}

export interface AuthContextType {
    user: User;
    login: (user: User) => Promise<void>;
    logout: () => Promise<void>;
}
