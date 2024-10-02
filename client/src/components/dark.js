import React, { useEffect, useState } from 'react';

const App = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    const toggleDarkMode = () => {
        setIsDarkMode(prevMode => !prevMode);
    };

    useEffect(() => {
        // Load the user's theme preference from local storage
        const savedTheme = localStorage.getItem('darkMode') === 'true';
        setIsDarkMode(savedTheme);
    }, []);

    useEffect(() => {
        // Save the user's theme preference to local storage
        localStorage.setItem('darkMode', isDarkMode);
        document.body.classList.toggle('dark-mode', isDarkMode); // Add/remove dark-mode class
    }, [isDarkMode]);

    return (
        <div className={isDarkMode ? 'dark' : 'light'}>
            <button onClick={toggleDarkMode}>
                {isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            </button>
            {/* Other components like <Dashboard /> */}
        </div>
    );
};

export default App;
