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
  const [showLodaing, setShowLoading] = useState(true)
  const backendUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    if (activeTab === 'chat') {
      fetchMessages();
    } else if (activeTab === 'gallery') {
      fetchGallery();
    }
  }, [activeTab]);

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`http://${backendUrl}/messages`);
      setMessages(response.data);
      setShowLoading(false)
    } catch (error) {
      console.error('Błąd podczas pobierania wiadomości:', error);
    }
  };

  const fetchGallery = async () => {
    try {
      const response = await axios.get(`http://${backendUrl}/gallery`);
      setGallery(response.data);
      setShowLoading(false)
    } catch (error) {
      console.error('Błąd podczas pobierania galerii:', error);
    }
  };

  const sendMessage = async () => {
    if (!username || !messageText) return;
    try {
      await axios.post(`http://${backendUrl}/message`, {
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
      await axios.post(`http://${backendUrl}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSelectedFile(null);
      fetchGallery();
    } catch (error) {
      console.error('Błąd podczas przesyłania pliku:', error);
    }
  };

  return (
    <div className="app-container shadow mt-5">
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
        <div className="chat-container shadow-sm">
          <h2 className='border-bottom border-primary p-2'>Chat grupowy</h2>
          {showLodaing && (
            <div className='d-flex justify-content-center mb-3'>
              <div className="spinner-border text-primary" style={{"width": "3rem", "height": "3rem"}}>
              </div>
            </div>
          )}

          {!showLodaing && (
          <div className="chat-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className="message">
                <span className="message-username">{msg.username}:</span>
                <span className="message-text">{msg.message}</span>
              </div>
            ))}
          </div>
          )}

          <div className="chat-input border-top border-primary pt-2">
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
        </div>
      )}

      {activeTab === 'gallery' && (
        <div className="gallery-container shadow-sm">
          <h2 className='border-bottom border-primary p-2'>Galeria</h2>
          {showLodaing && (
            <div className='d-flex justify-content-center'>
              <div className="spinner-border text-primary" style={{"width": "3rem", "height": "3rem"}}>
              </div>
            </div>
          )}
          {!showLodaing && (
          <div className="gallery-grid">
            {gallery.map((filename, idx) => (
              <img
                key={idx}
                src={`http://${backendUrl}/uploads/${filename}`}
                alt={filename}
                className="gallery-image"
              />
            ))}
          </div>
          )}
          <div className="input-group pt-2">
            <input className='form-control' type="file" onChange={(e) => setSelectedFile(e.target.files[0])} />
            <button className='btn btn-primary' onClick={uploadFile}>Prześlij plik</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
