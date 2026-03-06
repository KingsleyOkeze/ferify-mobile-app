import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { DeviceEventEmitter } from 'react-native';

export type ToastType = 'success' | 'error' | 'badge' | 'points' | 'saved' | 'general';

interface ToastOptions {
    type: ToastType;
    message: string;
    duration?: number;
}

interface ToastContextType {
    showToast: (type: ToastType, message: string, duration?: number) => void;
    hideToast: () => void;
    activeToast: ToastOptions | null;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
    const [activeToast, setActiveToast] = useState<ToastOptions | null>(null);

    const hideToast = useCallback(() => {
        setActiveToast(null);
    }, []);

    const showToast = useCallback((type: ToastType, message: string, duration: number = 4000) => {
        setActiveToast({ type, message, duration });
    }, []);

    useEffect(() => {
        const subscription = DeviceEventEmitter.addListener('SHOW_TOAST', (data: ToastOptions) => {
            showToast(data.type, data.message, data.duration);
        });

        return () => {
            subscription.remove();
        };
    }, [showToast]);

    return (
        <ToastContext.Provider value={{ showToast, hideToast, activeToast }}>
            {children}
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};
