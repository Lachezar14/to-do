import React, { useEffect, useCallback, useState } from "react";

// Define the initial state for GlobalState
const initialGlobalState = {
    todos: [], // Array to store all TODO items
};

// Create a Context for the (global) State
const GlobalState = React.createContext();

const GlobalStateProvider = function ({ children }) {
    const [state, setState] = useState(initialGlobalState);

    // Function to update the global state
    const setGlobalState = useCallback(
        (data = {}) => {
            const newState = { ...state };

            // Update only the keys that are changing
            Object.keys(data).forEach((key) => {
                newState[key] = data[key];
            });

            // Apply the updated state
            setState(newState);
        },
        [state, setState]
    );

    // Attach the state setter globally for external access
    useEffect(() => {
        GlobalState.set = setGlobalState;
    }, [setGlobalState]);

    return (
        // Provide the current state and children components
        <GlobalState.Provider value={state}>{children}</GlobalState.Provider>
    );
};

// Hook for accessing the global state
const useGlobalState = () => React.useContext(GlobalState);

export { GlobalStateProvider, useGlobalState, GlobalState };
