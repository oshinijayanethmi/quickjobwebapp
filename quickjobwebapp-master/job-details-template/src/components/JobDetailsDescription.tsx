import React from 'react';

interface JobDetailsDescriptionProps {
  description: string;
}

const JobDetailsDescription: React.FC<JobDetailsDescriptionProps> = ({ description }) => {
  return (
    <div className="mt-4 p-4 bg-black/40 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-white">Job Description</h2>
      <p className="mt-2 text-gray-300">{description}</p>
    </div>
  );
};

export default JobDetailsDescription;