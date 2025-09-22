import React, { useState } from 'react';
import ApplyJobModal from './ApplyJobModal';
import ContactModal from './ContactModal';

interface JobDetailsActionsProps {
  email: string;
  phone: string;
  jobTitle?: string;
  publisherEmail?: string;
}

const JobDetailsActions: React.FC<JobDetailsActionsProps> = ({ email, phone, jobTitle = "", publisherEmail = "" }) => {
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const handleApplyNowClick = () => {
    setIsApplyModalOpen(true);
  };

  const handleContactClick = () => {
    setIsContactModalOpen(true);
  };

  const closeApplyModal = () => {
    setIsApplyModalOpen(false);
  };

  const closeContactModal = () => {
    setIsContactModalOpen(false);
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex space-x-4">
        <button
          onClick={handleContactClick}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Show Contact
        </button>
        <button
          onClick={handleApplyNowClick}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Apply Now
        </button>
      </div>

      <ContactModal 
        isOpen={isContactModalOpen} 
        onClose={closeContactModal} 
        email={email} 
        phone={phone} 
      />
      <ApplyJobModal 
        isOpen={isApplyModalOpen} 
        onClose={closeApplyModal} 
        jobCategory="" // Pass the job category here as needed
        jobTitle={jobTitle}
        publisherEmail={publisherEmail}
      />
    </div>
  );
};

export default JobDetailsActions;