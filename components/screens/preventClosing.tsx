// components/PreventClosing.jsx
"use client"; // This component must be a client component

import { useEffect } from 'react';

const PreventClosing = ({ shouldConfirmLeave = false }) => {
    useEffect(() => {
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            if (shouldConfirmLeave) {
                // Most browsers will display a generic message,
                // and you cannot customize the message in modern browsers.
                event.preventDefault();
                event.returnValue = ''; // Required for some older browsers
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [shouldConfirmLeave]);

    return null; // This component doesn't render anything visually
};

export default PreventClosing;