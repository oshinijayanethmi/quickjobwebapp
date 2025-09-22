import { getFirestore, collection, addDoc } from "firebase/firestore";
import { auth } from "@/lib/firebaseConfig";

// Initialize Firestore
const firestore = getFirestore();

// Function to save applicant data to Firestore
export const saveApplicant = async (jobTitle: string, publisherEmail: string, applicantData: { name: string; address: string; contactNumber: string }) => {
  try {
    const applicantRef = collection(firestore, "applicant");
    await addDoc(applicantRef, {
      jobTitle,
      publisherEmail,
      ...applicantData,
      createdAt: new Date(),
    });
    console.log("Applicant data saved successfully.");
  } catch (error) {
    console.error("Error saving applicant data:", error);
  }
};