import React from 'react';
import { motion } from 'framer-motion';
import { Search, Globe, Zap } from 'lucide-react';

interface SearchIndicatorProps {
  isSearching: boolean;
}

const SearchIndicator: React.FC<SearchIndicatorProps> = ({ isSearching }) => {
  if (!isSearching) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="glass-effect p-6 rounded-3xl border border-primary/20 shadow-corporate"
    >
      <div className="flex items-center gap-4">
        <div className="relative flex-shrink-0">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="relative"
          >
            <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center shadow-glow">
              <Search className="w-6 h-6 text-primary-foreground" />
            </div>
          </motion.div>
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 bg-primary/20 rounded-full blur-md"
          />
        </div>
        
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-3">
            <Globe className="w-5 h-5 text-primary animate-pulse" />
            <span className="text-headline font-semibold text-foreground">
              Wallace is conducting real-time research
            </span>
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360] 
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Zap className="w-4 h-4 text-accent" />
            </motion.div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground font-medium">
              Accessing global intelligence networks
            </span>
            <div className="flex gap-1">
              {[0, 1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  animate={{ 
                    opacity: [0.3, 1, 0.3],
                    scale: [0.8, 1.2, 0.8]
                  }}
                  transition={{ 
                    duration: 1.8, 
                    repeat: Infinity, 
                    delay: i * 0.15 
                  }}
                  className="w-2 h-2 bg-primary rounded-full"
                />
              ))}
            </div>
          </div>
          
          <div className="h-1 bg-muted rounded-full overflow-hidden">
            <motion.div
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="h-full w-1/3 bg-gradient-primary rounded-full"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SearchIndicator;