import React, { useState, useEffect, useRef } from 'react';
import { useMediSense } from '../../context/MediSenseContext';
import { getMediResponse } from '../../data/chatbotKnowledge';
import {
  X,
  Send,
  Mic,
  MicOff,
  Bot,
  Sparkles,
  ArrowRight,
  RotateCcw,
  LogIn,
  UserPlus,
  Stethoscope
} from 'lucide-react';

export default function MediChatbot({
  isGuest = false,
  onSelectAuthMode,
  onFillPatientDemo,
  onFillDoctorDemo
}) {
  const { currentPatient, setPatientTab, currentUser } = useMediSense();
  const actualIsGuest = isGuest || !currentUser;
  const patientFirstName = currentPatient?.name ? currentPatient.name.split(' ')[0] : 'there';

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'medi',
      text: actualIsGuest
        ? `Hello and welcome to **MediSense AI**! 👋 I am **Medi**, your clinical AI companion.\n\nI can guide you step-by-step on how our platform works, what features patients and doctors have, and help you get started.\n\nAsk me anything! *(Note: To test the Symptom Checker and evaluate acute symptoms, please sign in or register an account first.)*`
        : `Hello ${patientFirstName}! 👋 I am **Medi**, your personal AI Health Companion at MediSense AI.\n\nI can guide you step-by-step through the app, analyze your symptoms, help you book doctor appointments with OPD receipts, or monitor your biometric vitals. How can I help you today?`,
      timestamp: 'Just now',
      actionTab: null,
      actionLabel: null,
      isEmergency: false,
      quickReplies: actualIsGuest
        ? [
            { label: '💡 How to Use This App', text: 'How to use this app?' },
            { label: '🩺 How Symptom Checker Works', text: 'How does the symptom checker work?' },
            { label: '🏥 Doctor & Hospital Features', text: 'What can doctors do?' },
            { label: '⚡ How to Sign In or Test?', text: 'How do I sign in or test?' }
          ]
        : [
            { label: '💡 How to Use This App', text: 'How to use this app?' },
            { label: '🩺 Check My Symptoms', tab: 'symptoms' },
            { label: '📅 Book Doctor & Get Receipt', tab: 'appointments' },
            { label: '📊 Health Vitals & BP', tab: 'vitals' }
          ]
    }
  ]);

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isTyping, isOpen]);

  // Speech-to-Text Setup
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputText(prev => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };

      recognition.onerror = (event) => {
        console.warn('Speech error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech-to-Text is supported in Google Chrome, Microsoft Edge, and modern browsers.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.error('Mic start error:', err);
      }
    }
  };

  // Suggested Prompts
  const quickPrompts = actualIsGuest
    ? [
        'How to use this app?',
        'I have chest pain',
        'What can doctors do?',
        'How to book an appointment?',
        'How do I test with demo account?'
      ]
    : [
        'How to use this app?',
        'I have pain',
        'I have sudden chest pain',
        'How to book doctor & get receipt?',
        'Where is my Digital Health Card?'
      ];

  const handleSendMessage = (customText) => {
    const textToSend = customText || inputText;
    if (!textToSend.trim()) return;

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Natural responsive bot delay
    setTimeout(() => {
      const response = getMediResponse(
        textToSend,
        actualIsGuest ? 'Visitor' : (currentPatient?.name || 'Patient'),
        actualIsGuest
      );

      const botMessage = {
        id: Date.now() + 1,
        sender: 'medi',
        text: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionTab: response.actionTab,
        actionLabel: response.actionLabel,
        isEmergency: response.isEmergency,
        quickReplies: response.quickReplies || []
      };

      setIsTyping(false);
      setMessages(prev => [...prev, botMessage]);
    }, 400);
  };

  const handleQuickReplyClick = (reply) => {
    if (reply.authAction) {
      if (reply.authAction === 'patient_signin' && onSelectAuthMode) {
        onSelectAuthMode('patient_signin');
      } else if (reply.authAction === 'patient_signup' && onSelectAuthMode) {
        onSelectAuthMode('patient_signup');
      } else if (reply.authAction === 'doctor' && onSelectAuthMode) {
        onSelectAuthMode('doctor');
      } else if (reply.authAction === 'demo_patient' && onFillPatientDemo) {
        onFillPatientDemo('sarah.jenkins@medisense.ai', 'patient123');
      } else if (reply.authAction === 'demo_doctor' && onFillDoctorDemo) {
        onFillDoctorDemo('dr.chen@medisense.hospital.org', 'doctor123', 'doctor');
      }
      // On small screens, close modal so user can see form
      if (window.innerWidth < 640) {
        setIsOpen(false);
      }
    } else if (reply.tab) {
      setPatientTab(reply.tab);
      if (window.innerWidth < 640) {
        setIsOpen(false);
      }
    } else if (reply.text) {
      handleSendMessage(reply.text);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: Date.now(),
        sender: 'medi',
        text: actualIsGuest
          ? `Chat reset! Welcome to MediSense AI. How can I assist or guide you before you sign in?`
          : `Chat reset! Hello ${patientFirstName}, how can I assist your health journey right now?`,
        timestamp: 'Just now',
        actionTab: null,
        actionLabel: null,
        isEmergency: false,
        quickReplies: actualIsGuest
          ? [
              { label: '💡 How to Use This App', text: 'How to use this app?' },
              { label: '🩺 How Symptom Checker Works', text: 'How does the symptom checker work?' },
              { label: '🏥 Doctor & Hospital Features', text: 'What can doctors do?' },
              { label: '⚡ How to Sign In or Test?', text: 'How do I sign in or test?' }
            ]
          : [
              { label: '💡 How to Use This App', text: 'How to use this app?' },
              { label: '🩺 Check My Symptoms', tab: 'symptoms' },
              { label: '📅 Book Doctor & Get Receipt', tab: 'appointments' },
              { label: '📊 Health Vitals', tab: 'vitals' }
            ]
      }
    ]);
  };

  return (
    <>
      {/* Floating Chatbot Launcher Button */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
          <div
            onClick={() => setIsOpen(true)}
            className="hidden sm:flex items-center gap-2 bg-white text-slate-800 text-xs font-bold py-2.5 px-4 rounded-2xl shadow-xl border border-slate-200 cursor-pointer hover:shadow-2xl transition-all hover:bg-slate-50 animate-pulse"
          >
            <Sparkles className="w-4 h-4 text-teal-600" />
            <span>
              {actualIsGuest ? (
                <>New here? Ask <strong className="text-teal-600 font-extrabold">Medi</strong> for a Tour!</>
              ) : (
                <>Ask <strong className="text-teal-600 font-extrabold">Medi</strong> (Voice AI Assistant)</>
              )}
            </span>
          </div>
          <button
            onClick={() => setIsOpen(true)}
            className="w-14 h-14 rounded-full bg-gradient-to-r from-teal-600 to-sky-600 text-white flex items-center justify-center shadow-2xl hover:scale-105 transition-all relative group"
            title="Chat with Medi"
          >
            <Bot className="w-7 h-7 text-white" />
            <span className="absolute top-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></span>
          </button>
        </div>
      )}

      {/* Interactive Chatbot Modal / Drawer */}
      {isOpen && (
        <div className="fixed bottom-6 right-4 sm:right-6 z-50 w-[94vw] sm:w-[450px] h-[620px] bg-white border border-slate-300 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-900 animate-in fade-in slide-in-from-bottom-5 duration-300">
          
          {/* Header */}
          <div className="p-4 sm:p-5 bg-gradient-to-r from-teal-600 to-sky-600 text-white flex items-center justify-between shadow-sm shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-white shadow-sm">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-base font-black tracking-tight">Medi</h3>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-white/25 text-white uppercase tracking-wider">
                    {actualIsGuest ? 'Platform Tour Guide' : 'Clinical AI Companion'}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-teal-100">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Online • Voice & Text Guided</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleResetChat}
                className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                title="Restart Chat"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50 text-xs">
            {messages.map((msg) => {
              const isMedi = msg.sender === 'medi';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${isMedi ? 'items-start' : 'items-end justify-end'}`}
                >
                  {isMedi && (
                    <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 text-xs font-black mt-0.5 shadow-sm">
                      M
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] p-4 rounded-2xl text-xs leading-relaxed shadow-sm ${
                      isMedi
                        ? msg.isEmergency
                          ? 'bg-rose-50 text-rose-900 border-2 border-rose-300'
                          : 'bg-white text-slate-800 border border-slate-200'
                        : 'bg-teal-600 text-white rounded-br-xs'
                    }`}
                  >
                    <div className="whitespace-pre-line font-medium space-y-1">
                      {msg.text}
                    </div>

                    {/* Interactive Multi-Chip Action Buttons */}
                    {isMedi && msg.quickReplies && msg.quickReplies.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap gap-1.5">
                        {msg.quickReplies.map((reply, rIdx) => (
                          <button
                            key={rIdx}
                            onClick={() => handleQuickReplyClick(reply)}
                            className="px-2.5 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-600 text-teal-800 hover:text-white border border-teal-200 hover:border-teal-600 text-[11px] font-bold transition-all shadow-2xs flex items-center gap-1 text-left"
                          >
                            <span>{reply.label}</span>
                          </button>
                        ))}
                      </div>
                    )}

                    <div
                      className={`text-[9px] mt-1.5 text-right font-medium ${
                        isMedi ? 'text-slate-400' : 'text-teal-100'
                      }`}
                    >
                      {msg.timestamp}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-2 text-slate-400 text-xs pl-2">
                <div className="w-7 h-7 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-xs">
                  M
                </div>
                <div className="bg-white px-3.5 py-2 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-600 animate-ping"></span>
                  <span className="text-[11px] font-semibold text-slate-500">Medi is thinking...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Clickable Suggestions Strip */}
          <div className="px-3.5 py-2 bg-white border-t border-slate-100 overflow-x-auto flex gap-1.5 scrollbar-none shrink-0">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(prompt)}
                className="whitespace-nowrap px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-600 text-[11px] font-bold border border-slate-200 transition-all shrink-0"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input & Voice Controls */}
          <div className="p-3.5 bg-white border-t border-slate-200 shrink-0">
            {isListening && (
              <div className="mb-2 p-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2 animate-pulse">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
                <span>🎙️ Listening to your voice... Speak now!</span>
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              {/* Voice Button */}
              <button
                type="button"
                onClick={toggleListening}
                className={`p-2.5 rounded-2xl border transition-all ${
                  isListening
                    ? 'bg-rose-500 text-white border-rose-500 shadow-md animate-bounce'
                    : 'bg-slate-100 text-slate-600 hover:text-teal-700 hover:bg-teal-50 border-slate-200'
                }`}
                title={isListening ? 'Stop Listening' : 'Speak to Medi (Voice Input)'}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              {/* Text Input */}
              <input
                type="text"
                placeholder={
                  isListening
                    ? 'Listening...'
                    : actualIsGuest
                    ? 'Ask Medi anything (e.g. "How to use app?")...'
                    : 'Type or ask Medi anything (e.g. "pain", "fever")...'
                }
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 bg-slate-50 text-xs sm:text-sm text-slate-900 p-2.5 rounded-2xl border border-slate-200 focus:outline-none focus:border-teal-500 focus:bg-white"
              />

              {/* Send Button */}
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="p-2.5 rounded-2xl bg-teal-600 hover:bg-teal-500 disabled:opacity-40 text-white shadow transition-all"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 px-1">
              <span>Speaks English & Hinglish • Voice enabled</span>
              <span>AI assists. Doctors decide.</span>
            </div>
          </div>

        </div>
      )}
    </>
  );
}
