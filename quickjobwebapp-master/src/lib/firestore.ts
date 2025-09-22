import { doc, getDoc, addDoc, collection, getFirestore, Timestamp, query, where, getDocs, deleteDoc } from "firebase/firestore";
import app from "@/lib/firebaseConfig";

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
  id: string;
  name: string;
  address: string;
  jobCategory: string;
  contactNumber: string;
  jobTitle: string;
  publisherEmail: string;
  appliedAt: Timestamp;
}

// Fetch job posts by publisher email
export const getJobPostsByPublisher = async (publisherEmail: string): Promise<JobPost[]> => {
  try {
    const q = query(
      collection(firestore, "jobposts"),
      where("publisherEmail", "==", publisherEmail)
    );
    
    const querySnapshot = await getDocs(q);
    const posts: JobPost[] = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as JobPost));
    
    return posts.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());
  } catch (error) {
    console.error("Error fetching job posts:", error);
    return [];
  }
};

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

// Delete job post
export const deleteJobPost = async (jobId: string): Promise<boolean> => {
  try {
    await deleteDoc(doc(firestore, "jobposts", jobId));
    console.log("Job post deleted successfully");
    return true;
  } catch (error) {
    console.error("Error deleting job post:", error);
    return false;
  }
};

// Fetch applicants by job title and publisher email
export const getApplicantsByJob = async (jobTitle: string, publisherEmail: string): Promise<Applicant[]> => {
  try {
    const q = query(
      collection(firestore, "applicant"),
      where("jobTitle", "==", jobTitle),
      where("publisherEmail", "==", publisherEmail)
    );
    
    const querySnapshot = await getDocs(q);
    const applicants: Applicant[] = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Applicant));
    
    return applicants.sort((a, b) => b.appliedAt.toMillis() - a.appliedAt.toMillis());
  } catch (error) {
    console.error("Error fetching applicants:", error);
    return [];
  }
};

// Submit job application
export const submitApplication = async (applicationData: Omit<Applicant, 'appliedAt' | 'id'>): Promise<boolean> => {
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