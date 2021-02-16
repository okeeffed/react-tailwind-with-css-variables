import React from 'react';
import './App.css';

const ThemeContext = React.createContext();

function ThemeProvider({ children, baseTheme = '' }) {
  const [theme, setTheme] = React.useState(baseTheme);
  const value = [theme, setTheme];
  return (
    <ThemeContext.Provider value={value}>
      <div className={theme}>{children}</div>
    </ThemeContext.Provider>
  );
}

function useTheme() {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error(`useCount must be rendered within the CountProvider`);
  }
  return context;
}

function KeepsBaseTheme() {
  return (
    <div className="theme-base bg-primary p-4">
      <p className="text-secondary">This maintains them original theme</p>
    </div>
  );
}

function DependsOnParent() {
  return (
    <div className="bg-primary p-4">
      <p className="text-secondary">
        This depends on the parent having context or not
      </p>
    </div>
  );
}

function ThemedExample() {
  const [, setTheme] = useTheme();

  return (
    <div className={`bg-primary flex items-center justify-center h-screen`}>
      <button
        onClick={() => setTheme(undefined)}
        className="bg-secondary p-4 mr-4 "
      >
        Set base theme
      </button>
      <button
        onClick={() => setTheme('theme-dark')}
        className="bg-secondary p-4 mr-4 "
      >
        Set dark theme
      </button>
      <button
        onClick={() => setTheme('theme-alt')}
        className="bg-secondary p-4"
      >
        Set alt theme
      </button>
      <div>
        <KeepsBaseTheme />
        <DependsOnParent />
      </div>
    </div>
  );
}

function App() {
  return (
    <div>
      <DependsOnParent />
      <ThemeProvider baseTheme="theme-dark">
        <ThemedExample />
      </ThemeProvider>
    </div>
  );
}

export default App;
