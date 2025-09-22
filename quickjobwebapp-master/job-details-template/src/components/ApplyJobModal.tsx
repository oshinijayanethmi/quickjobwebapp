import React, { useState } from 'react';
import { db } from '@/lib/firebaseConfig'; // Adjust the import based on your firebase config file
import { collection, addDoc } from 'firebase/firestore';

interface ApplyJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobTitle: string;
  jobCategory: string;
  publisherEmail: string;
}

const ApplyJobModal: React.FC<ApplyJobModalProps> = ({ isOpen, onClose, jobTitle, jobCategory, publisherEmail }) => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, 'applicant'), {
        name,
        address,
        jobTitle,
        jobCategory,
        contactNumber,
        publisherEmail,
        createdAt: new Date(),
      });
      alert('Application submitted successfully!');
      onClose();
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-bold mb-4">Apply for {jobTitle}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="border border-gray-300 rounded px-3 py-2 w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              className="border border-gray-300 rounded px-3 py-2 w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Job Category</label>
            <input
              type="text"
              value={jobCategory}
              readOnly
              className="border border-gray-300 rounded px-3 py-2 w-full bg-gray-100"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Contact Number</label>
            <input
              type="text"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              required
              className="border border-gray-300 rounded px-3 py-2 w-full"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            {loading ? 'Submitting...' : 'Apply Now'}
          </button>
        </form>
        <button
          onClick={onClose}
          className="mt-4 text-gray-500 hover:text-gray-700"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ApplyJobModal;