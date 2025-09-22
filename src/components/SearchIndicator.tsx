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
      exit={{ opacity: 0, y: -20 }}
      className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-500/20 backdrop-blur-sm"
    >
      <div className="relative">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
        >
          <Search className="w-4 h-4 text-white" />
        </motion.div>
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute inset-0 bg-blue-500/20 rounded-full"
        />
      </div>
      
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <Globe className="w-4 h-4 text-blue-500" />
          <span className="text-sm font-medium text-foreground">Wallace is searching the web</span>
          <Zap className="w-3 h-3 text-yellow-500" />
        </div>
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
              className="w-2 h-2 bg-blue-500 rounded-full"
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default SearchIndicator;