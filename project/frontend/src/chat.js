import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; 
import { useNavigate } from "react-router-dom";


function ChatApp() {
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState(sessionStorage.getItem("username"));
  const [messageText, setMessageText] = useState('');
  const [gallery, setGallery] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [activeTab, setActiveTab] = useState('chat'); 
  const [showLodaing, setShowLoading] = useState(true)
  const [imageUrls, setImageUrls] = useState({});
  const backendUrl = process.env.REACT_APP_API_URL;
  
  const [isMessageError, setIsMessageError] = useState(false)
  const navigate = useNavigate();

  const logout = async () =>{
    sessionStorage.removeItem("accessToken")
    sessionStorage.removeItem("idToken")
    sessionStorage.removeItem("refreshToken")
    sessionStorage.removeItem("idToken")
    navigate("/login")
  }

  useEffect(() => {
    if (activeTab === 'chat') {
      fetchMessages();
      setIsMessageError(false)
    } else if (activeTab === 'gallery') {
      fetchGallery();
      setIsMessageError(false)
    }
  }, [activeTab]);

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`http://${backendUrl}/messages`,
        {
          headers: {
            'Access-Control-Allow-Origin': '*',
            "Authorization": `Bearer ${sessionStorage.getItem('idToken')}`
          }
        }
      );
      setMessages(response.data);
    } catch (error) {
      console.error('Błąd podczas pobierania wiadomości:', error);
    } finally{
      setShowLoading(false)
    }
  };

  const fetchGallery = async () => {
    try {
      const response1 = await axios.get(`http://${backendUrl}/gallery`, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          "Authorization": `Bearer ${sessionStorage.getItem('idToken')}`
        }
      });
  
      setGallery(response1.data);
  
      const urls = {};
      console.log(response1.data);
      
      for (const filename of response1.data) {
        try {
          const response2 = await fetch(`http://${backendUrl}/uploads/${filename}`, {
            headers: {
              "Authorization": `Bearer ${sessionStorage.getItem("idToken")}`,
              'Access-Control-Allow-Origin': '*',
            },
          });
  
          if (response2.ok) {
            const blob = await response2.blob();
            urls[filename] = URL.createObjectURL(blob);
          } else {
            console.error("Failed to fetch image:", filename);
          }
        } catch (error) {
          console.error("Error fetching image:", error);
        }
      }
      setImageUrls(urls);
    } catch (error) {
      console.error('Error fetching gallery:', error);
    } finally {
      setShowLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!username || !messageText) return;
    try {
      await axios.post(`http://${backendUrl}/message`, {
        username,
        message: messageText,
        
      },
      {
        headers:{
        'Access-Control-Allow-Origin': '*',
        "Authorization": `Bearer ${sessionStorage.getItem('idToken')}`
        }
      });
      setMessageText('');
      setIsMessageError(false)
      fetchMessages();
    } catch (error) {
      console.error('Błąd podczas wysyłania wiadomości:', error);
      setIsMessageError(true)
    }
  };

  const uploadFile = async () => {
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append('file', selectedFile);
    try {
      await axios.post(`http://${backendUrl}/upload`, formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          'Access-Control-Allow-Origin': '*',
          "Authorization": `Bearer ${sessionStorage.getItem('idToken')}` 
        }
      });
      setSelectedFile(null);
      fetchGallery();
      setIsMessageError(false)
    } catch (error) {
      console.error('Błąd podczas przesyłania pliku:', error);
      setIsMessageError(true)
    }
  };

  return (
    <div className="app-container shadow mt-5">
      <div className="switch-container d-flex justify-content-around">
        <div>
        <button
          className={`btn mr-3 ${activeTab === 'chat' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('chat')}
        >
          Chat
        </button>
        <button
          className={`btn ${activeTab === 'gallery' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('gallery')}
        >
          Galery
        </button>
        </div>
        <div className='m-0 d-flex flex-row align-items-center'>
          <span className="mr-2 bg-info text-light rounded-pill p-2">User: {username}</span>
          <button className='btn btn-danger' onClick={logout}>Logout</button>
        </div>
      </div>

      {activeTab === 'chat' && (
        <div className="chat-container shadow-sm">
          <h2 className='border-bottom border-primary pb-3'>Group chat</h2>
          {showLodaing && (
            <div className='d-flex justify-content-center mb-3'>
              <div className="spinner-border text-primary" style={{"width": "3rem", "height": "3rem"}}>
              </div>
            </div>
          )}

          {!showLodaing && (
            ((messages.length) > 0) ?(
          <div className="chat-messages mb-2">
            {messages.map((msg, idx) => (
              <div key={idx} className="message">
                <span className="message-username">{msg.username}:</span>
                <span className="message-text">{msg.message}</span>
              </div>
            ))}
          </div>
          ): (<div className='chat-messages mb-2'>There is no messages to show</div>))}

          <div className="chat-input border-top border-primary pt-2 mb-0">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className='d-none'
            />
            <textarea
              placeholder="Write a message"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
            />
            <div className='d-flex justify-content-between'>
            <button className='btn btn-primary' onClick={sendMessage}>Send</button>
            {isMessageError && (<div class="alert alert-danger m-0">
              Something went wrong during send message, try again
            </div>)}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'gallery' && (
        <div className="gallery-container shadow-sm">
          <h2 className='border-bottom border-primary p-2'>Galery</h2>
          {showLodaing && (
            <div className='d-flex justify-content-center'>
              <div className="spinner-border text-primary mb-2 border-bottom border-primary p-2" style={{"width": "3rem", "height": "3rem"}}>
              </div>
            </div>
          )}
          {!showLodaing && (
            (gallery.length) > 0 ? (
          <div className="gallery-grid border-bottom border-primary p-2">
            {gallery.map((filename, idx) => (
              <img
                key={idx}
                src={imageUrls[filename] || ""}
                alt={filename}
                className="gallery-image"
              />
            ))}
          </div>
          ): (<div className='gallery-grid mb-2 border-bottom border-primary p-2'>
            There is no images in gallery. 
          </div>))}
          <div className="input-group pt-2">
            <input className='form-control' type="file" onChange={(e) => setSelectedFile(e.target.files[0])} />
            <button className='btn btn-primary' onClick={uploadFile}>Send file</button>
          </div>
          {isMessageError && (<div class="alert alert-danger mb-0 mt-3">
              Something went wrong during upload, try again
            </div>)}
        </div>
      )}
    </div>
  );
}

export default ChatApp;
