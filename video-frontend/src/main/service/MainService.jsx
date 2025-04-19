import httpService from "./HttpService.jsx";

export const userService = {
    getUser: () => httpService.get('user')
}