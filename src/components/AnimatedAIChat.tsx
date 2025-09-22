import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, Bot, User, Sparkles, Moon, Sun, Monitor, Search, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useTheme } from '@/components/ThemeProvider';
import SearchIndicator from '@/components/SearchIndicator';
import { Switch } from '@/components/ui/switch';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

const AnimatedAIChat = () => {
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Good day. I'm Wallace, your distinguished AI assistant with expertise spanning multiple academic disciplines. I bring the analytical rigor of advanced degrees in technology, business, sciences, humanities, and beyond to every conversation. How may I assist you with your inquiries today?",
      role: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [includeWebSearch, setIncludeWebSearch] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsTyping(true);
    setIsSearching(includeWebSearch);

    try {
      const { data, error } = await supabase.functions.invoke('chat', {
        body: { 
          message: currentInput,
          includeWebSearch: includeWebSearch
        }
      });

      setIsSearching(false);

      if (error) {
        throw error;
      }

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        role: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
      
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm sorry, I'm having trouble responding right now. Please try again in a moment.",
        role: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-subtle relative overflow-hidden">
      {/* Minimal Background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(hsl(var(--primary) / 0.05) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--primary) / 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Compact Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="border-b border-border/30 bg-background/95 backdrop-blur-sm relative z-10"
      >
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Bot className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gradient">Wallace</h1>
                <p className="text-xs text-muted-foreground">AI Assistant</p>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="w-8 h-8 p-0 hover:bg-muted"
            >
              {theme === 'light' ? (
                <Moon className="w-4 h-4" />
              ) : (
                <Sun className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Messages Area */}
      <main className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto px-4 sm:px-6 py-4">
          <div className="container mx-auto max-w-3xl space-y-4">
            <SearchIndicator isSearching={isSearching} />
            
            <AnimatePresence mode="popLayout">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className={`flex gap-3 ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {/* Assistant Avatar */}
                  {message.role === 'assistant' && (
                    <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot className="w-4 h-4 text-primary-foreground" />
                    </div>
                  )}
                  
                  {/* Message Content */}
                  <div className={`flex-1 max-w-[80%] ${
                    message.role === 'user' ? 'order-first' : ''
                  }`}>
                    <div className={`p-4 rounded-2xl ${
                      message.role === 'user' 
                        ? 'bg-gradient-primary text-primary-foreground ml-auto' 
                        : 'bg-card border border-border/50'
                    }`}>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {message.content}
                      </p>
                      <div className={`text-xs mt-2 ${
                        message.role === 'user' 
                          ? 'text-primary-foreground/70' 
                          : 'text-muted-foreground'
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                    </div>
                  </div>

                  {/* User Avatar */}
                  {message.role === 'user' && (
                    <div className="w-8 h-8 bg-gradient-accent rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <User className="w-4 h-4 text-accent-foreground" />
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing Indicator */}
            <AnimatePresence>
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex gap-3 justify-start"
                >
                  <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="w-4 h-4 text-primary-foreground" />
                  </div>
                  
                  <div className="bg-card border border-border/50 p-4 rounded-2xl">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Thinking</span>
                      <div className="flex gap-1">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            animate={{ opacity: [0.4, 1, 0.4] }}
                            transition={{ 
                              duration: 1.2, 
                              repeat: Infinity, 
                              delay: i * 0.2 
                            }}
                            className="w-1.5 h-1.5 bg-primary rounded-full"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            <div ref={messagesEndRef} />
          </div>
        </div>
      </main>

      {/* Compact Input Section */}
      <motion.footer 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="border-t border-border/30 bg-background/95 backdrop-blur-sm relative z-10"
      >
        <div className="container mx-auto px-4 sm:px-6 py-3">
          <div className="max-w-3xl mx-auto space-y-3">
            {/* Search Toggle - Compact */}
            <div className="flex items-center justify-center">
              <div className="flex items-center gap-2 bg-muted/50 px-3 py-1 rounded-full text-xs">
                <Globe className={`w-3 h-3 ${
                  includeWebSearch ? 'text-primary' : 'text-muted-foreground'
                }`} />
                <span className="text-muted-foreground">Web search</span>
                <Switch
                  checked={includeWebSearch}
                  onCheckedChange={setIncludeWebSearch}
                  className="scale-75"
                />
              </div>
            </div>
            
            {/* Input Area - Compact */}
            <div className="flex gap-3 items-end">
              <div className="flex-1">
                <Input
                  placeholder="Ask Wallace anything..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="h-10 text-sm border-border/30 focus:border-primary/50 rounded-xl px-4"
                  disabled={isTyping}
                />
              </div>
              
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                size="sm"
                className="h-10 px-4 bg-gradient-primary hover:opacity-90 rounded-xl"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  );
};

export default AnimatedAIChat;