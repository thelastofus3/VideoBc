export const agoraConfig = {
    appId: "0f209564f7054d76b6e55fc0126cd4ce",
    channel: "main",
    token: null,
    uid: sessionStorage.getItem("uid") || String(Math.floor(Math.random() * 10000)),
};

export const cameraConfig = {
    encoderConfig: {
        width: 4096,
        height: 2160,
        frameRate: 30,
        bitrateMin: 1000,
        bitrateMax: 2500,
        orientationMode: 'adaptative',
    },
    optimizationMode: 'detail',
    facingMode: 'user',
};

export const registerConfig = [
    {
        name: "username",
        placeholder: "Username",
        type: "text"
    },
    {
        name: "email",
        placeholder: "E-mail",
        type: "email"
    },
    {
        name: "password",
        placeholder: "Password",
        type: "password"
    },
    {
        name: "matchingPassword",
        placeholder: "Confirm Password",
        type: "password"
    }
];
export const loginConfig = [
    {
        name: "email",
        placeholder: "E-mail",
        type: "email"
    },
    {
        name: "password",
        placeholder: "Password",
        type: "password"
    },
];

export const initialState = {
    username: "",
    email: "",
    password: "",
    matchingPassword: ""
};