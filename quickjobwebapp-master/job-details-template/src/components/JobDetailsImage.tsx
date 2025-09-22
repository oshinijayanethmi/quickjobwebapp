import React from 'react';

interface JobDetailsImageProps {
  imageUrl: string | null;
}

const JobDetailsImage: React.FC<JobDetailsImageProps> = ({ imageUrl }) => {
  return (
    <div className="w-full h-60 bg-gray-700 flex items-center justify-center">
      {imageUrl ? (
        <img src={imageUrl} alt="Job" className="w-full h-full object-cover" />
      ) : (
        <span className="text-gray-400">No Image</span>
      )}
    </div>
  );
};

export default JobDetailsImage;