"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaGooglePlay, FaArrowLeft } from "react-icons/fa";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function MobileApp() {
  const router = useRouter();
  const [displayText, setDisplayText] = useState("");
  const fullText =
    "QuickJob mobile app is a modern, user-friendly solution for Employees to find jobs and for customers to hire skilled workers instantly. With Quick Find, customers can easily locate experienced Employees, contact them, and get directions to service locations. Enjoy seamless hiring and discover all our features by downloading the app!";

  // Typing animation for paragraph
  useEffect(() => {
    let index = 0;
    let direction = 1; // 1 for typing, -1 for deleting
    setDisplayText(""); // Reset on mount
    const interval = setInterval(() => {
      if (direction === 1) {
        setDisplayText((prev) => prev + fullText[index]);
        index++;
        if (index === fullText.length) {
          direction = -1;
          setTimeout(() => {}, 5000); // Pause before deleting
        }
      } else {
        setDisplayText((prev) => prev.slice(0, -1));
        index--;
        if (index === 0) {
          direction = 1;
        }
      }
    }, 40); // Typing speed
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="min-h-screen w-screen flex items-center justify-center relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, rgba(40,0,60,0.95) 0%, rgba(128,90,213,0.7) 100%)",
        height: "100vh",
      }}
    >
      {/* Animated blurred purple/black circles for modern effect */}
      <motion.div
        className="absolute top-0 left-0 w-80 h-80 rounded-full bg-purple-900/40 blur-3xl z-0"
        initial={{ scale: 0.8, opacity: 0.5 }}
        animate={{ scale: [0.8, 1.1, 0.9], opacity: [0.5, 0.7, 0.5] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-56 h-56 rounded-full bg-black/40 blur-2xl z-0"
        initial={{ scale: 0.7, opacity: 0.4 }}
        animate={{ scale: [0.7, 1.05, 0.8], opacity: [0.4, 0.6, 0.4] }}
        transition={{ duration: 7, repeat: Infinity }}
      />

      {/* Card Container - Centered, fixed size, no scroll */}
      <motion.div
        className="relative z-10 bg-gradient-to-br from-black/70 via-purple-900/60 to-black/80 rounded-3xl shadow-2xl border border-purple-700/30 p-10 flex flex-col items-center justify-center"
        style={{
          width: "920px", // Increased width
          height: "700px", // Increased height
          minWidth: "740px",
          minHeight: "600px",
          maxWidth: "125vw",
          maxHeight: "95vh",
        }}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        {/* Back Button */}
        <button
          onClick={() => router.push("/")}
          className="absolute top-6 left-6 flex items-center gap-2 text-purple-200 hover:text-purple-400 bg-black/30 px-4 py-2 rounded-xl shadow-lg z-10 transition"
        >
          <FaArrowLeft /> <span className="font-medium">Back</span>
        </button>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-700 drop-shadow-lg">
          QuickJob Mobile App
        </h1>

        {/* Smartphone with Logo */}
        <div className="relative w-32 h-64 flex items-center justify-center mb-4">
          <motion.div
            className="relative w-28 h-56 bg-gradient-to-br from-purple-900/80 via-black/80 to-purple-700/80 rounded-2xl shadow-2xl flex items-center justify-center border-4 border-purple-700/40"
            animate={{ scale: [1, 1.07, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Image
              src="/logo.png"
              alt="QuickJob Logo"
              width={72}
              height={72}
              className="w-18 h-18 drop-shadow-xl"
              priority
            />
          </motion.div>
          {/* Glow effect */}
          <motion.div
            className="absolute inset-0 rounded-2xl bg-purple-700/30 blur-2xl"
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </div>

        {/* Typing Paragraph */}
        <motion.p
          className="max-w-2xl text-center text-lg md:text-xl leading-relaxed mb-6 text-purple-100 bg-black/30 rounded-xl p-6 shadow-inner min-h-[180px]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          {displayText}
        </motion.p>

        {/* Download Now */}
        <motion.a
          href="#"
          whileHover={{ scale: 1.08, backgroundColor: "#7c3aed" }}
          className="flex items-center gap-3 bg-gradient-to-r from-purple-700/80 to-black/80 px-6 py-3 rounded-full shadow-lg hover:bg-purple-800/90 transition-all text-white font-semibold text-base"
        >
          <FaGooglePlay size={24} className="text-green-400" />
          <span>Download Now</span>
        </motion.a>

        {/* Footer */}
        <footer className="absolute bottom-4 left-0 w-full text-center text-xs text-purple-200/80 z-10">
          <span>
            &copy; {new Date().getFullYear()} QuickJob Mobile App. All rights
            reserved.
          </span>
        </footer>
      </motion.div>
    </div>
  );
}
