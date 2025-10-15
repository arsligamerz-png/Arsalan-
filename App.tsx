
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Header } from './components/Header';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { StartupScreen } from './components/StartupScreen';
import { ModeToggle } from './components/ModeToggle';
import { useSpeech } from './hooks/useSpeech';
import { Message, ChatMode, Role } from './types';
import { getChatResponse } from './services/geminiService';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isBooting, setIsBooting] = useState(true);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [mode, setMode] = useState<ChatMode>(ChatMode.Fun);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { isListening, transcript, startListening, stopListening, speak } = useSpeech();

  useEffect(() => {
    const bootTimer = setTimeout(() => setIsBooting(false), 2500);
    return () => clearTimeout(bootTimer);
  }, []);

  useEffect(() => {
    try {
      const storedMessages = localStorage.getItem('arsalan-ai-messages');
      const storedMode = localStorage.getItem('arsalan-ai-mode') as ChatMode;
      if (storedMessages) {
        setMessages(JSON.parse(storedMessages));
      }
      if (storedMode) {
        setMode(storedMode);
      }
    } catch (error) {
      console.error("Failed to load from local storage:", error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('arsalan-ai-messages', JSON.stringify(messages));
      localStorage.setItem('arsalan-ai-mode', mode);
    } catch (error) {
      console.error("Failed to save to local storage:", error);
    }
  }, [messages, mode]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isAiTyping]);

  const handleSendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text,
      role: Role.User,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => [...prev, userMessage]);
    setIsAiTyping(true);

    try {
      const stream = await getChatResponse(text, messages, mode);
      let aiResponseText = '';
      const aiMessageId = Date.now() + 1;

      // Add a placeholder for the AI message to start streaming into
      const initialAiMessage: Message = {
        id: aiMessageId,
        text: '',
        role: Role.Model,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, initialAiMessage]);

      for await (const chunk of stream) {
        aiResponseText += chunk.text;
        setMessages(prev => prev.map(msg => 
          msg.id === aiMessageId ? { ...msg, text: aiResponseText } : msg
        ));
      }
      speak(aiResponseText);
    } catch (error) {
      console.error("Error getting AI response:", error);
      const errorMessage: Message = {
        id: Date.now() + 1,
        text: "Sorry bhai, thora issue hogaya hai. Try again later.",
        role: Role.Model,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsAiTyping(false);
    }
  }, [messages, mode, speak]);
  
  useEffect(() => {
    if (!isListening && transcript) {
      handleSendMessage(transcript);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isListening, transcript]);

  if (isBooting) {
    return <StartupScreen />;
  }

  return (
    <div className="bg-[#111111] text-white h-screen w-screen flex flex-col font-poppins overflow-hidden">
      <Header />
      <ModeToggle mode={mode} setMode={setMode} />
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth">
        {messages.map(msg => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        {isAiTyping && messages[messages.length - 1]?.role !== Role.Model && (
           <ChatMessage message={{ id: 'typing', text: '', role: Role.Model, timestamp: '' }} isTyping={true} />
        )}
      </div>
      <ChatInput onSendMessage={handleSendMessage} isListening={isListening} startListening={startListening} stopListening={stopListening} />
    </div>
  );
};

export default App;
