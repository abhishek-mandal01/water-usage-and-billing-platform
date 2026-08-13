import { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslation } from './LanguageSelector/useTranslation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  GripHorizontal, 
  RotateCcw 
} from 'lucide-react';
import SmartBotAvatar from './SmartBotAvatar';
import './SmartBotChat.css';

// Language mapping for Web Speech API
const getLanguageCode = (lng) => {
  const map = {
    en: 'en-US',
    hi: 'hi-IN',
    bn: 'bn-IN',
    ta: 'ta-IN',
    te: 'te-IN',
    mr: 'mr-IN'
  };
  return map[lng] || 'en-US';
};

// Context-aware question suggestion engine
const getSuggestedQuestions = (lastBotReply = '', lastUserMessage = '') => {
  const combined = (lastBotReply + ' ' + lastUserMessage).toLowerCase();

  if (
    combined.includes('bill') || 
    combined.includes('pay') || 
    combined.includes('invoice') || 
    combined.includes('charge') || 
    combined.includes('cost') || 
    combined.includes('rupee') || 
    combined.includes('₹')
  ) {
    return [
      "How to download my invoice PDF? 📄",
      "What are the payment deadlines? ⏰",
      "How is tiered slab pricing calculated? 📈",
      "How to view past payment receipts? 🧾"
    ];
  }

  if (
    combined.includes('usage') || 
    combined.includes('meter') || 
    combined.includes('liter') || 
    combined.includes('reading') || 
    combined.includes('consumption')
  ) {
    return [
      "How does the smart meter record data? ⏱️",
      "What triggers a high usage alert? 🚨",
      "Top 5 water conservation tips 💡",
      "How does peer benchmarking work? 👥"
    ];
  }

  if (
    combined.includes('leak') || 
    combined.includes('support') || 
    combined.includes('issue') || 
    combined.includes('help') || 
    combined.includes('problem') || 
    combined.includes('admin')
  ) {
    return [
      "How fast is leak repair handled? 🛠️",
      "Emergency water maintenance contact 📞",
      "How to track open support tickets? 📋",
      "What to do if water pressure is low? 🚰"
    ];
  }

  if (
    combined.includes('tariff') || 
    combined.includes('rate') || 
    combined.includes('slab') || 
    combined.includes('rule')
  ) {
    return [
      "What are residential tariff slabs? 🏷️",
      "Are there commercial tariff rates? 🏢",
      "What are late payment penalty charges? ⚠️",
      "How to request a tariff review? 📝"
    ];
  }

  // Default initial smart suggestions
  return [
    "How is my water bill calculated? 💧",
    "How to check my daily water usage? 📊",
    "How to pay my bill online? 💳",
    "How do I report a water leak? ⚠️"
  ];
};

const SmartBotChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi! I am SmartBot, the official AI assistant for Smart Water. You can ask me anything using voice or text! How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [suggestions, setSuggestions] = useState([
    "How is my water bill calculated? 💧",
    "How to check my daily water usage? 📊",
    "How to pay my bill online? 💳",
    "How do I report a water leak? ⚠️"
  ]);

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const { t, i18n } = useTranslation();

  // Scroll to bottom helper
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, suggestions]);

  // Clean text and speak using Web Speech Synthesis (TTS)
  const speakText = useCallback((text) => {
    if (!voiceEnabled || !('speechSynthesis' in window)) return;

    try {
      window.speechSynthesis.cancel();

      // Clean emojis and markdown formatting for clean speech
      const cleanText = text
        .replace(/[#*_`~>-]/g, '')
        .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
        .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
        .trim();

      if (!cleanText) return;

      const utterance = new SpeechSynthesisUtterance(cleanText);
      const langCode = getLanguageCode(i18n.language);
      utterance.lang = langCode;

      const voices = window.speechSynthesis.getVoices();
      const matchedVoice = voices.find(v => v.lang === langCode || v.lang.startsWith(langCode.split('-')[0]));
      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }

      utterance.rate = 1.0;
      utterance.pitch = 1.08; // Cheerful friendly assistant tone

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('Speech synthesis error:', err);
      setIsSpeaking(false);
    }
  }, [voiceEnabled, i18n.language]);

  // Stop any active speech on close
  const stopSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopSpeech();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (_) {}
      }
    };
  }, []);

  // Voice Input: Web Speech Recognition (STT)
  const toggleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Voice recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (_) {}
      }
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.lang = getLanguageCode(i18n.language);
      recognition.interimResults = true;
      recognition.continuous = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setInput(currentTranscript);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.error('Failed to start speech recognition:', err);
      setIsListening(false);
    }
  };

  // Send message handler
  const handleSend = async (customMessage = null) => {
    const textToSend = typeof customMessage === 'string' ? customMessage.trim() : input.trim();
    if (!textToSend) return;

    if (isListening && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (_) {}
      setIsListening(false);
    }

    // Stop current speech before sending new query
    stopSpeech();

    setMessages(prev => [...prev, { sender: 'user', text: textToSend }]);
    setInput('');
    setIsTyping(true);

    try {
      const userStr = localStorage.getItem('user');
      let userId = null;
      if (userStr) {
        userId = JSON.parse(userStr).id;
      }

      const response = await fetch('http://localhost:8081/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: textToSend, userId, language: i18n.language }),
      });

      if (!response.ok) {
        throw new Error('API Error');
      }

      const data = await response.json();
      const botReply = data.reply || 'I am here to help with your water billing and usage queries!';
      
      setMessages(prev => [...prev, { sender: 'bot', text: botReply }]);
      
      // Update dynamic contextual suggestions
      setSuggestions(getSuggestedQuestions(botReply, textToSend));

      // Speak response if voice is enabled
      speakText(botReply);
    } catch (error) {
      console.error(error);
      const fallbackReply = 'Sorry, I am having trouble connecting to the server right now. Please try again.';
      setMessages(prev => [...prev, { sender: 'bot', text: fallbackReply }]);
      speakText(fallbackReply);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="smartbot-container">
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              className="smartbot-backdrop" 
              onClick={() => {
                stopSpeech();
                setIsOpen(false);
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <motion.div 
              className="smartbot-window"
              drag
              dragMomentum={false}
              dragElastic={0.08}
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            >
              {/* Draggable Header */}
              <div className="smartbot-header">
                <div className="smartbot-header-left">
                  <SmartBotAvatar 
                    size="mini" 
                    isInteractive={false} 
                    isTyping={isTyping} 
                    isSpeaking={isSpeaking}
                  />
                  <div>
                    <h4>{t('chat.headerTitle', 'SmartBot AI')}</h4>
                    <span className="smartbot-status-text">
                      {isSpeaking ? '🔊 Speaking...' : isTyping ? '✍️ Typing...' : isListening ? '🎙️ Listening...' : '🟢 Online'}
                    </span>
                  </div>
                </div>

                {/* Drag Grip Indicator */}
                <div className="smartbot-drag-handle" title="Click & Drag across screen">
                  <GripHorizontal size={18} />
                </div>

                {/* Header Actions */}
                <div className="smartbot-header-actions" onPointerDown={(e) => e.stopPropagation()}>
                  {/* Voice Toggle Button */}
                  <button 
                    className={`smartbot-header-btn ${voiceEnabled ? 'active' : ''}`}
                    onClick={() => {
                      if (voiceEnabled) stopSpeech();
                      setVoiceEnabled(!voiceEnabled);
                    }} 
                    title={voiceEnabled ? 'Mute Voice Responses' : 'Enable Voice Responses'}
                    aria-label="Toggle Voice"
                  >
                    {voiceEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                  </button>

                  {/* Close Button */}
                  <button 
                    className="smartbot-header-btn close" 
                    onClick={() => {
                      stopSpeech();
                      setIsOpen(false);
                    }} 
                    title="Close Chat"
                    aria-label="Close Chat"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
              
              {/* Messages Thread */}
              <div className="smartbot-messages">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`smartbot-msg-wrapper ${msg.sender}`}>
                    <div className={`smartbot-msg smartbot-msg-${msg.sender}`}>
                      <div className="smartbot-msg-content">{msg.text}</div>
                      
                      {/* Bot Replay Voice Button */}
                      {msg.sender === 'bot' && (
                        <button 
                          className="smartbot-msg-speak-btn"
                          onClick={() => speakText(msg.text)}
                          title="Read message aloud"
                          aria-label="Read message aloud"
                        >
                          <Volume2 size={13} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="smartbot-msg-wrapper bot">
                    <div className="smartbot-msg smartbot-typing">
                      <span className="dot"></span>
                      <span className="dot"></span>
                      <span className="dot"></span>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Dynamic Contextual Suggested Questions */}
              {suggestions.length > 0 && !isTyping && (
                <div className="smartbot-suggestions-wrapper">
                  <div className="smartbot-suggestions-header">
                    <Sparkles size={13} className="sparkle-icon" />
                    <span>Suggested Questions</span>
                  </div>
                  <div className="smartbot-suggestions-list">
                    {suggestions.map((question, qIdx) => (
                      <button
                        key={qIdx}
                        className="smartbot-suggestion-chip"
                        onClick={() => handleSend(question)}
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Voice Listening Active Banner */}
              {isListening && (
                <div className="smartbot-listening-banner">
                  <div className="smartbot-wave-bars">
                    <span></span><span></span><span></span><span></span><span></span>
                  </div>
                  <span>Listening... Speak now</span>
                </div>
              )}

              {/* Input Area */}
              <div className="smartbot-input-area">
                <input 
                  type="text" 
                  className="smartbot-input"
                  placeholder={isListening ? "Listening to your voice..." : t('chat.inputPlaceholder', 'Ask SmartBot about bills, usage...')} 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                />

                {/* Voice Input (Mic) Button */}
                <button 
                  className={`smartbot-mic-btn ${isListening ? 'listening' : ''}`}
                  onClick={toggleVoiceInput}
                  title={isListening ? 'Stop Voice Input' : 'Speak to SmartBot'}
                  aria-label="Voice Input"
                >
                  {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                </button>

                {/* Send Button */}
                <button 
                  className="smartbot-send-btn" 
                  onClick={() => handleSend()} 
                  disabled={isTyping || !input.trim()} 
                  aria-label="Send Message"
                >
                  <Send size={18} />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {!isOpen && (
        <div className="smartbot-mascot-fab-container">
          <SmartBotAvatar 
            size="large"
            isInteractive={true}
            showTooltip={true}
            tooltipText={t('chat.tooltip', 'Hi! I am SmartBot. Need help? 💧')}
            onClick={() => setIsOpen(true)}
          />
        </div>
      )}
    </div>
  );
};

export default SmartBotChat;
