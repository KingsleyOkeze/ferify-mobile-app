import React, { createContext, useState, useContext, ReactNode } from 'react';
import GlobalLoader from '../components/GlobalLoader'; 

interface LoaderContextType {
    isLoading: boolean;
    showLoader: () => void;
    hideLoader: () => void;
}

const LoaderContext = createContext<LoaderContextType>({
    isLoading: false,
    showLoader: () => {},
    hideLoader: () => {},
});

export const LoaderProvider = ({ children }: { children: ReactNode }) => {
    const [isLoading, setIsLoading] = useState(false);

    const showLoader = () => setIsLoading(true);
    const hideLoader = () => setIsLoading(false);

    return (
        <LoaderContext.Provider value={{ isLoading, showLoader, hideLoader }}>
            {children}
            {/* The Loader sits here, on top of everything */}
            <GlobalLoader visible={isLoading} />
        </LoaderContext.Provider>
    );
};

export const useLoader = () => useContext(LoaderContext);