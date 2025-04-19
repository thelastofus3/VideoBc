import React from 'react';
import {initialState, registerConfig} from "../config.jsx";
import {authService} from "./service/AuthService.jsx";
import {useNavigate} from "react-router-dom";
import styles from './styles/Auth.module.scss'
import {FormInput} from "./ui/input/FormInput.jsx";
import {UseFormHandler} from "./hook/UseFormHandler.jsx";


export const Registration = () => {
    const navigate = useNavigate();
    const { formState, errorState, handleChange, handleSubmit } = UseFormHandler(
        initialState,
        authService.register,
        () => navigate('/')
    );

    return (
        <div className={`${styles.todo} d-flex justify-content-center align-items-center`}>
            <div className={`${styles.todo__card} card text-bg-light mb-3 w-100`}>
                <div className="card-body text-center">
                    <h2 className="fw-bold mb-2 mt-3 text-uppercase">Registration</h2>
                    <p className="text-black-50 mb-3">Please enter whole information</p>
                    {errorState.general && (
                        <p className="text-danger">{errorState.general}</p>
                    )}
                    <form onSubmit={handleSubmit} className="mb-5">
                        {registerConfig.map((field) => (
                            <FormInput
                                key={field.name}
                                field={field}
                                value={formState[field.name] || ''}
                                onChange={handleChange}
                                error={errorState[field.name]}
                            />
                        ))}
                        <button className="btn btn-outline-dark px-5">Register</button>
                    </form>
                    <div>
                        <p>Already have an account? <a onClick={() => navigate('/login')}
                                                       className="text-black-50 fw-bold ">Log in</a></p>
                    </div>
                </div>
            </div>
        </div>
    );
};
