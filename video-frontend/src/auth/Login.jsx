import React from 'react';
import {authService} from "./service/AuthService.jsx";
import {useNavigate} from "react-router-dom";
import styles from './styles/Auth.module.scss'
import {initialState, loginConfig} from "../config.jsx";
import {FormInput} from "./ui/input/FormInput.jsx";
import {UseFormHandler} from "./hook/UseFormHandler.jsx";

export const Login = () => {
    const navigate = useNavigate();
    const { formState, errorState, handleChange, handleSubmit } = UseFormHandler(
        initialState,
        authService.login,
        () => navigate('/')
    );

    return (
        <div className={`${styles.todo} d-flex justify-content-center align-items-center`}>
            <div className={`${styles.todo__card} card text-bg-light mb-3 w-100`}>
                <div className="card-body text-center">
                    <h2 className="fw-bold mb-2 mt-3 text-uppercase">Login</h2>
                    <p className="text-black-50 mb-3">Please enter email and password</p>
                    {errorState.general && (
                        <p className="text-danger">{errorState.general}</p>
                    )}
                    <form onSubmit={handleSubmit} className="mb-5">
                        {loginConfig.map((field) => (
                            <FormInput
                                key={field.name}
                                field={field}
                                value={formState[field.name] || ''}
                                onChange={handleChange}
                                error={errorState[field.name]}
                            />
                        ))}
                        <p className="small mb-4">
                            <a href="#" className="text-black-50">Forgot password?</a>
                        </p>
                        <button className="btn btn-outline-dark px-5">Login</button>
                    </form>
                    <div>
                        <p>Don't have an account have? <a onClick={() => navigate('/registration')}
                                                          className="text-black-50 fw-bold ">Sing up</a></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

