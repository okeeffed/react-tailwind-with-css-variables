import React from 'react';
import './App.css';
import {
  initiateSocket,
  subscribeToChat,
  sendMessage,
  disconnectSocket,
} from './socket';

const ThemeContext = React.createContext();
const CHAT_ROOM = 'example-room';

const SET_THEME = 'SET_THEME';

function themeReducer(state, action) {
  switch (action.type) {
    case SET_THEME:
      return {
        ...state,
        theme: action.payload,
      };
    default:
      return state;
  }
}

function ThemeProvider({ children, baseTheme = '' }) {
  const [state, dispatch] = React.useReducer(themeReducer, {
    theme: baseTheme,
  });
  const value = [state, dispatch];
  return (
    <ThemeContext.Provider value={value}>
      <div className={state.theme}>{children}</div>
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
  const [, themeDispatch] = useTheme();

  React.useEffect(() => {
    initiateSocket(CHAT_ROOM);
    subscribeToChat((err, data) => {
      if (err) return;
      themeDispatch(data);
    });
    return () => {
      disconnectSocket();
    };
  }, [themeDispatch]);

  return (
    <div className={`bg-primary flex items-center justify-center h-screen`}>
      <button
        onClick={() =>
          sendMessage(CHAT_ROOM, {
            type: SET_THEME,
            payload: undefined,
          })
        }
        className="bg-secondary p-4 mr-4 "
      >
        Set base theme
      </button>
      <button
        onClick={() =>
          sendMessage(CHAT_ROOM, {
            type: SET_THEME,
            payload: 'theme-dark',
          })
        }
        className="bg-secondary p-4 mr-4 "
      >
        Set dark theme
      </button>
      <button
        onClick={() =>
          sendMessage(CHAT_ROOM, {
            type: SET_THEME,
            payload: 'theme-alt',
          })
        }
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
