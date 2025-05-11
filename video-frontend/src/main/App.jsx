import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {userService} from "./service/MainService.jsx";
import {SceneComponent} from "./scene/SceneComponent.jsx";

export function App() {
    const { roomCode } = useParams();
    const [userEmail, setUserEmail] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await userService.getUser();
                setUserEmail(response.data.email);
            } catch (error) {
                console.log("Error while getting user email" ,error);
                navigate('/login')
            }
        };

        fetchData();
    }, []);

    return (
        <SceneComponent userEmail={userEmail} roomCode={roomCode} />
    );
}