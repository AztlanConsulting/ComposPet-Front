import { useContext, useEffect } from 'react';
import { UNSAFE_NavigationContext } from 'react-router-dom';

export default function usePrompt(when) {
    const navigationContext = useContext(
        UNSAFE_NavigationContext
    );

    const navigator = navigationContext?.navigator;

    useEffect(() => {
        if (!when || !navigator) return;

        const push = navigator.push;

        navigator.push = (...args) => {
            const confirmLeave = window.confirm(
                'Tienes cambios pendientes. Guarda o descarta los cambios antes de salir.'
            );

            if (confirmLeave) {
                push.apply(navigator, args);
            }
        };

        return () => {
            navigator.push = push;
        };
    }, [navigator, when]);
}