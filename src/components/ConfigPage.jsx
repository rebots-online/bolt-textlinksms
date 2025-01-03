import React, { useState } from 'react';
    import styled from 'styled-components';

    const ConfigContainer = styled.div`
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 20px;
    `;

    const Input = styled.input`
      margin: 10px 0;
      padding: 8px;
      border: 1px solid ${(props) => props.theme.inputBorder};
      border-radius: 4px;
      background-color: ${(props) => props.theme.inputBackground};
      color: ${(props) => props.theme.text};
    `;

    const Button = styled.button`
      padding: 10px 15px;
      background-color: ${(props) => props.theme.buttonBackground};
      color: ${(props) => props.theme.buttonText};
      border: none;
      border-radius: 4px;
      cursor: pointer;
      margin-top: 10px;

      &:hover {
        background-color: ${(props) => props.theme.buttonHoverBackground};
      }
    `;

    const ThemeSelector = styled.div`
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: 20px;
    `;

    const ThemeDropdown = styled.select`
      padding: 8px;
      margin-bottom: 10px;
      border: 1px solid ${(props) => props.theme.inputBorder};
      border-radius: 4px;
      background-color: ${(props) => props.theme.inputBackground};
      color: ${(props) => props.theme.text};
    `;

    const ModeSelector = styled.div`
      display: flex;
      align-items: center;
      margin-bottom: 10px;
    `;

    const ModeLabel = styled.label`
      margin-right: 10px;
      color: ${(props) => props.theme.text};
    `;

    const ModeRadio = styled.input`
      margin-right: 5px;
    `;

    function ConfigPage({ apiKey, simCardId, webhookUrl, onConfigSubmit, theme, onThemeChange }) {
      const [localApiKey, setLocalApiKey] = useState(apiKey);
      const [localSimCardId, setLocalSimCardId] = useState(simCardId);
      const [localWebhookUrl, setLocalWebhookUrl] = useState(webhookUrl);
      const [localTheme, setLocalTheme] = useState(theme);
      const [localMode, setLocalMode] = useState(theme === 'light' || theme === 'dark' ? theme : 'light');

      const handleSubmit = (e) => {
        e.preventDefault();
        onConfigSubmit(localApiKey, localSimCardId, localWebhookUrl);
      };

      const handleThemeSelect = (e) => {
        const newTheme = e.target.value;
        setLocalTheme(newTheme);
        onThemeChange(newTheme === 'light' || newTheme === 'dark' ? newTheme : `${newTheme}-${localMode}`);
      };

      const handleModeSelect = (e) => {
        const newMode = e.target.value;
        setLocalMode(newMode);
        onThemeChange(localTheme === 'light' || localTheme === 'dark' ? newMode : `${localTheme}-${newMode}`);
      };

      return (
        <ConfigContainer>
          <h2>Configuration</h2>
          <form onSubmit={handleSubmit}>
            <Input
              type="text"
              placeholder="API Key"
              value={localApiKey}
              onChange={(e) => setLocalApiKey(e.target.value)}
              required
            />
            <Input
              type="text"
              placeholder="SIM Card ID"
              value={localSimCardId}
              onChange={(e) => setLocalSimCardId(e.target.value)}
              required
            />
            <Input
              type="text"
              placeholder="Webhook URL (e.g., http://your-ip:port/webhook)"
              value={localWebhookUrl}
              onChange={(e) => setLocalWebhookUrl(e.target.value)}
              required
            />
            <Button type="submit">Save Configuration</Button>
          </form>
          <ThemeSelector>
            <ThemeDropdown value={localTheme} onChange={handleThemeSelect}>
              <option value="brutalist">Brutalist</option>
              <option value="skeuomorphic">Skeuomorphic</option>
              <option value="glassmorphic">Glassmorphic</option>
            </ThemeDropdown>
            <ModeSelector>
              <ModeLabel>
                <ModeRadio
                  type="radio"
                  value="light"
                  checked={localMode === 'light'}
                  onChange={handleModeSelect}
                />
                Light
              </ModeLabel>
              <ModeLabel>
                <ModeRadio
                  type="radio"
                  value="dark"
                  checked={localMode === 'dark'}
                  onChange={handleModeSelect}
                />
                Dark
              </ModeLabel>
            </ModeSelector>
          </ThemeSelector>
          <p>
            For webhook URLs behind a firewall or in a container, consider using a service like
            <a href="https://www.cloudflare.com/products/tunnel/" target="_blank">Cloudflare Tunnel</a>.
            It can receive messages through a firewall directly to the tunnel endpoint, simplifying the process.
          </p>
        </ConfigContainer>
      );
    }

    export default ConfigPage;
