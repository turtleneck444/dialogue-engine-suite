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
    <div className="flex flex-col h-screen bg-gradient-to-br from-background via-background to-muted/20 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -150, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"
        />
      </div>

      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-border/50 bg-background/80 backdrop-blur-xl relative z-10"
      >
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <motion.div
                animate={{ 
                  boxShadow: [
                    "0 0 20px rgba(var(--primary), 0.3)",
                    "0 0 40px rgba(var(--primary), 0.6)",
                    "0 0 20px rgba(var(--primary), 0.3)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur-xl"
              />
              <div className="relative bg-gradient-to-r from-primary/10 to-secondary/10 p-4 rounded-full border border-primary/30 backdrop-blur-sm">
                <Bot className="w-8 h-8 text-primary" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent">
                Wallace
              </h1>
              <p className="text-sm text-muted-foreground">Distinguished AI Assistant • Multi-disciplinary Expert</p>
            </div>
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-6 h-6 text-primary/60" />
            </motion.div>
          </div>
          
          {/* Theme Toggle */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="hover:bg-primary/10 transition-colors"
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 relative z-10">
        <SearchIndicator isSearching={isSearching} />
        
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className={`flex gap-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'assistant' && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="relative"
                >
                  <Avatar className="w-10 h-10 border-2 border-primary/30 bg-gradient-to-r from-primary/10 to-secondary/10">
                    <AvatarFallback className="bg-gradient-to-r from-primary/20 to-secondary/20">
                      <Bot className="w-5 h-5 text-primary" />
                    </AvatarFallback>
                  </Avatar>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background"
                  />
                </motion.div>
              )}
              
              <motion.div
                whileHover={{ scale: 1.01 }}
                className={`max-w-[85%] ${message.role === 'user' ? 'order-first' : ''}`}
              >
                <Card className={`p-5 ${
                  message.role === 'user' 
                    ? 'bg-gradient-to-r from-primary to-primary/90 text-primary-foreground ml-auto border-primary/30' 
                    : 'bg-card/80 backdrop-blur-sm border border-border/50 shadow-lg'
                }`}>
                  <div className="prose prose-sm max-w-none text-inherit">
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                  </div>
                  <span className={`text-xs mt-3 block ${
                    message.role === 'user' 
                      ? 'text-primary-foreground/80' 
                      : 'text-muted-foreground'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </Card>
              </motion.div>

              {message.role === 'user' && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="relative"
                >
                  <Avatar className="w-10 h-10 border-2 border-secondary/30 bg-gradient-to-r from-secondary/10 to-primary/10">
                    <AvatarFallback className="bg-gradient-to-r from-secondary/20 to-primary/20">
                      <User className="w-5 h-5 text-secondary" />
                    </AvatarFallback>
                  </Avatar>
                </motion.div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        <AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex gap-4 justify-start"
            >
              <Avatar className="w-10 h-10 border-2 border-primary/30 bg-gradient-to-r from-primary/10 to-secondary/10">
                <AvatarFallback className="bg-gradient-to-r from-primary/20 to-secondary/20">
                  <Bot className="w-5 h-5 text-primary" />
                </AvatarFallback>
              </Avatar>
              <Card className="p-5 bg-card/80 backdrop-blur-sm border border-border/50 shadow-lg">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Wallace is thinking</span>
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                        className="w-2 h-2 bg-primary/60 rounded-full"
                      />
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-t border-border/50 bg-background/80 backdrop-blur-xl p-6 relative z-10"
      >
        <div className="max-w-4xl mx-auto">
          {/* Web Search Toggle */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <Globe className={`w-4 h-4 ${includeWebSearch ? 'text-primary' : 'text-muted-foreground'}`} />
            <span className="text-sm text-muted-foreground">Real-time web search</span>
            <Switch
              checked={includeWebSearch}
              onCheckedChange={setIncludeWebSearch}
              className="scale-75"
            />
          </div>
          
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <Input
                placeholder="Ask Wallace anything..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                className="min-h-[52px] text-base resize-none border-border/30 focus:border-primary/50 bg-background/50 backdrop-blur-sm rounded-2xl px-6 shadow-lg"
                disabled={isTyping}
              />
            </div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                className="h-[52px] px-6 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 shadow-lg rounded-2xl"
              >
                <Send className="w-5 h-5" />
              </Button>
            </motion.div>
          </div>
          <p className="text-xs text-muted-foreground mt-3 text-center">
            Wallace • Advanced AI with multi-disciplinary expertise and web search capabilities
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default AnimatedAIChat;