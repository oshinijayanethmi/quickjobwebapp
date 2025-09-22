import React from 'react';

interface JobDetailsHeaderProps {
  title: string;
  location: string;
  supplier: string;
  category: string[];
  createdAt: Date;
}

const JobDetailsHeader: React.FC<JobDetailsHeaderProps> = ({ title, location, supplier, category, createdAt }) => {
  return (
    <div className="bg-black/50 p-4 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-white">{title}</h1>
      <p className="text-sm text-gray-300">📍 {location}</p>
      <p className="text-sm text-blue-300">🏢 {supplier}</p>
      <div className="flex flex-wrap gap-1 mb-2">
        {category.map((cat, index) => (
          <span key={index} className="inline-block bg-purple-700/30 text-purple-200 text-xs px-2 py-1 rounded-full font-medium">
            {cat}
          </span>
        ))}
      </div>
      <p className="text-sm text-gray-400">📅 {createdAt.toLocaleDateString()}</p>
    </div>
  );
};

export default JobDetailsHeader;