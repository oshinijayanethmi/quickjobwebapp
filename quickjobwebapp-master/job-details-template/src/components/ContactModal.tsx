import React from 'react';
import { motion } from 'framer-motion';

interface ContactModalProps {
  isOpen: boolean;
  email: string;
  phone: string;
  onClose: () => void;
}

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, email, phone, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-6 rounded-lg shadow-lg text-black"
      >
        <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
        <p className="mb-2"><strong>Email:</strong> {email}</p>
        <p className="mb-4"><strong>Phone:</strong> {phone}</p>
        <button
          onClick={onClose}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
        >
          Close
        </button>
      </motion.div>
    </div>
  );
};

export default ContactModal;