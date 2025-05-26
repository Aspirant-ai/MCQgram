
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Download, Search, BookOpenCheck, Filter as FilterIcon } from 'lucide-react';
import { examCategories } from '@/lib/data/examData'; // Assuming examCategories are available

const mockMaterials = [
  { id: "sm1", name: "SSC CGL Previous Year Paper 2023 (Tier 1)", category: "ssc", type: "PYQP", year: 2023, fileUrl: "/placeholder.pdf" },
  { id: "sm2", name: "IBPS PO Mains Quant Formulas Sheet", category: "bank", type: "Notes", year: 2024, fileUrl: "/placeholder.pdf" },
  { id: "sm3", name: "RRB NTPC General Awareness Capsule", category: "railway", type: "Capsule", year: 2024, fileUrl: "/placeholder.pdf" },
  { id: "sm4", name: "SSC CHSL English Vocabulary PDF", category: "ssc", type: "Notes", year: 2023, fileUrl: "/placeholder.pdf" },
  { id: "sm5", name: "Banking Awareness Handbook", category: "bank", type: "Notes", year: 2024, fileUrl: "/placeholder.pdf" },
];

const StudyMaterialPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const materialTypes = ["All Types", "PYQP", "Notes", "Capsule", "eBook"];

  const filteredMaterials = mockMaterials.filter(material => {
    const matchesSearch = material.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || material.category === categoryFilter;
    const matchesType = typeFilter === 'all' || typeFilter === 'All Types' || material.type === typeFilter;
    return matchesSearch && matchesCategory && matchesType;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto max-w-5xl"
      >
        <div className="text-center mb-12">
          <BookOpenCheck className="h-16 w-16 text-primary mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-800 mb-3">Study Material</h1>
          <p className="text-lg text-gray-600">Access previous year question papers, notes, and other helpful resources.</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md mb-8 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="relative">
              <label htmlFor="search-material" className="text-sm font-medium text-gray-700 block mb-1">Search Material</label>
              <Search className="absolute left-3 top-9 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                id="search-material"
                type="text" 
                placeholder="e.g., SSC CGL 2023 Paper" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div>
              <label htmlFor="category-filter" className="text-sm font-medium text-gray-700 block mb-1">Category</label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger id="category-filter">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {examCategories.map(cat => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label htmlFor="type-filter" className="text-sm font-medium text-gray-700 block mb-1">Material Type</label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger id="type-filter">
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  {materialTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {filteredMaterials.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMaterials.map((material) => (
              <motion.div
                key={material.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow flex flex-col"
              >
                <FileText className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-md font-semibold text-gray-800 mb-2 flex-grow">{material.name}</h3>
                <div className="text-xs text-gray-500 mb-3">
                  <span>{examCategories.find(c=>c.id === material.category)?.name || material.category}</span> &bull; <span>{material.type}</span> &bull; <span>{material.year}</span>
                </div>
                <div className="flex space-x-2 mt-auto">
                  <Button variant="outline" size="sm" asChild className="flex-1">
                    <a href={material.fileUrl} target="_blank" rel="noopener noreferrer">
                      View PDF
                    </a>
                  </Button>
                  <Button size="sm" asChild className="flex-1">
                    <a href={material.fileUrl} download={`${material.name}.pdf`}>
                      <Download className="mr-1.5 h-4 w-4" /> Download
                    </a>
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FilterIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg text-gray-600">No study materials found matching your criteria.</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default StudyMaterialPage;
