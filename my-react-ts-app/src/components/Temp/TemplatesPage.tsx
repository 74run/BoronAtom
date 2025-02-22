import React, { useState } from 'react';
import { Navbar } from '../ui/navbar';
import { Button } from '../ui/button';
import { Search, Filter, Star, Download } from 'lucide-react';
import temp1 from './temp-1.png'



export interface Template {
  id: string;
  name: string;
  category: string;
  thumbnail: string;
  isPremium: boolean;
  rating: number;
  downloads: number;
}

const templates: Template[] = [
  {
    id: '1',
    name: 'Professional Modern',
    category: 'Professional',
    thumbnail: '/templates/professional-modern.png',
    isPremium: false,
    rating: 4.8,
    downloads: 12500
  },
  {
    id: '2',
    name: 'Creative Design',
    category: 'Creative',
    thumbnail: '/templates/creative-design.png',
    isPremium: true,
    rating: 4.9,
    downloads: 8300
  },
  {
    id: '3',
    name: 'Executive Clean',
    category: 'Professional',
    thumbnail: '/templates/executive-clean.png',
    isPremium: true,
    rating: 4.7,
    downloads: 15200
  },
  // Add more templates as needed
];

const categories = [
  'All',
  'Professional',
  'Creative',
  'Modern',
  'Simple',
  'Academic',
  'Technical'
];

const TemplatesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showPremiumOnly, setShowPremiumOnly] = useState(false);

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory;
    const matchesPremium = !showPremiumOnly || template.isPremium;
    return matchesSearch && matchesCategory && matchesPremium;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Professional Resume Templates
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Choose from our collection of professional templates designed to make your resume stand out
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-800/50 border border-gray-700 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Premium Filter */}
            <div className="flex items-center">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={showPremiumOnly}
                  onChange={(e) => setShowPremiumOnly(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="relative w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                <span className="ms-3 text-sm font-medium text-gray-300">Premium Only</span>
              </label>
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category)}
                className="text-sm"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="bg-gray-800/50 rounded-lg overflow-hidden border border-gray-700 hover:border-gray-600 transition-all duration-300"
            >
              {/* Template Preview */}
              <div className="relative aspect-[3/4] group">
                <img
                  src={temp1} 
                  alt={template.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="space-y-3">
                    <Button className="w-40">Use Template</Button>
                    <Button variant="outline" className="w-40">Preview</Button>
                  </div>
                </div>
                {template.isPremium && (
                  <div className="absolute top-4 right-4 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded">
                    PREMIUM
                  </div>
                )}
              </div>

              {/* Template Info */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-white">{template.name}</h3>
                  <div className="flex items-center text-gray-400 text-sm">
                    <Star className="w-4 h-4 text-yellow-500 mr-1" />
                    {template.rating}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">{template.category}</span>
                  <div className="flex items-center text-gray-400 text-sm">
                    <Download className="w-4 h-4 mr-1" />
                    {template.downloads.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">
              No templates found matching your criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplatesPage; 