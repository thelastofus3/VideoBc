import {nanoid} from "nanoid";
import {useState} from "react";
import {useNavigate} from "react-router-dom";

export const RoomSelection = () => {
    const [roomCode, setRoomCode] = useState('');
    const [splatPath, setSplatPath] = useState('B601.splat');
    const navigate = useNavigate();

    const predefinedRooms = ['B552', 'B697', 'B362', 'B765', 'B156'];
    const availableSplats = ['B601.splat', 'B405.splat'];

    const handleJoinRoom = () => {
        if (roomCode.trim()) {
            navigate(`/room/${roomCode}`, { state: { splatPath } });
        }
    };

    return (
        <div className="d-flex vh-100">
            <div className="d-flex flex-column align-items-center justify-content-center w-75">
                <h2 className="mb-3">Select Room & Splat</h2>

                <div className="mb-3" style={{ maxWidth: '300px' }}>
                    <label htmlFor="splat-select" className="form-label">Select Splat</label>
                    <select
                        id="splat-select"
                        className="form-select"
                        value={splatPath}
                        onChange={e => setSplatPath(e.target.value)}
                    >
                        {availableSplats.map(s => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                </div>

                <div className="input-group mb-3" style={{ maxWidth: '300px' }}>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Enter room or generate it"
                        value={roomCode}
                        onChange={e => setRoomCode(e.target.value)}
                    />
                    <button className="btn btn-outline-secondary" onClick={() => setRoomCode(nanoid(6))}>
                        Generate
                    </button>
                    <button className="btn btn-outline-secondary" onClick={() => navigator.clipboard.writeText(roomCode)} disabled={!roomCode}>
                        Copy
                    </button>
                </div>

                <button className="btn btn-primary w-100" style={{ maxWidth: '300px' }} onClick={handleJoinRoom}>
                    Enter
                </button>
            </div>

            <div className="border-left p-3 w-25 bg-light" style={{ minHeight: '100vh' }}>
                <h3>Available Rooms</h3>
                <ul className="list-group">
                    {predefinedRooms.map((room, idx) => (
                        <li
                            key={idx}
                            className="list-group-item list-group-item-action"
                            onClick={() => navigate(`/room/${room}`, { state: { splatPath } })}
                        >
                            {room}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};
