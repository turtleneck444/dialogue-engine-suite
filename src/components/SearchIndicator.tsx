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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="bg-card border border-border/50 p-3 rounded-xl"
    >
      <div className="flex items-center gap-3">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-6 h-6 bg-gradient-primary rounded-full flex items-center justify-center"
        >
          <Search className="w-3 h-3 text-primary-foreground" />
        </motion.div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 text-sm">
            <Globe className="w-4 h-4 text-primary" />
            <span className="font-medium text-foreground">Searching the web</span>
          </div>
          
          <div className="flex gap-1 mt-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ 
                  duration: 1.5, 
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
  );
};

export default SearchIndicator;