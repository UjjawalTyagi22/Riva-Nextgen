import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import Showcase from './components/Showcase';
import AudioSphere from './components/AudioSphere';
import './App.css';

// ===== ICON COMPONENTS =====
const RestartIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 4 23 10 17 10"/>
    <polyline points="1 20 1 14 7 14"/>
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
  </svg>
);

const TestMicIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
  </svg>
);

const MicIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
    <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
    <line x1="12" y1="19" x2="12" y2="23"/>
    <line x1="8" y1="23" x2="16" y2="23"/>
  </svg>
);

const SendIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"/>
    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
);

// ===== RIVA CHATBOT COMPONENT =====
function RivaChatbot({ shouldPlayWelcome }) {
  const [messages, setMessages] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [inputText, setInputText] = useState('');
  const [error, setError] = useState(null);
  const [interimText, setInterimText] = useState('');
  const [audioLevel, setAudioLevel] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [hasPlayedWelcome, setHasPlayedWelcome] = useState(false);
  
  const recognitionRef = useRef(null);
  const audioIntervalRef = useRef(null);
  const leftMessagesRef = useRef(null);
  const rightMessagesRef = useRef(null);
  const typingIntervalRef = useRef(null);
  const ttsInitializedRef = useRef(false);
  const isAISpeakingRef = useRef(false);
  const lastUserInputRef = useRef(Date.now());
  const speechPhaseRef = useRef(0);

  const scrollToBottom = (ref) => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  };

  useEffect(() => {
    const assistantMessages = messages.filter(m => m.role === 'assistant');
    const userMessages = messages.filter(m => m.role === 'user');
    
    if (assistantMessages.length > 0) {
      setTimeout(() => scrollToBottom(leftMessagesRef), 100);
    }
    
    if (userMessages.length > 0) {
      setTimeout(() => scrollToBottom(rightMessagesRef), 100);
    }
  }, [messages]);

  // ✨ PLAY WELCOME MESSAGE ON MOUNT - SPEAK ONLY (NO TEXT)
  useEffect(() => {
    if (shouldPlayWelcome && !hasPlayedWelcome) {
      setHasPlayedWelcome(true);
      
      // Initialize TTS first
      const utterance = new SpeechSynthesisUtterance('');
      window.speechSynthesis.speak(utterance);
      ttsInitializedRef.current = true;
      
      // Play welcome message after a short delay
      setTimeout(() => {
        const welcomeMessage = "Hello, I am Riva, an AI assistant for the NextGen Supercomputing Club at KIET Group of Institutions. Now, I am ready to answer all your questions";
        
        // Speak the welcome message WITHOUT showing text
        speak(welcomeMessage);
      }, 500);
    }
  }, [shouldPlayWelcome, hasPlayedWelcome]);

  // ✨ TYPEWRITER EFFECT FUNCTION
  const typewriterEffect = useCallback((fullText, callback) => {
    let currentIndex = 0;
    setIsTyping(true);

    setMessages(prev => [...prev, { role: 'assistant', content: '', isTyping: true }]);

    const typeNextChar = () => {
      if (currentIndex < fullText.length) {
        currentIndex++;

        setMessages(prev => {
          const newMessages = [...prev];
          const lastIndex = newMessages.length - 1;
          newMessages[lastIndex] = {
            ...newMessages[lastIndex],
            content: fullText.substring(0, currentIndex)
          };
          return newMessages;
        });

        scrollToBottom(leftMessagesRef);

        const delay = Math.random() * 19 + 30;
        typingIntervalRef.current = setTimeout(typeNextChar, delay);
      } else {
        setMessages(prev => {
          const newMessages = [...prev];
          const lastIndex = newMessages.length - 1;
          newMessages[lastIndex] = {
            ...newMessages[lastIndex],
            isTyping: false
          };
          return newMessages;
        });
        setIsTyping(false);
        if (callback) callback();
      }
    };

    typeNextChar();
  }, []);

  const handleSendMessage = useCallback(async (text) => {
    const messageText = text || inputText;
    if (!messageText.trim()) return;

    const userMessage = { role: 'user', content: messageText };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setInterimText('');

    try {
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: messageText })
      });

      const data = await response.json();

      if (data.success) {
        typewriterEffect(data.response);
        await speak(data.response);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('❌ Backend error:', error);
      const errorMessage = 'Sorry, I encountered an error connecting to the server.';
      typewriterEffect(errorMessage);
    }
  }, [inputText, typewriterEffect]);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        if (isAISpeakingRef.current) {
          console.log('🚫 Ignoring input - AI is speaking');
          return;
        }

        const timeSinceLastInput = Date.now() - lastUserInputRef.current;
        if (timeSinceLastInput < 2000) {
          console.log('🚫 Ignoring input - too soon after AI speech');
          return;
        }

        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        if (interimTranscript) {
          setInterimText(interimTranscript);
          setInputText(interimTranscript);
        }

        if (finalTranscript) {
          console.log('✅ Valid user input detected:', finalTranscript);
          lastUserInputRef.current = Date.now();
          setInputText(finalTranscript);
          setInterimText('');
          setIsListening(false);
          setError(null);
          
          setTimeout(() => {
            handleSendMessage(finalTranscript);
          }, 200);
        }
      };

      recognitionRef.current.onerror = (event) => {
        setIsListening(false);
        setInterimText('');
        
        if (event.error === 'no-speech') {
          setError('No speech detected. Please speak louder.');
        } else if (event.error !== 'aborted') {
          setError(`Speech error: ${event.error}`);
        }
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        setInterimText('');
      };

      recognitionRef.current.onstart = () => {
        setError(null);
        setInterimText('');
      };
    }
  }, [handleSendMessage]);

  // ✨ SPEAK FUNCTION - SHREYA JAIN VOICE (Google UK English Female)
  const speak = async (text) => {
    if (isSpeaking) stopSpeaking();

    isAISpeakingRef.current = true;
    console.log('🔴 AI SPEAKING MODE ACTIVATED');

    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
        setIsListening(false);
        console.log('🛑 FORCE STOPPED listening (AI speaking)');
      } catch (err) {
        console.log('⚠️ Could not stop recognition:', err);
      }
    }

    let cleanText = text;
    cleanText = cleanText.replace(/[\u{1F300}-\u{1F9FF}]/gu, '');
    cleanText = cleanText.replace(/[\u{1F600}-\u{1F64F}]/gu, '');
    cleanText = cleanText.replace(/[\u{1F680}-\u{1F6FF}]/gu, '');
    cleanText = cleanText.replace(/\*\*(.+?)\*\*/g, '$1');
    cleanText = cleanText.replace(/\*(.+?)\*/g, '$1');
    cleanText = cleanText.replace(/^#+\s+/gm, '');
    cleanText = cleanText.replace(/``````/g, '');
    cleanText = cleanText.replace(/`([^`]+)`/g, '$1');
    cleanText = cleanText.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
    cleanText = cleanText.replace(/^[\s]*[•\-\*]\s+/gm, '');
    cleanText = cleanText.replace(/^\d+\.\s+/gm, '');
    cleanText = cleanText.replace(/[_~|\\<>{}[\]]/g, '');
    cleanText = cleanText.replace(/\s+/g, ' ').trim();
    
    if (!cleanText) {
      console.log('⚠️ No text to speak');
      isAISpeakingRef.current = false;
      return;
    }

    console.log('Speaking:', cleanText.substring(0, 50) + '...');

    setIsSpeaking(true);

    try {
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 0.95;
      utterance.pitch = 1.2;
      utterance.volume = 1.0;
      utterance.lang = 'en-GB';

      const getVoices = () => {
        return new Promise((resolve) => {
          let voices = window.speechSynthesis.getVoices();
          if (voices.length) {
            resolve(voices);
          } else {
            window.speechSynthesis.onvoiceschanged = () => {
              voices = window.speechSynthesis.getVoices();
              resolve(voices);
            };
          }
        });
      };

      const voices = await getVoices();
      console.log('🔊 Total available voices:', voices.length);
      
      // 🎯 SHREYA JAIN VOICE - Google UK English Female
      let selectedVoice = null;
      
      // Priority 1: Google UK English Female (Shreya Jain's voice)
      selectedVoice = voices.find(v => 
        v.lang.includes('en-GB') && 
        (v.name.toLowerCase().includes('female') || 
         v.name.toLowerCase().includes('google uk english female') ||
         v.name.toLowerCase().includes('kate') ||
         v.name.toLowerCase().includes('serena'))
      );
      
      // Priority 2: Any UK English Female voice
      if (!selectedVoice) {
        selectedVoice = voices.find(v => 
          v.lang.includes('en-GB') && 
          !v.name.toLowerCase().includes('male')
        );
      }
      
      // Priority 3: Google Female voices
      if (!selectedVoice) {
        selectedVoice = voices.find(v => 
          v.name.toLowerCase().includes('google') && 
          v.name.toLowerCase().includes('female')
        );
      }
      
      // Priority 4: Any female voice
      if (!selectedVoice) {
        selectedVoice = voices.find(v => 
          v.lang.includes('en') && 
          (v.name.toLowerCase().includes('female') || 
           v.name.toLowerCase().includes('woman'))
        );
      }
      
      if (selectedVoice) {
        utterance.voice = selectedVoice;
        console.log('✅ Selected SHREYA JAIN voice:', selectedVoice.name, '|', selectedVoice.lang);
      }

      const simulateAudioLevel = () => {
        speechPhaseRef.current += 0.2;
        
        const baseLevel = 0.5 + Math.random() * 0.4;
        const wave1 = Math.sin(speechPhaseRef.current) * 0.3;
        const wave2 = Math.sin(speechPhaseRef.current * 2.5) * 0.2;
        const wave3 = Math.cos(speechPhaseRef.current * 1.3) * 0.15;
        
        const randomSpike = Math.random() > 0.6 ? Math.random() * 0.4 : 0;
        
        const targetLevel = Math.max(0.4, Math.min(1.0, baseLevel + wave1 + wave2 + wave3 + randomSpike));
        
        setAudioLevel(prev => prev + (targetLevel - prev) * 0.3);
      };

      audioIntervalRef.current = setInterval(simulateAudioLevel, 40);

      return new Promise((resolve) => {
        utterance.onend = () => {
          if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
          
          let currentLevel = audioLevel;
          const fadeOut = setInterval(() => {
            currentLevel *= 0.7;
            setAudioLevel(currentLevel);
            if (currentLevel < 0.05) {
              clearInterval(fadeOut);
              setAudioLevel(0);
            }
          }, 50);
          
          setIsSpeaking(false);
          isAISpeakingRef.current = false;
          console.log('🟢 AI SPEAKING MODE DEACTIVATED');
          
          resolve();
        };

        utterance.onerror = (e) => {
          console.error('❌ TTS Error:', e);
          if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
          setIsSpeaking(false);
          setAudioLevel(0);
          isAISpeakingRef.current = false;
          resolve();
        };

        utterance.onstart = () => {
          console.log('✅ Speech started');
          setAudioLevel(0.6);
          speechPhaseRef.current = 0;
        };

        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
      });

    } catch (error) {
      console.error('Speech error:', error);
      if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
      setIsSpeaking(false);
      setAudioLevel(0);
      isAISpeakingRef.current = false;
    }
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
    setIsSpeaking(false);
    setAudioLevel(0);
  };

  const toggleMicRecording = useCallback(() => {
    if (!ttsInitializedRef.current) {
      const utterance = new SpeechSynthesisUtterance('');
      window.speechSynthesis.speak(utterance);
      ttsInitializedRef.current = true;
      console.log('✅ TTS initialized');
    }

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        setIsListening(false);
        console.log('🎙️ Stopped listening');
      }
    } else {
      if (recognitionRef.current && !isSpeaking && !isTyping) {
        try {
          setIsListening(true);
          setError(null);
          recognitionRef.current.start();
          console.log('🎙️ Started listening');
        } catch (err) {
          console.error('Error starting recognition:', err);
          setIsListening(false);
        }
      }
    }
  }, [isListening, isSpeaking, isTyping]);

  const clearConversation = async () => {
    if (!ttsInitializedRef.current) {
      const utterance = new SpeechSynthesisUtterance('');
      window.speechSynthesis.speak(utterance);
      ttsInitializedRef.current = true;
    }
    
    setMessages([]);
    setError(null);
    stopSpeaking();
    
    if (typingIntervalRef.current) {
      clearTimeout(typingIntervalRef.current);
    }
    setIsTyping(false);
    
    try {
      await fetch('http://localhost:5000/api/clear', { method: 'POST' });
    } catch (error) {
      console.error('Error clearing:', error);
    }
  };

  const testMicrophone = async () => {
    if (!ttsInitializedRef.current) {
      const utterance = new SpeechSynthesisUtterance('');
      window.speechSynthesis.speak(utterance);
      ttsInitializedRef.current = true;
    }
    
    try {
      setError(null);
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true } 
      });
      
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      let maxLevel = 0;
      let checkCount = 0;
      
      const checkLevel = () => {
        analyser.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
        maxLevel = Math.max(maxLevel, average);
        checkCount++;
        
        setAudioLevel(average / 128);
        
        if (checkCount >= 30) {
          stream.getTracks().forEach(track => track.stop());
          audioContext.close();
          setAudioLevel(0);
          
          if (maxLevel > 10) {
            alert(`✅ Microphone working! Level: ${Math.round(maxLevel)}`);
          } else {
            alert(`⚠️ Low microphone level: ${Math.round(maxLevel)}`);
          }
        } else {
          setTimeout(checkLevel, 100);
        }
      };
      
      alert('Testing microphone...\n\nSpeak now for 3 seconds!');
      checkLevel();
      
    } catch (err) {
      alert('Microphone test failed!');
      setError('Microphone test failed');
    }
  };

  const userMessages = useMemo(() => messages.filter(m => m.role === 'user'), [messages]);
  const assistantMessages = useMemo(() => messages.filter(m => m.role === 'assistant'), [messages]);

  const audioSphereComponent = useMemo(() => (
    <AudioSphere audioLevel={audioLevel} isSpeaking={isSpeaking} />
  ), [audioLevel, isSpeaking]);

  return (
    <div className="app-container">
      <div className="audiosphere-background">
        {audioSphereComponent}
      </div>

      {error && <div className="error-banner">⚠️ {error}</div>}
      {interimText && <div className="interim-banner">Listening: "{interimText}"</div>}
      {isListening && <div className="continuous-banner"> Recording</div>}

      <div className="left-panel">
        <div className="panel-header">
          <h3>RIVA</h3>
        </div>
        <div className="messages-container" ref={leftMessagesRef}>
          {assistantMessages.length === 0 && (
            <div className="empty-state">
              {/* Empty state placeholder */}
            </div>
          )}
          {assistantMessages.map((msg, idx) => (
            <div key={idx} className="message-bubble ai-message">
              <ReactMarkdown>{msg.content}</ReactMarkdown>
              {msg.isTyping && <span className="typing-cursor">▌</span>}
            </div>
          ))}
        </div>
      </div>

      <div className="right-panel">
        <div className="panel-header">
          <h3>YOU</h3>
        </div>
        <div className="messages-container" ref={rightMessagesRef}>
          {userMessages.map((msg, idx) => (
            <div key={idx} className="message-bubble user-message">
              {msg.content}
            </div>
          ))}
        </div>
      </div>

      <div className="center-controls">
        <button 
          className={`control-btn mic-btn ${isListening ? 'active recording' : ''}`}
          onClick={toggleMicRecording}
          disabled={isSpeaking || isTyping}
          title={isListening ? "Stop Recording" : "Start Recording"}
        >
          <MicIcon />
        </button>
        
        <button 
          className="control-btn restart-btn"
          onClick={clearConversation}
          title="Restart"
        >
          <RestartIcon />
        </button>
        
        <button 
          className="control-btn test-btn"
          onClick={testMicrophone}
          title="Test Microphone"
        >
          <TestMicIcon />
        </button>
      </div>

      <div className="horizontal-input-container">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
          placeholder={isListening ? "Listening..." : "Type your message..."}
          disabled={isSpeaking || isTyping}
          rows={1}
        />
        <button 
          onClick={() => handleSendMessage()}
          disabled={!inputText.trim() || isListening || isSpeaking || isTyping}
          className="send-btn-horizontal"
        >
          <SendIcon />
        </button>
      </div>
    </div>
  );
}

// ===== MAIN APP COMPONENT =====
function App() {
  const [currentView, setCurrentView] = useState('inauguration'); // 'inauguration' or 'riva'

  const teachers = [
    {
      name: 'Shreya Jain',
      topic: 'Clubs & Activities',
      photo: '/butki.jpg',
      color: '#ffffff',
      script: `A very good afternoon to one and all present here!

Respected Executive Director, Director Academics, Director CRPC, Dean CSE (A I & AIML), esteemed faculty members, and my fellow innovators —

I am Shreya Jain, President of the NextGen Supercomputing Club, and it gives me immense pleasure to welcome you all to this moment of pride and innovation. 🌟

💡 The NextGen Supercomputing Club stands as a symbol of progress — a space where technology, creativity, and research come together.
Our vision is to empower students to become industry-ready AI engineers capable of developing real-world, production-level solutions. 🚀

🔭 Guided by our motto, 'Building Production Brains,' this club marks a new beginning in hands-on AI learning and innovation.

At the heart of our initiative lies one of the most powerful computing systems on campus — the NVIDIA DGX A100 hundred Supercomputer, a platform designed to accelerate breakthroughs in Artificial Intelligence, Machine Learning, and High-Performance Computing. ⚙️💻

👥 Behind this vision is a dedicated team of passionate members —
Samarth Shukla (Vice President),
Ujjawal Tyagi (PR Head),
Preeti Singh (Graphics Head),
Srashti Gupta and Vidisha Goel (Event Management Leads),
Ronak Goel and Vinayak Rastogi (Technical Leads), and
Divyansh Verma (Treasurer). 🎯

Together, we work under the valuable guidance of our Dean, Dr. Rekha Kashyap, and with the mentorship of Dr. Richa Singh, Dr. Gaurav Srivastav, and Prof. Rajeev Singh, supported by our respected seniors Aayushker Singh and Swatantra Agarwal. 🙌🎓

💫 To share more about the powerhouse that drives this journey of innovation, I would now like to invite Dr. Richa Singh ma'am to enlighten us further.`
    },
    {
      name: 'Dr. Richa Singh',
      topic: 'College Projects',
      photo: '/richa madam.jpg',
      color: '#ffffff',
      script: `
The NVIDIA DGX A hundred Supercomputer is not just a technological advancement — it’s a foundation for innovation and learning. 🖥️

It provides our students and faculty with access to one of the most powerful AI infrastructures in academia.

Equipped with eight NVIDIA A hundred GPUs — each powered by thousands of CUDA and Tensor cores — and interconnected through high-speed six NVSwitch links, the system delivers exceptional computational power and memory bandwidth. ⚡

With massive GPU memory support, the DGX A hundred enables:

-Large-scale deep learning 

-Complex data processing 

-High-speed simulations 

Through this facility, we are not only enhancing computational capability but also nurturing research, innovation, and collaboration.

Our students are exploring advanced domains such as:

Generative AI 

Computer Vision 

Data Analytics 

This experience is helping them develop both the skills and the mindset needed for the future.

To share how our students are leveraging this system through live projects and collaborations, I now invite Dr. Gaurav Srivastav sir. 🎤`
    },
    {
      name: 'Dr. Gaurav Srivastav',
      topic: 'Department Objectives',
      photo: '/gaurav sir.jpg',
      color: '#ffffff',
      script: `The NextGen Supercomputing Club exemplifies how learning transforms into meaningful innovation when applied to real-world challenges.
Our students are actively contributing through impactful projects under Smart India Hackathon 2025. 🚀

🔹 NeptuneNexus
Improving livestock management by monitoring residue levels and antimicrobial usage, ensuring safer and healthier farm outputs.

🔹 TechYodhaas
Preserving Sikkim’s cultural heritage by creating a digital platform for virtual monastery tours and cultural archiving.

🔹 Omnitrix
Promoting inclusivity in sports with an AI-powered talent assessment system that opens new opportunities for aspiring athletes.

Each of these projects reflects our students’ creativity, teamwork, and commitment to leveraging technology for social good — staying aligned with our vision of Building Production Brains. 💡

To share how these initiatives are evolving into broader research collaborations and industry partnerships, I now invite Prof. Rajeev Singh. 🙏`
    },
    {
      name: ' Prof. Rajeev Singh',
      topic: 'ETD & Training',
      photo: '/rajeev sir.jpg',
      color: '#ffffff',
      script: `The NextGen Supercomputing Club exemplifies how academic learning and industry collaboration unite to create real impact.
Through partnerships with Opinium.AI, Epsilon Pvt. Ltd., MetaUp Space, and AI Shala Technologies, our students are developing cutting-edge AI solutions across diverse domains. 🤝🚀

With Opinium.AI, they’re building a Resume Recommender System that aligns candidate skills with job roles. 🤖

In collaboration with Epsilon Pvt. Ltd., they’ve created a Real-Time Image-to-Avatar Swapping System using deep learning and computer vision. 🧠

With MetaUp Space, they’re working on High-Performance Computing Frameworks to accelerate large-scale AI model execution. 💻

And alongside AI Shala Technologies, they’re enhancing the RoboCasa Simulation Framework for intelligent robotic learning. 🤖

Each collaboration enhances technical expertise, promotes innovation, and connects students directly with real-world AI challenges.
With the dedication of our students and the guidance of our mentors, I’m confident that the NextGen Supercomputing Club will continue setting new benchmarks in applied AI and research excellence. 📈`
    }
  ];

  const handleMoveToRiva = () => {
    console.log('✓ Moving to Riva Chatbot...');
    setCurrentView('riva');
  };

  return (
    <>
      {currentView === 'inauguration' ? (
        <Showcase teachers={teachers} onMoveToRiva={handleMoveToRiva} />
      ) : (
        <RivaChatbot shouldPlayWelcome={true} />
      )}
    </>
  );
}

export default App;