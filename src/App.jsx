import React, { useState, useEffect } from 'react';
    import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
    import styled, { ThemeProvider } from 'styled-components';
    import ConfigPage from './components/ConfigPage';
    import Messenger from './components/Messenger';
    import { lightTheme, darkTheme, brutalistTheme, skeuomorphicTheme, glassmorphicTheme } from './themes';

    const AppContainer = styled.div`
      display: flex;
      flex-direction: column;
      height: 100vh;
      background-color: ${(props) => props.theme.background};
      color: ${(props) => props.theme.text};
    `;

    function App() {
      const [apiKey, setApiKey] = useState(localStorage.getItem('apiKey') || '');
      const [simCardId, setSimCardId] = useState(localStorage.getItem('simCardId') || '');
      const [webhookUrl, setWebhookUrl] = useState(localStorage.getItem('webhookUrl') || '');
      const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
      const navigate = useNavigate();

      useEffect(() => {
        localStorage.setItem('apiKey', apiKey);
        localStorage.setItem('simCardId', simCardId);
        localStorage.setItem('webhookUrl', webhookUrl);
        localStorage.setItem('theme', theme);
      }, [apiKey, simCardId, webhookUrl, theme]);

      const handleThemeChange = (newTheme) => {
        setTheme(newTheme);
      };

      const handleConfigSubmit = (newApiKey, newSimCardId, newWebhookUrl) => {
        setApiKey(newApiKey);
        setSimCardId(newSimCardId);
        setWebhookUrl(newWebhookUrl);
        navigate('/messenger');
      };

      const currentTheme =
        theme === 'light'
          ? lightTheme
          : theme === 'dark'
          ? darkTheme
          : theme === 'brutalist-light'
          ? brutalistTheme
          : theme === 'brutalist-dark'
          ? { ...brutalistTheme, ...darkTheme }
          : theme === 'skeuomorphic-light'
          ? skeuomorphicTheme
          : theme === 'skeuomorphic-dark'
          ? { ...skeuomorphicTheme, ...darkTheme }
          : theme === 'glassmorphic-light'
          ? glassmorphicTheme
          : { ...glassmorphicTheme, ...darkTheme };

      return (
        <ThemeProvider theme={currentTheme}>
          <AppContainer>
            <Routes>
              <Route
                path="/"
                element={<ConfigPage
                  apiKey={apiKey}
                  simCardId={simCardId}
                  webhookUrl={webhookUrl}
                  onConfigSubmit={handleConfigSubmit}
                  theme={theme}
                  onThemeChange={handleThemeChange}
                />}
              />
              <Route
                path="/messenger"
                element={<Messenger
                  apiKey={apiKey}
                  simCardId={simCardId}
                  webhookUrl={webhookUrl}
                  theme={theme}
                  onThemeChange={handleThemeChange}
                />}
              />
            </Routes>
          </AppContainer>
        </ThemeProvider>
      );
    }

    function AppWrapper() {
      return (
        <Router>
          <App />
        </Router>
      );
    }

    export default AppWrapper;
