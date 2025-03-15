import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; 

function App() {
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState('');
  const [messageText, setMessageText] = useState('');
  const [gallery, setGallery] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [activeTab, setActiveTab] = useState('chat'); 

  const backendUrl = 'http://localhost:5000';

  useEffect(() => {
    if (activeTab === 'chat') {
      fetchMessages();
    } else if (activeTab === 'gallery') {
      fetchGallery();
    }
  }, [activeTab]);

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`${backendUrl}/messages`);
      setMessages(response.data);
    } catch (error) {
      console.error('Błąd podczas pobierania wiadomości:', error);
    }
  };

  const fetchGallery = async () => {
    try {
      const response = await axios.get(`${backendUrl}/gallery`);
      setGallery(response.data);
    } catch (error) {
      console.error('Błąd podczas pobierania galerii:', error);
    }
  };

  const sendMessage = async () => {
    if (!username || !messageText) return;
    try {
      await axios.post(`${backendUrl}/message`, {
        username,
        message: messageText
      });
      setMessageText('');
      fetchMessages();
    } catch (error) {
      console.error('Błąd podczas wysyłania wiadomości:', error);
    }
  };

  const uploadFile = async () => {
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append('file', selectedFile);
    try {
      await axios.post(`${backendUrl}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSelectedFile(null);
      fetchGallery();
    } catch (error) {
      console.error('Błąd podczas przesyłania pliku:', error);
    }
  };

  return (
    <div className="app-container">
      <div className="switch-container">
        <button
          className={activeTab === 'chat' ? 'active' : ''}
          onClick={() => setActiveTab('chat')}
        >
          Chat
        </button>
        <button
          className={activeTab === 'gallery' ? 'active' : ''}
          onClick={() => setActiveTab('gallery')}
        >
          Galeria
        </button>
      </div>

      {activeTab === 'chat' && (
        <div className="chat-container">
          <h2>Chat grupowy</h2>
          <div className="chat-input">
            <input
              type="text"
              placeholder="Twoje imię"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <textarea
              placeholder="Napisz wiadomość..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
            />
            <button onClick={sendMessage}>Wyślij</button>
          </div>
          <div className="chat-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className="message">
                <span className="message-username">{msg.username}:</span>
                <span className="message-text">{msg.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'gallery' && (
        <div className="gallery-container">
          <h2>Galeria</h2>
          <div className="upload-container">
            <input type="file" onChange={(e) => setSelectedFile(e.target.files[0])} />
            <button onClick={uploadFile}>Prześlij plik</button>
          </div>
          <div className="gallery-grid">
            {gallery.map((filename, idx) => (
              <img
                key={idx}
                src={`${backendUrl}/uploads/${filename}`}
                alt={filename}
                className="gallery-image"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
