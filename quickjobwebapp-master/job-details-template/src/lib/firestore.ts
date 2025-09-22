import { doc, getDoc, addDoc, collection, getFirestore, Timestamp } from "firebase/firestore";
import { initializeApp } from "firebase/app";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCdtJBz4_PcbYgEsDM4ib3WBq-6mSdBxwA",
  authDomain: "quickjobwebapp.firebaseapp.com",
  projectId: "quickjobwebapp",
  storageBucket: "quickjobwebapp.appspot.com",
  messagingSenderId: "320266323421",
  appId: "1:320266323421:web:76dcf28a61f4100e5de234",
  measurementId: "G-3ZYK787XM5",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

// Define the JobPost interface
export interface JobPost {
  id: string;
  title: string;
  category: string[];
  supplier: string;
  description: string;
  phone: string;
  email: string;
  location: string;
  images: string[];
  imageCount: number;
  publisherEmail: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  status: string;
  views: number;
  applications: number;
}

// Define the Applicant interface
export interface Applicant {
  name: string;
  address: string;
  jobCategory: string;
  contactNumber: string;
  jobTitle: string;
  publisherEmail: string;
  appliedAt: Timestamp;
}

// Fetch job details by ID
export const getJobDetails = async (jobId: string): Promise<JobPost | null> => {
  try {
    const docRef = doc(firestore, "jobposts", jobId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as JobPost;
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching job details:", error);
    return null;
  }
};

// Submit job application
export const submitApplication = async (applicationData: Omit<Applicant, 'appliedAt'>): Promise<boolean> => {
  try {
    const docRef = await addDoc(collection(firestore, "applicant"), {
      ...applicationData,
      appliedAt: Timestamp.now()
    });
    
    console.log("Application submitted with ID:", docRef.id);
    return true;
  } catch (error) {
    console.error("Error submitting application:", error);
    return false;
  }
};