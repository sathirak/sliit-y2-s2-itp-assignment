'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Loader2 } from 'lucide-react';
import { Button } from './button';
import { Card } from './card';
import { Badge } from './badge';
import { Textarea } from './textarea';

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    id: '1',
    question: '📦 How can I track my order?',
    answer: 'You can track your order by going to the "My Orders" section in your account. You\'ll find tracking information and delivery status there.'
  },
  {
    id: '2', 
    question: '🔄 What is your return policy?',
    answer: 'We offer a 30-day return policy for unworn items with original tags. Please visit our returns page or contact customer service for more details.'
  },
  {
    id: '3',
    question: '🚚 What are your shipping options?',
    answer: 'We offer standard shipping (3-5 business days) and express shipping (1-2 business days). Free standard shipping on orders over Rs 5000.'
  },
  {
    id: '4',
    question: '📏 How do I find my size?',
    answer: 'Check our size guide on each product page. We provide detailed measurements for all clothing items. When in doubt, we recommend sizing up.'
  },
  {
    id: '5',
    question: '💳 What payment methods do you accept?',
    answer: 'We accept all major credit cards, PayPal, and digital wallets like Apple Pay and Google Pay.'
  }
];

import { AIService } from '../ai/ai.service';

const getAutoResponse = async (message: string): Promise<string> => {
  try {
    return await AIService.generateResponse(message);
  } catch (error) {
    console.error('Error getting AI response:', error);
    return 'I apologize, but I\'m having trouble processing your request. Please try checking our FAQs or contact customer service for assistance.';
  }
};

export function ChatBubble() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      text: 'Hi! Welcome to CrownUp Clothing Store 👑 How can I help you today? Check out our FAQs below or ask me anything!',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [showFAQs, setShowFAQs] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setShowFAQs(false);

    // Show loading state while getting AI response
    const loadingMessage: ChatMessage = {
      id: 'loading',
      text: '',
      isUser: false,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, loadingMessage]);

    try {
      const aiResponse = await getAutoResponse(inputValue);
      
      // Replace loading message with actual response
      setMessages(prev => prev.filter(msg => msg.id !== 'loading').concat({
        id: Date.now().toString(),
        text: aiResponse,
        isUser: false,
        timestamp: new Date()
      }));
    } catch (error) {
      // Replace loading message with error message
      setMessages(prev => prev.filter(msg => msg.id !== 'loading').concat({
        id: Date.now().toString(),
        text: 'Sorry, I had trouble processing that. Please try again or check our FAQs.',
        isUser: false,
        timestamp: new Date()
      }));
    }
  };

  const handleFAQClick = (faq: FAQ) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: faq.question,
      isUser: true,
      timestamp: new Date()
    };

    const botResponse: ChatMessage = {
      id: (Date.now() + 1).toString(),
      text: faq.answer,
      isUser: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage, botResponse]);
    setShowFAQs(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Bubble Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg"
          size="sm"
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <MessageCircle className="w-6 h-6" />
          )}
        </Button>
      </div>

      {/* Chat Popup */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 animate-in slide-in-from-bottom-5 slide-in-from-right-5 duration-200">
          <Card className="border shadow-2xl bg-white">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Bot className="w-6 h-6" />
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse border-2 border-white"></div>
                </div>
                <div>
                  <span className="font-semibold">CrownUp Support</span>
                  <Badge variant="secondary" className="ml-2 text-xs bg-white/20 text-white border-white/30">
                    Online
                  </Badge>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Messages Area */}
            <div className="h-80 overflow-y-auto p-4 space-y-4">
              {/* FAQ Section */}
              {showFAQs && messages.length <= 1 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="outline" className="text-xs">
                      Quick Help
                    </Badge>
                    <span className="text-sm text-gray-600 font-medium">
                      Frequently Asked Questions
                    </span>
                  </div>
                  <div className="grid gap-2">
                    {faqs.map((faq) => (
                      <Button
                        key={faq.id}
                        variant="outline"
                        onClick={() => handleFAQClick(faq)}
                        className="w-full text-left p-3 h-auto bg-gradient-to-r from-gray-50 to-gray-100 hover:from-blue-50 hover:to-blue-100 border-gray-200 hover:border-blue-300 transition-all duration-200"
                      >
                        <span className="text-sm text-gray-700">{faq.question}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Chat Messages */}
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start gap-2 ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!message.isUser && (
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Bot className="w-4 h-4 text-blue-600" />
                    </div>
                  )}
                  <div
                    className={`max-w-[75%] p-3 rounded-lg shadow-sm ${
                      message.isUser
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
                        : 'bg-white border border-gray-200 text-gray-900'
                    }`}
                  >
                    {message.id === 'loading' ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                        <span className="text-sm text-gray-500">CrownUp AI is thinking...</span>
                      </div>
                    ) : (
                      <>
                        <p className="text-sm leading-relaxed">{message.text}</p>
                        <p
                          className={`text-xs mt-2 ${
                            message.isUser ? 'text-blue-100' : 'text-gray-500'
                          }`}
                        >
                          {message.timestamp.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </>
                    )}
                  </div>
                  {message.isUser && (
                    <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-gray-600" />
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t bg-gray-50/50">
              <div className="flex gap-2 items-end">
                <div className="flex-1">
                  <Textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="min-h-[40px] max-h-[80px] resize-none"
                    rows={1}
                  />
                </div>
                <Button 
                  onClick={handleSendMessage} 
                  size="sm"
                  disabled={!inputValue.trim()}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex items-center justify-between mt-2">
                {!showFAQs && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowFAQs(true)}
                    className="text-xs text-blue-600 hover:text-blue-800 h-auto p-1"
                  >
                    Show FAQs again
                  </Button>
                )}
                <Badge variant="secondary" className="text-xs ml-auto">
                  Powered by CrownUp AI
                </Badge>
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}