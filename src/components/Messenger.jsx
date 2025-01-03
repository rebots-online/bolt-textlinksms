import React, { useState, useEffect, useRef } from 'react';
    import styled from 'styled-components';
    import axios from 'axios';

    const MessengerContainer = styled.div`
      display: flex;
      flex-direction: column;
      height: 100%;
    `;

    const MessagesContainer = styled.div`
      flex: 1;
      overflow-y: auto;
      padding: 10px;
    `;

    const Message = styled.div`
      padding: 8px;
      margin-bottom: 8px;
      border-radius: 8px;
      max-width: 70%;
      align-self: ${(props) => (props.isSent ? 'flex-end' : 'flex-start')};
      background-color: ${(props) => (props.isSent ? props.theme.sentMessageBackground : props.theme.receivedMessageBackground)};
      color: ${(props) => props.theme.text};
      word-wrap: break-word;
    `;

    const InputContainer = styled.div`
      display: flex;
      padding: 10px;
      border-top: 1px solid ${(props) => props.theme.inputBorder};
    `;

    const Input = styled.input`
      flex: 1;
      padding: 8px;
      border: 1px solid ${(props) => props.theme.inputBorder};
      border-radius: 4px;
      margin-right: 10px;
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

      &:hover {
        background-color: ${(props) => props.theme.buttonHoverBackground};
      }
    `;

    const ConversationList = styled.div`
      width: 200px;
      border-right: 1px solid ${(props) => props.theme.inputBorder};
      padding: 10px;
      overflow-y: auto;
    `;

    const ConversationItem = styled.div`
      padding: 8px;
      cursor: pointer;
      background-color: ${(props) => (props.active ? props.theme.conversationActiveBackground : 'transparent')};
      color: ${(props) => props.theme.text};

      &:hover {
        background-color: ${(props) => props.theme.conversationHoverBackground};
      }
    `;

    const MainContent = styled.div`
      display: flex;
      flex: 1;
    `;

    function Messenger({ apiKey, simCardId, webhookUrl, theme, onThemeChange }) {
      const [phoneNumber, setPhoneNumber] = useState('');
      const [messageText, setMessageText] = useState('');
      const [messages, setMessages] = useState({});
      const [conversations, setConversations] = useState([]);
      const [selectedConversation, setSelectedConversation] = useState(null);
      const messagesContainerRef = useRef(null);

      useEffect(() => {
        const storedMessages = localStorage.getItem('messages');
        if (storedMessages) {
          setMessages(JSON.parse(storedMessages));
        }
      }, []);

      useEffect(() => {
        localStorage.setItem('messages', JSON.stringify(messages));
        const newConversations = Object.keys(messages);
        setConversations(newConversations);
      }, [messages]);

      useEffect(() => {
        if (messagesContainerRef.current) {
          messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
      }, [messages, selectedConversation]);

      const handleSendMessage = async () => {
        if (!phoneNumber || !messageText) return;

        const formattedPhoneNumber = formatPhoneNumber(phoneNumber);

        try {
          const response = await axios.post(
            'https://api.textlinksms.com/v1/sms',
            {
              to: formattedPhoneNumber,
              message: messageText,
              sim_card_id: simCardId,
            },
            {
              headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
              },
            }
          );

          if (response.status === 200) {
            const newMessage = { text: messageText, isSent: true, timestamp: new Date().toISOString() };
            setMessages((prevMessages) => ({
              ...prevMessages,
              [formattedPhoneNumber]: [...(prevMessages[formattedPhoneNumber] || []), newMessage],
            }));
            setMessageText('');
          } else {
            console.error('Failed to send message:', response);
          }
        } catch (error) {
          console.error('Error sending message:', error);
        }
      };

      const handleWebhook = async (data) => {
        if (!data || !data.from || !data.message) return;

        const formattedFromNumber = formatPhoneNumber(data.from);
        const newMessage = { text: data.message, isSent: false, timestamp: new Date().toISOString() };

        setMessages((prevMessages) => ({
          ...prevMessages,
          [formattedFromNumber]: [...(prevMessages[formattedFromNumber] || []), newMessage],
        }));
      };

      useEffect(() => {
        const handleIncomingMessage = async (event) => {
          if (event.source && event.origin !== window.location.origin) return;
          if (event.data && event.data.type === 'webhook') {
            handleWebhook(event.data.payload);
          }
        };

        window.addEventListener('message', handleIncomingMessage);

        return () => {
          window.removeEventListener('message', handleIncomingMessage);
        };
      }, []);

      useEffect(() => {
        if (webhookUrl) {
          const startWebhookListener = async () => {
            try {
              const response = await axios.post(
                `${webhookUrl}/webhook`,
                {
                  type: 'webhook',
                  payload: {
                    message: 'Webhook listener started',
                  },
                },
                {
                  headers: {
                    'Content-Type': 'application/json',
                  },
                }
              );
              if (response.status === 200) {
                console.log('Webhook listener started');
              }
            } catch (error) {
              console.error('Error starting webhook listener:', error);
            }
          };
          startWebhookListener();
        }
      }, [webhookUrl]);

      const handleConversationSelect = (number) => {
        setSelectedConversation(number);
      };

      const formatPhoneNumber = (number) => {
        const cleaned = ('' + number).replace(/\D/g, '');
        if (cleaned.startsWith('1') && cleaned.length === 11) {
          return `+${cleaned}`;
        } else if (cleaned.length === 10) {
          return `+1${cleaned}`;
        } else if (cleaned.startsWith('+')) {
          return cleaned;
        }
        return number;
      };

      const displayedMessages = selectedConversation ? messages[selectedConversation] || [] : [];

      return (
        <MessengerContainer>
          <MainContent>
            <ConversationList>
              {conversations.map((number) => (
                <ConversationItem
                  key={number}
                  onClick={() => handleConversationSelect(number)}
                  active={selectedConversation === number}
                >
                  {number}
                </ConversationItem>
              ))}
            </ConversationList>
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <MessagesContainer ref={messagesContainerRef}>
                {displayedMessages.map((msg, index) => (
                  <Message key={index} isSent={msg.isSent}>
                    {msg.text}
                  </Message>
                ))}
              </MessagesContainer>
              <InputContainer>
                <Input
                  type="text"
                  placeholder="Phone Number (e.g., +15551234567 or 5551234567)"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
                <Input
                  type="text"
                  placeholder="Message"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                />
                <Button onClick={handleSendMessage}>Send</Button>
              </InputContainer>
            </div>
          </MainContent>
        </MessengerContainer>
      );
    }

    export default Messenger;
