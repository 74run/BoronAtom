import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { 
  MessageCircle, 
  X, 
  Send, 
  Minimize2, 
  Maximize2, 
  Bot,
  User,
  Loader2,
  MessagesSquare
} from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const AIChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: 'Hello! I\'m your Resume Assistant. How can I help you today?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Background pattern for chat window - can be customized
  const backgroundPattern = `
    radial-gradient(circle at 15% 25%, rgba(100, 150, 255, 0.05) 0%, transparent 20%),
    radial-gradient(circle at 85% 75%, rgba(100, 150, 255, 0.05) 0%, transparent 20%),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.95))
  `;

  const scrollToBottom = (): void => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const formatTime = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date);
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    setMessages(prev => [...prev, { 
      role: 'user', 
      content: userMessage,
      timestamp: new Date()
    }]);
    setIsLoading(true);
    setIsTyping(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsTyping(false);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `I understand you're asking about "${userMessage}". How can I help you with that?`,
        timestamp: new Date()
      }]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleChat = (): void => {
    setIsOpen(!isOpen);
    if (isMinimized) setIsMinimized(false);
  };

  const toggleMinimize = (e: React.MouseEvent): void => {
    e.stopPropagation();
    setIsMinimized(!isMinimized);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen && (
        <div className="relative">
          <Button
            onClick={toggleChat}
            className="rounded-full w-12 h-12 flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            <MessagesSquare size={20} className="animate-pulse" />
          </Button>
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
        </div>
      )}

      {isOpen && (
        <Card className={`
          transform transition-all duration-300 ease-in-out shadow-2xl
          ${isMinimized ? 'h-14' : 'h-[550px]'}
          w-[340px] rounded-2xl backdrop-blur-sm
          before:content-[''] before:absolute before:inset-0 before:rounded-2xl
          before:bg-opacity-75 before:z-[-1]
        `}>
          <div 
            className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-2xl cursor-pointer"
            onClick={toggleChat}
          >
            <div className="flex items-center gap-2">
              <div className="bg-white/10 p-1.5 rounded-lg">
                <Bot size={16} className="text-blue-100" />
              </div>
              <div>
                <h3 className="font-medium text-sm">Resume Assistant</h3>
                {isTyping && (
                  <span className="text-[10px] text-blue-200">typing...</span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7 text-white hover:text-white hover:bg-white/10 rounded-full"
                onClick={toggleMinimize}
              >
                {isMinimized ? <Maximize2 size={14} /> : <Minimize2 size={14} />}
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7 text-white hover:text-white hover:bg-white/10 rounded-full"
                onClick={toggleChat}
              >
                <X size={14} />
              </Button>
            </div>
          </div>

          {!isMinimized && (
            <>
              <CardContent 
                className="p-0 h-[calc(100%-120px)]"
                style={{ background: backgroundPattern }}
              >
                <div className="h-full overflow-y-auto p-3 space-y-3 scroll-smooth">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex items-start gap-2 ${
                        message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                      }`}
                    >
                      <div className={`
                        flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center
                        ${message.role === 'user' 
                          ? 'bg-blue-100' 
                          : 'bg-gray-100'
                        }
                      `}>
                        {message.role === 'user' ? (
                          <User size={12} className="text-blue-600" />
                        ) : (
                          <Bot size={12} className="text-gray-600" />
                        )}
                      </div>
                      <div className={`
                        group flex flex-col
                        ${message.role === 'user' ? 'items-end' : 'items-start'}
                      `}>
                        <div className={`
                          max-w-[85%] p-2 rounded-2xl text-sm
                          ${message.role === 'user' 
                            ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-tr-none' 
                            : 'bg-white border border-gray-100 text-gray-700 rounded-tl-none shadow-sm'
                          }
                        `}>
                          {message.content}
                        </div>
                        <span className="text-[10px] text-gray-400 mt-0.5 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          {formatTime(message.timestamp)}
                        </span>
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex items-start gap-2">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                        <Bot size={12} className="text-gray-600" />
                      </div>
                      <div className="bg-white border border-gray-100 p-3 rounded-2xl rounded-tl-none shadow-sm">
                        <div className="flex space-x-1">
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </CardContent>

              <form
                onSubmit={handleSubmit}
                className="absolute bottom-0 left-0 right-0 p-3 bg-white border-t border-gray-100 rounded-b-2xl"
              >
                <div className="flex gap-2">
                  <Input
                    value={inputMessage}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                      setInputMessage(e.target.value)
                    }
                    placeholder="Type your message..."
                    disabled={isLoading}
                    className="flex-1 rounded-full text-sm border-gray-200 focus:border-blue-500 focus:ring-blue-500 h-8 px-3 bg-white text-gray-900 placeholder:text-gray-500"
                  />
                  <Button
                    type="submit"
                    disabled={isLoading || !inputMessage.trim()}
                    size="icon"
                    className="rounded-full bg-blue-600 hover:bg-blue-700 text-white h-8 w-8"
                  >
                    {isLoading ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Send size={14} />
                    )}
                  </Button>
                </div>
              </form>
            </>
          )}
        </Card>
      )}
    </div>
  );
};

export default AIChatbot;