export interface DataUpdate {
    id?: number;
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
    login: (user: User, skipServer?: boolean) => Promise<void>;
    logout: () => Promise<void>;
}
