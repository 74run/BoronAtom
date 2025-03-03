import React, { useState, useRef, useEffect } from 'react';
import { MessagesSquare, Send, Bot, X, Minimize, Maximize, Circle } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import logo from './images/small-logo.png';
import axios from 'axios';
import { useUserId } from './useUserId';
import ReactMarkdown from 'react-markdown';
import './MarkdownStyles.css';

// Define the Message interface
interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Define the Groq API response types
interface GroqMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface GroqResponse {
  choices: {
    message: {
      content: string;
    };
    index: number;
  }[];
}

// Define the user details interfaces
interface UserDetails {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
}

interface EduDetails {
  education: Array<{
    university: string;
    cgpa: string;
    degree: string;
    major: string;
    startDate: { month: string; year: string };
    endDate: { month: string; year: string };
    includeInResume: boolean;
    isPresent?: boolean;
  }>;
  experience: Array<{
    jobTitle: string;
    company: string;
    location: string;
    startDate: { month: string; year: string };
    endDate: { month: string; year: string };
    description: string;
    includeInResume: boolean;
    isPresent?: boolean;
  }>;
  summary: Array<{
    content: string;
  }>;
  project: Array<{
    name: string;
    startDate: { month: string; year: string };
    endDate: { month: string; year: string };
    skills: string;
    description: string;
    includeInResume: boolean;
    isPresent?: boolean;
  }>;
  involvement: Array<{
    organization: string;
    role: string;
    startDate: { month: string; year: string };
    endDate: { month: string; year: string };
    description: string;
    includeInResume: boolean;
    isPresent?: boolean;
  }>;
  certification: Array<{
    name: string;
    issuedBy: string;
    issuedDate: { month: string; year: string };
    expirationDate: { month: string; year: string };
    url: string;
    includeInResume: boolean;
  }>;
  skills: Array<{
    domain: string;
    name: string;
    includeInResume: boolean;
  }>;
  contact: Array<{
    name: string;
    email: string;
    phoneNumber: string;
    linkedIn: string;
  }>;
}

// Mock response function for testing when API is not available
const getMockResponse = (userMessage: string): string => {
  const responses = [
    "I'm here to help with your resume. What specific section would you like assistance with?",
    "That's a great question about resumes. Focus on quantifiable achievements rather than just listing duties.",
    "When formatting your resume, consistency is key. Use the same font, spacing, and bullet style throughout.",
    "For your work experience, use action verbs and focus on results. Instead of 'Responsible for...', try 'Achieved...' or 'Improved...'",
    "Your resume should ideally be 1-2 pages, depending on your experience level.",
  ];
  return responses[Math.floor(Math.random() * responses.length)];
};

const AIChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [eduDetails, setEduDetails] = useState<EduDetails | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const userId = useUserId();

  // Fetch user details when component mounts
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        if (!userId) {
          setMessages([
            {
              role: 'assistant',
              content: 'Please log in to access your profile information.',
              timestamp: new Date(),
            },
          ]);
          return;
        }

        const userResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/userprofile/details/${userId}`);
        setUserDetails(userResponse.data.user);

        const eduResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/userprofile/EduDetails/${userId}`);
        if (eduResponse.data && eduResponse.data.user) {
          setEduDetails(eduResponse.data.user);
          // Set initial welcome message with user's name
          setMessages([
            {
              role: 'assistant',
              content: `Hi ${userResponse.data.user.firstName}! I'm your Boron Atom Resume Assistant. I can help you with:\n\n` +
                      '1. Viewing your profile details\n' +
                      '2. Reviewing your education and experience\n' +
                      '3. Checking your skills and certifications\n' +
                      '4. Providing resume writing tips\n\n' +
                      'What would you like to know about?',
              timestamp: new Date(),
            },
          ]);
        } else {
          throw new Error('Failed to fetch education details');
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
        // Set error message
        setMessages([
          {
            role: 'assistant',
            content: 'There was an error accessing your profile information. Please try again later.',
            timestamp: new Date(),
          },
        ]);
      }
    };

    fetchUserDetails();
  }, [userId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const scrollToBottom = (): void => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };


  const getUserProfileContext = (): string => {
    if (!userDetails || !eduDetails) {
      return "User details are not available.";
    }

    const education = eduDetails.education.filter(edu => edu.includeInResume);
    const experience = eduDetails.experience.filter(exp => exp.includeInResume);
    const skills = eduDetails.skills.filter(skill => skill.includeInResume).map(skill => skill.name).join(", ");
    const projects = eduDetails.project.filter(proj => proj.includeInResume).map(proj => `${proj.name} using ${proj.skills}`).join("\n");
    const certifications = eduDetails.certification.filter(cert => cert.includeInResume).map(cert => `${cert.name} by ${cert.issuedBy}, issued on ${cert.issuedDate.month}/${cert.issuedDate.year}`).join("\n");

    return `User Profile:
Name: ${userDetails.firstName} ${userDetails.lastName}
Email: ${userDetails.email}
Education: ${education.length > 0 ? education.map(edu => `${edu.degree} in ${edu.major} from ${edu.university}`).join(", ") : "None provided"}
Experience: ${experience.length > 0 ? experience.map(exp => `${exp.jobTitle} at ${exp.company}`).join(", ") : "None provided"}
Skills: ${skills || "None provided"}
Projects: ${projects || "None provided"}
Certifications: ${certifications || "None provided"}`;
  };

  

  const callGroqAPI = async (userInput: string, chatHistory: Message[]): Promise<string> => {
    try {
      // Get user profile context dynamically
      const userProfileContext = getUserProfileContext();
  
      // Prepare messages for Groq API
      const apiMessages: GroqMessage[] = [
        {
          role: 'system',
          content: `You are a helpful AI assistant. Use the following user profile data to answer their queries intelligently:
          
          ${userProfileContext}
          
          If a user asks about their details, respond with the relevant information directly from the profile.`
        },
        ...chatHistory.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        { role: 'user', content: userInput }
      ];
  
      const apiKey = process.env.REACT_APP_GROQ_API_KEY;
      
      if (!apiKey) {
        console.warn('No Groq API key found. Using mock responses.');
        return getMockResponse(userInput);
      }
  
      // Call Groq API
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'llama3-70b-8192',
          messages: apiMessages,
          temperature: 0.5,
          max_tokens: 500
        })
      });
  
      if (!response.ok) {
        console.error('API error status:', response.status);
        return getMockResponse(userInput);
      }
  
      const data: GroqResponse = await response.json();
      return data.choices[0]?.message?.content || 'Sorry, I couldn\'t process your request.';
    } catch (error) {
      console.error('Error in callGroqAPI:', error);
      return getMockResponse(userInput);
    }
  };
  

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!input.trim()) return;
  
    // Add user message
    const userMessage: Message = {
      role: 'user', 
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
  
    try {
      // Get response from Groq API or fallback to mock
      const response = await callGroqAPI(input, messages);
      
      // Add a slight delay to simulate thinking
      await new Promise(resolve => setTimeout(resolve, 800));

      // Add assistant message
      const assistantMessage: Message = {
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      
      // Add error message
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again later.',
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const toggleChat = (): void => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
  };

  const toggleMinimize = (e: React.MouseEvent): void => {
    e.stopPropagation();
    setIsMinimized(!isMinimized);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen && (
        <div className="relative group">
          <Button
            onClick={toggleChat}
            className="rounded-full w-14 h-14 flex items-center justify-center bg-gray-800 hover:bg-gray-900 text-white shadow-lg transition-all duration-300 transform hover:scale-105 p-2"
            aria-label="Open chat assistant"
          >
            <div className="relative w-full h-full flex items-center justify-center">
              <img 
                src={logo} 
                alt="Logo"
                className="w-10 h-10 object-contain"
              />
            </div>
          </Button>
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
          <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="bg-gray-800 text-white text-xs py-1 px-2 rounded-md shadow-lg whitespace-nowrap">
              Resume Assistant
            </div>
          </div>
        </div>
      )}

      {isOpen && (
        <Card className="overflow-hidden shadow-xl rounded-lg border border-gray-200 dark:border-gray-700 w-[350px]"
              style={{ height: isMinimized ? '48px' : '600px' }}>
          {/* Header - Fixed height and consistent styling */}
          <div 
            className="flex items-center justify-between h-12 px-3 bg-blue-600 text-white cursor-pointer"
            onClick={toggleMinimize}
          >
            <div className="flex items-center space-x-2">
              <div className="bg-white/10 p-1 rounded-md flex items-center justify-center">
                <Bot size={14} className="text-white" />
              </div>
              <div>
                <h3 className="font-medium text-xs">Boron Atom Resume Assistant</h3>
                {isTyping && !isMinimized && (
                  <span className="text-[10px] text-blue-100">typing...</span>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 rounded-md hover:bg-white/10 flex items-center justify-center p-0"
                onClick={toggleMinimize}
                aria-label={isMinimized ? "Maximize chat" : "Minimize chat"}
              >
                {isMinimized ? <Maximize size={12} /> : <Minimize size={12} />}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 rounded-md hover:bg-white/10 flex items-center justify-center p-0"
                onClick={toggleChat}
                aria-label="Close chat"
              >
                <X size={12} />
              </Button>
            </div>
          </div>

          {!isMinimized ? (
            <>
              {/* Messages Container - Calculated height with background color */}
              <div className="overflow-y-auto p-3 space-y-3 bg-gray-50 dark:bg-gray-900" 
                   style={{ height: 'calc(600px - 108px)' }}>
                  {messages.map((message, index) => (
                    <div
                      key={index}
                    className={`flex ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {message.role === 'assistant' && (
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center mr-1.5">
                        <Bot size={12} className="text-white" />
                      </div>
                    )}
                    <div
                      className={`max-w-[75%] px-3 py-2 rounded-lg ${
                        message.role === 'user'
                          ? 'bg-blue-600 text-white ml-1.5'
                          : 'bg-gray-800 dark:bg-gray-900 text-white ml-1.5'
                      }`}
                    >
                      <div className={message.role === 'assistant' ? "" : "text-xs leading-relaxed"}>
                        {message.role === 'assistant' ? (
                          <div className="markdown-content">
                            <ReactMarkdown>
                              {message.content}
                            </ReactMarkdown>
                          </div>
                        ) : (
                          message.content
                        )}
                      </div>
                      <div
                        className={`text-[10px] mt-1 text-right ${
                          message.role === 'user' ? 'text-blue-100' : 'text-gray-300 dark:text-gray-300'
                        }`}
                      >
                        {formatTime(message.timestamp)}
                      </div>
                    </div>
                  </div>
                ))}
                {isTyping && (
                <div className="flex justify-start">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center mr-1.5">
                    <Bot size={12} className="text-white" />
                    </div>
                  <div className="bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 rounded-lg">
                      <div className="flex space-x-1">
                      <div className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Form - Fixed height and consistent styling */}
              <div className="h-[60px] p-3 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 flex items-center">
                <form onSubmit={handleSubmit} className="flex items-center space-x-2 w-full">
                  <Input
                    ref={inputRef}
                    type="text" 
                    placeholder="Type your message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-1 h-9 text-xs bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 rounded-md"
                  />
                  <Button
                    type="submit"
                    size="sm"
                    disabled={!input.trim() || isTyping}
                    className="h-9 w-9 p-0 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Send message"
                  >
                      <Send size={14} />
                  </Button>
                </form>
                </div>
            </>
          ) : (
            <div className="flex items-center h-full px-3 bg-white dark:bg-gray-900">
              <Bot size={14} className="text-blue-600 mr-2" />
              <span className="text-xs text-gray-700 dark:text-gray-300">Boron Atom Resume Assistant</span>
              {isTyping && (
                <div className="ml-auto flex space-x-1">
                  <div className="w-1 h-1 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-1 h-1 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-1 h-1 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              )}
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

export default AIChatbot;