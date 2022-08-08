import axios from '../utils/axios';
import { User } from '../models';

function timeout(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const userService = {
    async get() {
        try {
            const { data } = await axios.get<User>('account');
            return data;
        } catch (error) {
            return null;
        }
    },
    async login(user: User) {
        const serverUser = await axios.post<User>('account/login', user);
    },
    async logout() {
        await axios.post('account/logout');
    }
};

export { userService };