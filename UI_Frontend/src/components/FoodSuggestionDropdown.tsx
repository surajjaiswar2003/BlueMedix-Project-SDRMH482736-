import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';

interface FoodItem {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface FoodSuggestionDropdownProps {
  value: string;
  onChange: (value: string, nutritionData?: FoodItem) => void;
  placeholder?: string;
}

export function FoodSuggestionDropdown({
  value,
  onChange,
  placeholder = 'Search for food...'
}: FoodSuggestionDropdownProps) {
  const [suggestions, setSuggestions] = useState<FoodItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!value.trim()) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await axios.get(`/api/food-data/suggestions?query=${encodeURIComponent(value)}`);
        setSuggestions(response.data);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [value]);

  const handleSuggestionClick = (suggestion: FoodItem) => {
    onChange(suggestion.name, suggestion);
    setShowSuggestions(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Input
        type="text"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setShowSuggestions(true);
        }}
        onFocus={() => setShowSuggestions(true)}
        placeholder={placeholder}
        className="w-full"
      />
      {showSuggestions && (value.trim() || suggestions.length > 0) && (
        <div className="absolute z-50 w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200">
          <ScrollArea className="h-[200px]">
            {isLoading ? (
              <div className="p-2 text-sm text-gray-500">Loading...</div>
            ) : suggestions.length > 0 ? (
              <ul>
                {suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    <div className="font-medium">{suggestion.name}</div>
                    <div className="text-xs text-gray-500">
                      {suggestion.calories} cal | P: {suggestion.protein}g | C: {suggestion.carbs}g | F: {suggestion.fat}g
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-2 text-sm text-gray-500">No suggestions found</div>
            )}
          </ScrollArea>
        </div>
      )}
    </div>
  );
} 