import React, {useState} from 'react';

export const UseFormHandler = (initialState, serviceMethod, successCallback) => {
    const [formState, setFormState] = useState(initialState);
    const [errorState, setErrorState] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormState((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await serviceMethod(formState);
            localStorage.setItem('accessToken', response.data.accessToken);
            successCallback();
        } catch (error) {
            console.log(error.response);
            if (error.response && error.response.data && error.response.data.violations) {
                const apiErrors = {};
                error.response.data.violations.forEach((violation) => {
                    apiErrors[violation.field.split('.').pop()] = violation.message;
                });
                setErrorState(apiErrors);
            }
            if (error.response && error.response.data && error.response.data.message) {
                setErrorState({general: error.response.data.message});
            }
        }
    };

    return { formState, errorState, handleChange, handleSubmit };
};

