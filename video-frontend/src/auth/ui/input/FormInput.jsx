import React from 'react';

export const FormInput = ({ field, value, onChange, error }) => {
    return (
        <div>
            <input
                type={field.type}
                className="form-control mb-3"
                placeholder={field.placeholder}
                name={field.name}
                value={value}
                onChange={onChange}
            />
            {error && (<p className="text-danger">{error}</p>)}
        </div>
    );
};

