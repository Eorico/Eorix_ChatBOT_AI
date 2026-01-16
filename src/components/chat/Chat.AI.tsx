import { Send, Mic, VolumeX, Volume2 } from 'lucide-react';
import '../../style/chatBox.css';
import { useRef, useState, useEffect } from 'react';

import fetchAIResponse from '../../fetchAPI/send.message.api';

import { typeMessage } from './helper/chat.type.effect';
import { speakText } from './helper/chat.text.speech';
import type { ChatAIProps } from '../../types/interfaces';

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default function ChatAI({setRobotAnim}:ChatAIProps) {
  const [messages, setMessage] = useState<{ sender: string; text: string }[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setRecording] = useState(false);
  const recognitionRef = useRef<any>(null);
  const chatBodyRef = useRef<HTMLDivElement>(null);  
  const [isMuted, setMuted] = useState(false);

  const [typing, setTyping] = useState(false);

  const [, setCurrentModelAi] = useState<"Eorix" | "openSourceAi" | "none">('Eorix');

  useEffect(() => {
    const chat = chatBodyRef.current;
    if (!chat) return;

    // instant scroll to bottom
    chat.scrollTop = chat.scrollHeight;
  }, [messages]);


  useEffect(() => {
    const greetUserAuto = async () => {

      setRobotAnim('wave');

      const { reply, source } = await fetchAIResponse('hello');

      setCurrentModelAi(source ?? 'none');
       
      setMessage([{sender: 'ai', text: reply}]);
      speakText(reply, !isMuted);

      setTimeout(() => setRobotAnim('idle'), 1000);
      
    };
    greetUserAuto();
  }, []);

                                                                                                                                                      

  if (typeof window !== 'undefined' && !recognitionRef.current) {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setInputValue(transcript);
      };

      recognitionRef.current.onend = () => setRecording(false);
    }
  }

  const sendMessage = async () => {
    if (!inputValue.trim()) return;

    const userInput = inputValue;

    setMessage((prev) => [
      ...prev,
      { sender: 'user', text: userInput },
    ]);
    
    setInputValue('');
    setRobotAnim('talking');

    setTyping(true); // from here the typing will start when the user has a chat

    try {
      const { reply, source, intent } = await fetchAIResponse(userInput);
      setCurrentModelAi(source ?? 'none');

      setTyping(false); // stop indicator

       
      setMessage((prev) => {
        const aiIndex = prev.length; 
        const newMessages = [...prev, { sender: 'ai', text: '' }];
        
   
        typeMessage(reply, (currentTxt) => {
          setMessage((prevTyping) => {
            const updated = [...prevTyping];
            updated[aiIndex] = { sender: 'ai', text: currentTxt };
            return updated;
          });

          const chat = chatBodyRef.current;
          if (chat) chat.scrollTop = chat.scrollHeight;
        });

        return newMessages;
      });

      speakText(reply, isMuted);

      if (intent?.toLowerCase() === 'dance' || reply.toLowerCase().includes("dance")) {
        setRobotAnim('dance');
        setTimeout(() => {
            setTimeout(() => {
            setRobotAnim('idle');
          }, 4000);
        }, reply.length * 30);
        return;
      }

      setTimeout(() => setRobotAnim('idle'), reply.length * 30);
    } catch (error) {
      setTyping(false);
       setMessage((prev) => [
      ...prev.slice(0, -1),
      { sender: 'ai', text: 'Something went wrong.' },
      ]);

      setTimeout(() => {
        const chat = chatBodyRef.current;
        if (chat) chat.scrollTop = chat.scrollHeight;
      }, 0);
    }
    
  };

  const clickVoiceRecording = () => {
    if (!recognitionRef.current) return;

    if (isRecording) {
      recognitionRef.current.stop();
      setRecording(false);
    } else {
      recognitionRef.current.start();
      setRecording(true);
    }
  };

  return (
    <div className="ai">
      <div className="ai-header">
        <div className="header-row">
           <div className="ai-title">
            <img src="/assets/Eorix.png" alt="Logo" className="ai-logo" />
            <span>EORIX</span>
          </div>
          <div className="status-badge">
            <div className={`status-dot ${isRecording ? 'recording' : ''}`}></div>
            <span className={`status-text ${isRecording ? 'recording' : ''}`}>
              {isRecording ? 'Recording...' : 'OFF'}
            </span>
          </div>
        </div>
      </div>

      <div className="ai-body" ref={chatBodyRef}>
        <div className="message-wrapper">
          {messages.map((msg, idx) => (

            <div key={idx} className={`message-row ${msg.sender}`}>

              {msg.sender === 'ai' && <img src="/assets/Eorix.png" alt="Ai" className='avatar'/>}

              <div className='message-bubble'>{msg.text}</div>

              {msg.sender === 'user' && <img src="/assets/user.png" alt="User" className='avatar'/>}
              
            </div>
            
          ))}

          {typing && (
            <div className='message-row ai'>
              <img src="/assets/Eorix.png" alt="Ai typing..." className='avatar'/>
              <div className='message-bubble typing'>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}

          <div className="messengerx-container" id="mcontext" style={{ width: '100%', height: '480px' }}></div>
          
        </div>
      </div>


      {/* Footer */}
      <div className="ai-footer">
        <div className="input-row">
          <input
            type="text"
            placeholder="Type a message..."
            className="message-input"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
          />
          <button className="icon-button" onClick={sendMessage}>
            <Send className="icon" />
          </button>
          <button className="icon-button" onClick={clickVoiceRecording}>
            <Mic className="icon" />
          </button>

          <button 
            className='icon-button' 
            onClick={() => {
              setMuted(prev => {
                const newMuted = !prev;
                if (newMuted) {
                  window.speechSynthesis.cancel();
                } else {
                  const lastMsg = messages.slice().reverse().find(msg => msg.sender === 'ai');
                  if (lastMsg?.text) speakText(lastMsg.text, false);
                }
                return newMuted;
              });
            }}
          >
            {isMuted ? <VolumeX className='icon'/> : <Volume2 className='icon'/>}
          </button>
        </div>
        <p className="hint-text">Press Enter to send • Shift+Enter for new line</p>
      </div>
    </div>
  );
}
