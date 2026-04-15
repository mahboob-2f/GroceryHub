import React from 'react';

const ButtonLoader = ({ className = '' }) => {
    return (
        <span
            className={`inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent ${className}`}
            aria-hidden="true"
        />
    );
};

export default ButtonLoader;
