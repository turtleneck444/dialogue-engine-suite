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
      {/* Futuristic Background Grid */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-corporate opacity-5" />
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(hsl(var(--primary) / 0.1) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--primary) / 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '32px 32px'
        }} />
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 120, 0],
            y: [0, -80, 0],
            rotate: [0, 360, 0]
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-primary opacity-10 rounded-full blur-3xl animate-float"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 120, 0],
            rotate: [360, 0, 360]
          }}
          transition={{
            duration: 35,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-gradient-accent opacity-8 rounded-full blur-3xl animate-float"
        />
        <motion.div
          animate={{
            x: [0, 60, 0],
            y: [0, -60, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/2 right-1/4 w-48 h-48 bg-gradient-corporate opacity-6 rounded-full blur-2xl"
        />
      </div>

      {/* Corporate Header */}
      <motion.header 
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="glass-effect border-b border-border/30 relative z-10 shadow-corporate"
      >
        <div className="container mx-auto">
          <div className="flex items-center justify-between py-6 px-4 sm:px-6 lg:px-8">
            {/* Brand Identity */}
            <div className="flex items-center gap-6">
              <motion.div 
                className="relative"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="absolute inset-0 bg-gradient-primary rounded-2xl blur-xl opacity-40 animate-pulse-glow" />
                <div className="relative glass-effect p-4 rounded-2xl border border-primary/20">
                  <Bot className="w-10 h-10 text-primary animate-float" />
                </div>
              </motion.div>
              
              <div className="space-y-1">
                <motion.h1 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="text-display text-gradient font-bold tracking-tight"
                >
                  Wallace
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="text-body text-muted-foreground font-medium"
                >
                  AI Executive Assistant • Multi-Disciplinary Intelligence
                </motion.p>
              </div>
              
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                className="hidden sm:block"
              >
                <div className="p-2 rounded-full bg-gradient-accent/20">
                  <Sparkles className="w-6 h-6 text-accent animate-pulse" />
                </div>
              </motion.div>
            </div>
            
            {/* Controls */}
            <div className="flex items-center gap-3">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                  className="glass-effect hover:bg-primary/10 transition-all duration-300 rounded-xl"
                >
                  <motion.div
                    animate={{ rotate: theme === 'light' ? 0 : 180 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                  >
                    {theme === 'light' ? (
                      <Moon className="w-5 h-5 text-primary" />
                    ) : (
                      <Sun className="w-5 h-5 text-accent" />
                    )}
                  </motion.div>
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Messages Area */}
      <main className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto scrollbar-corporate px-4 sm:px-6 lg:px-8 py-8">
          <div className="container mx-auto max-w-4xl space-y-8">
            <SearchIndicator isSearching={isSearching} />
            
            <AnimatePresence mode="popLayout">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  layout
                  initial={{ opacity: 0, y: 40, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className={`flex gap-4 sm:gap-6 ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {/* Assistant Avatar */}
                  {message.role === 'assistant' && (
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="relative flex-shrink-0"
                    >
                      <div className="absolute inset-0 bg-gradient-primary rounded-full blur-md opacity-40 animate-pulse-glow" />
                      <div className="relative w-12 h-12 sm:w-14 sm:h-14 glass-effect rounded-full border border-primary/30 flex items-center justify-center">
                        <Bot className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
                      </div>
                      <motion.div
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute -bottom-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-background shadow-glow"
                      />
                    </motion.div>
                  )}
                  
                  {/* Message Content */}
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    className={`flex-1 max-w-[85%] sm:max-w-[75%] ${
                      message.role === 'user' ? 'order-first' : ''
                    }`}
                  >
                    <div className={`relative group ${
                      message.role === 'user' 
                        ? 'ml-auto' 
                        : ''
                    }`}>
                      <div className={`glass-effect p-6 rounded-3xl border shadow-corporate transition-all duration-300 ${
                        message.role === 'user' 
                          ? 'bg-gradient-primary text-primary-foreground border-primary/30 shadow-glow' 
                          : 'border-border/30 hover:border-primary/20 hover:shadow-elevated'
                      }`}>
                        <div className="space-y-3">
                          <p className="text-body leading-relaxed whitespace-pre-wrap font-medium">
                            {message.content}
                          </p>
                          <div className={`flex items-center gap-2 text-xs ${
                            message.role === 'user' 
                              ? 'text-primary-foreground/70' 
                              : 'text-muted-foreground'
                          }`}>
                            <span className="font-mono">
                              {message.timestamp.toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </span>
                            {message.role === 'assistant' && (
                              <div className="flex items-center gap-1 ml-auto">
                                <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                                <span>Verified</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* User Avatar */}
                  {message.role === 'user' && (
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: -5 }}
                      className="relative flex-shrink-0"
                    >
                      <div className="absolute inset-0 bg-gradient-accent rounded-full blur-md opacity-40" />
                      <div className="relative w-12 h-12 sm:w-14 sm:h-14 glass-effect rounded-full border border-accent/30 flex items-center justify-center">
                        <User className="w-6 h-6 sm:w-7 sm:h-7 text-accent" />
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing Indicator */}
            <AnimatePresence>
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex gap-4 sm:gap-6 justify-start"
                >
                  <div className="relative flex-shrink-0">
                    <div className="absolute inset-0 bg-gradient-primary rounded-full blur-md opacity-40 animate-pulse" />
                    <div className="relative w-12 h-12 sm:w-14 sm:h-14 glass-effect rounded-full border border-primary/30 flex items-center justify-center">
                      <Bot className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
                    </div>
                  </div>
                  
                  <div className="glass-effect p-6 rounded-3xl border border-border/30 shadow-corporate">
                    <div className="flex items-center gap-3">
                      <span className="text-body text-muted-foreground font-medium">
                        Wallace is analyzing
                      </span>
                      <div className="flex gap-1">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            animate={{ 
                              scale: [0.8, 1.2, 0.8],
                              opacity: [0.4, 1, 0.4] 
                            }}
                            transition={{ 
                              duration: 1.5, 
                              repeat: Infinity, 
                              delay: i * 0.2 
                            }}
                            className="w-2 h-2 bg-primary rounded-full"
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

      {/* Input Section */}
      <motion.footer 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="glass-effect border-t border-border/30 relative z-10 shadow-elevated"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-4xl mx-auto space-y-4">
            {/* Search Toggle */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="flex items-center justify-center gap-4 py-2"
            >
              <div className="flex items-center gap-3 glass-effect px-4 py-2 rounded-full border border-border/30">
                <Globe className={`w-4 h-4 transition-colors ${
                  includeWebSearch ? 'text-primary' : 'text-muted-foreground'
                }`} />
                <span className="text-sm font-medium text-muted-foreground">
                  Real-time Intelligence
                </span>
                <Switch
                  checked={includeWebSearch}
                  onCheckedChange={setIncludeWebSearch}
                  className="scale-90"
                />
              </div>
            </motion.div>
            
            {/* Input Area */}
            <div className="flex gap-4 items-end">
              <div className="flex-1 space-y-2">
                <div className="relative">
                  <Input
                    placeholder="Consult Wallace on any topic..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="h-14 sm:h-16 text-base glass-effect border-border/30 focus:border-primary/50 rounded-2xl px-6 pr-20 font-medium placeholder:text-muted-foreground/60 shadow-glass transition-all duration-300"
                    disabled={isTyping}
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-mono">
                    {inputValue.length}/1000
                  </div>
                </div>
              </div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-shrink-0"
              >
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isTyping}
                  className="h-14 sm:h-16 px-6 sm:px-8 btn-corporate rounded-2xl font-semibold text-base shadow-elevated disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span className="hidden sm:inline ml-2">Send</span>
                </Button>
              </motion.div>
            </div>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.4 }}
              className="text-xs text-center text-muted-foreground font-medium"
            >
              <span className="text-gradient font-semibold">Wallace</span> • 
              Enterprise-grade AI with advanced reasoning and real-time knowledge access
            </motion.p>
          </div>
        </div>
      </motion.footer>
    </div>
  );
};

export default AnimatedAIChat;