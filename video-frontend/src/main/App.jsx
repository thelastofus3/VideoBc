import {useEffect, useState} from "react";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {userService} from "./service/MainService.jsx";
import {SceneComponent} from "./component/SceneComponent.jsx";

export function App() {
    const { roomCode } = useParams();
    const { state } = useLocation();
    const [userEmail, setUserEmail] = useState('');
    const navigate = useNavigate();
    const splatPath = state?.splatPath || 'B601.splat';

    useEffect(() => {
        (async () => {
            try {
                const response = await userService.getUser();
                setUserEmail(response.data.email);
            } catch (error) {
                console.error('Error while getting user email', error);
                navigate('/login');
            }
        })();
    }, []);

    return (
        <SceneComponent
            userEmail={userEmail}
            roomCode={roomCode}
            splatPath={splatPath}
        />
    );
}