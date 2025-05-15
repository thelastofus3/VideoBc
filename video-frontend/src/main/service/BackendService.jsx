import roomService from "./RoomService.jsx";

export class BackendService {
    async registerWithBackend(roomCode, role, uid) {
        try {
            await roomService.joinRoom(roomCode, role, uid);
            return true;
        } catch (error) {
            if (error.response && error.response.data) {
                throw new Error(error.response.data.error || 'Failed to join room');
            }
            throw error;
        }
    }

    async unregisterFromBackend(roomCode, role, uid) {
        try {
            await roomService.leaveRoom(roomCode, role, uid);
            return true;
        } catch (error) {
            console.error("Error leaving room in backend:", error);
            return false;
        }
    }
}