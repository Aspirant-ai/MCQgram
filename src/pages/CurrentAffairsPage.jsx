
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Rss, Calendar, Filter as FilterIcon, ArrowRight, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from 'react-router-dom';

const mockAffairs = [
  { 
    id: "ca1", 
    title: "Major International Summit Concludes with New Climate Accord", 
    date: "2025-05-22", 
    category: "International",
    summary: "World leaders gathered for a 3-day summit, resulting in a landmark agreement to curb carbon emissions and promote renewable energy.",
    tags: ["Climate Change", "Politics", "Global"]
  },
  { 
    id: "ca2", 
    title: "RBI Announces New Monetary Policy Updates", 
    date: "2025-05-21", 
    category: "National",
    summary: "The Reserve Bank of India has revised key interest rates to manage inflation and stimulate economic growth. Repo rate remains unchanged.",
    tags: ["Economy", "Banking", "India"]
  },
  { 
    id: "ca3", 
    title: "Breakthrough in AI Research: New Model Achieves Human-Level Text Generation", 
    date: "2025-05-20", 
    category: "Science & Tech",
    summary: "Researchers have unveiled a new AI language model capable of generating remarkably coherent and contextually relevant text, sparking discussions on its potential applications and ethical implications.",
    tags: ["Technology", "AI", "Research"]
  },
  { 
    id: "ca4", 
    title: "India Wins U19 Cricket World Cup", 
    date: "2025-05-19", 
    category: "Sports",
    summary: "The Indian U19 cricket team clinched the World Cup trophy in a thrilling final match against Australia, showcasing exceptional talent and teamwork.",
    tags: ["Sports", "Cricket", "India"]
  },
];

const affairCategories = ["All", "National", "International", "Economy", "Science & Tech", "Sports", "Miscellaneous"];

const CurrentAffairsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const filteredAffairs = mockAffairs.filter(affair => {
    const matchesSearch = affair.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          affair.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          affair.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === 'All' || affair.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto max-w-4xl"
      >
        <div className="text-center mb-12">
          <Rss className="h-16 w-16 text-primary mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-800 mb-3">Current Affairs</h1>
          <p className="text-lg text-gray-600">Stay updated with the latest national and international happenings.</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md mb-8 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
            <div className="relative">
              <label htmlFor="search-affairs" className="text-sm font-medium text-gray-700 block mb-1">Search News</label>
              <Search className="absolute left-3 top-9 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                id="search-affairs"
                type="text" 
                placeholder="e.g., Climate Summit, RBI Policy" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div>
              <label htmlFor="category-filter-ca" className="text-sm font-medium text-gray-700 block mb-1">Category</label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger id="category-filter-ca">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {affairCategories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        {filteredAffairs.length > 0 ? (
          <div className="space-y-6">
            {filteredAffairs.map((affair) => (
              <motion.div
                key={affair.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center text-xs text-primary mb-2">
                  <Calendar className="h-3.5 w-3.5 mr-1.5" /> 
                  <span>{new Date(affair.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  <span className="mx-1.5">&bull;</span>
                  <span>{affair.category}</span>
                </div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">{affair.title}</h2>
                <p className="text-sm text-gray-600 mb-3 leading-relaxed">{affair.summary}</p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {affair.tags.map(tag => (
                    <span key={tag} className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">{tag}</span>
                  ))}
                </div>
                <Link to={`/current-affairs/${affair.id}`} className="text-sm text-primary font-medium hover:underline flex items-center">
                  Read More <ArrowRight className="ml-1 h-3.5 w-3.5" />
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
           <div className="text-center py-12">
            <FilterIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg text-gray-600">No current affairs found matching your criteria.</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default CurrentAffairsPage;
