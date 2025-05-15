import httpService from "./HttpService.jsx";

export const roomService = {
    joinRoom: (roomCode, role, uid) =>
        httpService.post('room/join', {
            roomCode,
            role,
            uid: uid.toString()
        }),

    leaveRoom: (roomCode, role, uid) =>
        httpService.post('room/leave', {
            roomCode,
            role,
            uid: uid.toString()
        })
}

export default roomService;