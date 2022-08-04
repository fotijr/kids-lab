import { User } from '../models';

function timeout(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const userService = {
    authenticated: false,
    async login(user: User) {
        userService.authenticated = true;
        await timeout(400);
    },
    async logout() {
        userService.authenticated = false;
        await timeout(400);
    },
};

export { userService };