import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import { taskService } from '@/services';

const TaskSearchBar = ({ searchTerm, onSearchChange, projects }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef(null);
  const suggestionsRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const getSuggestions = async () => {
      if (searchTerm.length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      setLoading(true);
      try {
        const results = await taskService.getSuggestions(searchTerm, projects);
        setSuggestions(results);
        setShowSuggestions(results.length > 0);
      } catch (error) {
        console.error('Failed to get suggestions:', error);
        setSuggestions([]);
        setShowSuggestions(false);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(getSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm, projects]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    onSearchChange(value);
  };

  const handleSuggestionClick = (suggestion) => {
    onSearchChange(suggestion.text);
    setShowSuggestions(false);
  };

  const handleInputFocus = () => {
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const highlightMatch = (text, query) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, index) =>
      regex.test(part) ? (
        <span key={index} className="bg-primary-100 text-primary-700 font-medium">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const clearSearch = () => {
    onSearchChange('');
    setShowSuggestions(false);
    searchRef.current?.focus();
  };

  return (
    <div className="relative">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {loading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <ApperIcon name="Loader2" className="h-5 w-5 text-surface-400" />
            </motion.div>
          ) : (
            <ApperIcon name="Search" className="h-5 w-5 text-surface-400" />
          )}
        </div>
        <input
          ref={searchRef}
          type="text"
          className="block w-full pl-10 pr-10 py-3 border border-surface-300 rounded-card bg-white placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-sm"
          placeholder="Search tasks by title, description, or project..."
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
        />
        {searchTerm && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-surface-600 text-surface-400 transition-colors"
          >
            <ApperIcon name="X" className="h-5 w-5" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && (
          <motion.div
            ref={suggestionsRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-full mt-1 bg-white border border-surface-200 rounded-card shadow-card-hover max-h-64 overflow-y-auto"
          >
            {suggestions.map((suggestion, index) => (
              <motion.button
                key={`${suggestion.type}-${suggestion.id}-${index}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full px-4 py-3 text-left hover:bg-surface-50 focus:bg-surface-50 focus:outline-none border-b border-surface-100 last:border-b-0 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    {suggestion.type === 'task' && (
                      <ApperIcon name="CheckSquare" className="h-4 w-4 text-surface-400" />
                    )}
                    {suggestion.type === 'project' && (
                      <ApperIcon name="Folder" className="h-4 w-4 text-surface-400" />
                    )}
                    {suggestion.type === 'description' && (
                      <ApperIcon name="FileText" className="h-4 w-4 text-surface-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-surface-900 truncate">
                      {highlightMatch(suggestion.text, searchTerm)}
                    </p>
                    {suggestion.subtitle && (
                      <p className="text-xs text-surface-500 truncate mt-0.5">
                        {suggestion.subtitle}
                      </p>
                    )}
                  </div>
                  <div className="flex-shrink-0">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-surface-100 text-surface-600 capitalize">
                      {suggestion.type}
                    </span>
                  </div>
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TaskSearchBar;