import React from 'react';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {App} from "./main/App.jsx";
import {Login} from "./auth/Login.jsx";
import {Registration} from "./auth/Registration.jsx";
import {RoomSelection} from "./main/component/RoomSelection.jsx";

export const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<RoomSelection />} />
                <Route path="/room/:roomCode" element={<App />} />
                <Route path="/login" element={<Login />} />
                <Route path="/registration" element={<Registration />} />
            </Routes>
        </BrowserRouter>
    );
};
