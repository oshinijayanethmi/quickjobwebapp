"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, ChevronDown, Phone, Navigation } from "lucide-react";
import { collection, getFirestore, getDocs, query, where, updateDoc } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { useRouter } from "next/navigation";

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

interface SkillData {
  skill: string;
  experience: string;
}

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  skills: SkillData[];
  district: string;
  city: string;
  contactNumber: string;
  serviceLocation: string;
  rating?: number;
  ratedCount?: number;
}

interface MapData {
  id: string;
  districtName: string;
  cities: string[];
}

export default function QuickFind() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("All");
  const [selectedCity, setSelectedCity] = useState<string>("All");
  const [isDropdownOpen, setIsDropdownOpen] = useState<string>(""); // Track which dropdown is open
  const [loading, setLoading] = useState<boolean>(true);
  const [showHireModal, setShowHireModal] = useState<boolean>(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  const [jobCategories, setJobCategories] = useState<string[]>(["All"]);
  const [districts, setDistricts] = useState<MapData[]>([]);
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const router = useRouter();

  const [lastCalledEmployee, setLastCalledEmployee] = useState<{ id: string; contactNumber: string } | null>(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [ratingValue, setRatingValue] = useState<number>(0);
  const [reviewerEmail, setReviewerEmail] = useState("");
  const [ratingError, setRatingError] = useState("");
  const [submittingRating, setSubmittingRating] = useState(false);

  // Fetch job categories from Firestore
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, "jobcategory"));
        const categories: string[] = ["All"];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.name) {
            categories.push(data.name);
          }
        });
        setJobCategories(categories);
      } catch (error) {
        console.error("Error fetching job categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Fetch districts from map collection
  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, "map"));
        const districtData: MapData[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.districtName) {
            districtData.push({
              id: doc.id,
              districtName: data.districtName,
              cities: data.cities || []
            });
          }
        });
        setDistricts(districtData);
      } catch (error) {
        console.error("Error fetching districts:", error);
      }
    };

    fetchDistricts();
  }, []);

  // Update available cities when district is selected
  useEffect(() => {
    if (selectedDistrict === "All") {
      setAvailableCities([]);
      setSelectedCity("All");
    } else {
      const selectedDistrictData = districts.find(d => d.districtName === selectedDistrict);
      if (selectedDistrictData) {
        setAvailableCities(selectedDistrictData.cities);
        setSelectedCity("All"); // Reset city selection when district changes
      }
    }
  }, [selectedDistrict, districts]);

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  }, []);

  // Fetch employees from Firestore
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const employeeQuery = query(
          collection(firestore, "userlog"),
          where("accountType", "==", "Employee")
        );
        const querySnapshot = await getDocs(employeeQuery);

        const employeeData: Employee[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();

          const skillsArray = data.skills || [];
          const skills: SkillData[] = skillsArray.map((skillItem: SkillData) => ({
            skill: skillItem.skill || "N/A",
            experience: skillItem.experience || "N/A"
          }));

          employeeData.push({
            id: doc.id,
            firstName: data.firstName || "N/A",
            lastName: data.lastName || "N/A",
            skills: skills,
            district: data.district || "N/A",
            city: data.city || "N/A",
            contactNumber: data.contactNumber || "N/A",
            serviceLocation: data.serviceLocation || "",
            rating: data.rating,
            ratedCount: data.ratedCount
          });
        });

        setEmployees(employeeData);
        setFilteredEmployees(employeeData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching employees:", error);
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  // Filter employees
  useEffect(() => {
    let filtered = employees;

    if (selectedCategory !== "All") {
      filtered = filtered.filter(employee =>
        employee.skills.some(skillData =>
          skillData.skill.toLowerCase().includes(selectedCategory.toLowerCase())
        )
      );
    }

    if (selectedDistrict !== "All") {
      filtered = filtered.filter(employee =>
        employee.district.toLowerCase() === selectedDistrict.toLowerCase()
      );
    }

    if (selectedCity !== "All") {
      filtered = filtered.filter(employee =>
        employee.city.toLowerCase() === selectedCity.toLowerCase()
      );
    }

    if (searchTerm) {
      filtered = filtered.filter(employee =>
        employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.skills.some(skillData =>
          skillData.skill.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        employee.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.city.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredEmployees(filtered);
  }, [searchTerm, selectedCategory, selectedDistrict, selectedCity, employees]);

  const handleExit = () => {
    if (lastCalledEmployee) {
      setShowRatingModal(true);
    } else {
      router.push('/');
    }
  };

  const handleHireNow = (employee: Employee) => {
    setSelectedEmployee(employee);
    setShowHireModal(true);
  };

  const handleGetDirections = (employee: Employee) => {
    if (!employee.serviceLocation) {
      alert("Service location not available for this employee.");
      return;
    }

    let googleMapsUrl = "";

    if (userLocation) {
      googleMapsUrl = `https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${employee.serviceLocation}`;
    } else {
      googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${employee.serviceLocation}`;
    }

    window.open(googleMapsUrl, '_blank');
  };

  const closeModal = () => {
    setShowHireModal(false);
    setSelectedEmployee(null);
  };

  const toggleDropdown = (dropdownName: string) => {
    setIsDropdownOpen(isDropdownOpen === dropdownName ? "" : dropdownName);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-black via-purple-900 to-black text-white">
      {/* Header */}
      <div className="flex justify-between items-center p-6 bg-black/30 backdrop-blur-md relative z-10">
        <h1 className="text-2xl font-bold text-purple-400">Quick Find</h1>
        <button
          onClick={handleExit}
          className="flex items-center space-x-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-xl border border-red-400/30 transition-all duration-300 hover:scale-105"
        >
          <X className="h-5 w-5" />
          <span>Exit</span>
        </button>
      </div>

      {/* Search + Filter Section - Fixed positioning and higher z-index */}
      <div className="sticky top-0 p-6 bg-black/20 backdrop-blur-md relative z-50 border-b border-white/10">
        <div className="max-w-4xl mx-auto space-y-4">

          {/* Filter Dropdowns Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Category Dropdown */}
            <div className="relative z-50">
              <button
                onClick={() => toggleDropdown("category")}
                className="w-full flex items-center justify-between px-4 py-3 bg-black/70 backdrop-blur-lg border border-white/20 rounded-xl text-white hover:border-purple-400/50 transition-all duration-300 shadow-lg"
              >
                <span className="truncate">Category: {selectedCategory}</span>
                <ChevronDown className={`h-5 w-5 transition-transform duration-300 ${isDropdownOpen === "category" ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isDropdownOpen === "category" && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-black/95 backdrop-blur-xl border border-white/30 rounded-xl shadow-2xl z-[60] max-h-60 overflow-y-auto"
                  >
                    {jobCategories.map((category) => (
                      <button
                        key={category}
                        onClick={() => {
                          setSelectedCategory(category);
                          setIsDropdownOpen("");
                        }}
                        className={`w-full text-left px-4 py-3 text-white hover:bg-white/20 transition-all duration-200 first:rounded-t-xl last:rounded-b-xl ${
                          selectedCategory === category ? "bg-purple-600/50" : ""
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* District Dropdown */}
            <div className="relative z-50">
              <button
                onClick={() => toggleDropdown("district")}
                className="w-full flex items-center justify-between px-4 py-3 bg-black/70 backdrop-blur-lg border border-white/20 rounded-xl text-white hover:border-purple-400/50 transition-all duration-300 shadow-lg"
              >
                <span className="truncate">District: {selectedDistrict}</span>
                <ChevronDown className={`h-5 w-5 transition-transform duration-300 ${isDropdownOpen === "district" ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isDropdownOpen === "district" && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-black/95 backdrop-blur-xl border border-white/30 rounded-xl shadow-2xl z-[60] max-h-60 overflow-y-auto"
                  >
                    <button
                      onClick={() => {
                        setSelectedDistrict("All");
                        setIsDropdownOpen("");
                      }}
                      className={`w-full text-left px-4 py-3 text-white hover:bg-white/20 transition-all duration-200 rounded-t-xl border-b border-white/10 ${
                        selectedDistrict === "All" ? "bg-purple-600/50" : ""
                      }`}
                    >
                      All Districts
                    </button>
                    {districts.map((district) => (
                      <button
                        key={district.id}
                        onClick={() => {
                          setSelectedDistrict(district.districtName);
                          setIsDropdownOpen("");
                        }}
                        className={`w-full text-left px-4 py-3 text-white hover:bg-white/20 transition-all duration-200 border-b border-white/10 last:rounded-b-xl last:border-b-0 ${
                          selectedDistrict === district.districtName ? "bg-purple-600/50" : ""
                        }`}
                      >
                        {district.districtName}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* City Dropdown */}
            <div className="relative z-50">
              <button
                onClick={() => toggleDropdown("city")}
                disabled={selectedDistrict === "All"}
                className="w-full flex items-center justify-between px-4 py-3 bg-black/70 backdrop-blur-lg border border-white/20 rounded-xl text-white hover:border-purple-400/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                <span className="truncate">
                  {selectedDistrict === "All" ? "Select District First" : `City: ${selectedCity}`}
                </span>
                <ChevronDown className={`h-5 w-5 transition-transform duration-300 ${isDropdownOpen === "city" ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isDropdownOpen === "city" && selectedDistrict !== "All" && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-black/95 backdrop-blur-xl border border-white/30 rounded-xl shadow-2xl z-[60] max-h-60 overflow-y-auto"
                  >
                    <button
                      onClick={() => {
                        setSelectedCity("All");
                        setIsDropdownOpen("");
                      }}
                      className={`w-full text-left px-4 py-3 text-white hover:bg-white/20 transition-all duration-200 rounded-t-xl border-b border-white/10 ${
                        selectedCity === "All" ? "bg-purple-600/50" : ""
                      }`}
                    >
                      All Cities in {selectedDistrict}
                    </button>
                    {availableCities.map((city) => (
                      <button
                        key={city}
                        onClick={() => {
                          setSelectedCity(city);
                          setIsDropdownOpen("");
                        }}
                        className={`w-full text-left px-4 py-3 text-white hover:bg-white/20 transition-all duration-200 border-b border-white/10 last:rounded-b-xl last:border-b-0 ${
                          selectedCity === city ? "bg-purple-600/50" : ""
                        }`}
                      >
                        {city}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
            <input
              type="text"
              placeholder="Search by name, skill, district, or city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-black/70 backdrop-blur-lg border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400/50 transition-all duration-300 shadow-lg"
            />
          </div>
        </div>
      </div>

      {/* Click outside to close dropdown - Higher z-index */}
      {isDropdownOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsDropdownOpen("")}
        />
      )}

      {/* Results Section - Lower z-index to stay behind filter panel */}
      <div className="p-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="text-center py-12">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="inline-block"
              >
                <Search className="h-8 w-8 text-purple-400" />
              </motion.div>
              <p className="mt-4 text-gray-300">Loading employees...</p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <p className="text-gray-300">
                  Found {filteredEmployees.length} employee{filteredEmployees.length !== 1 ? 's' : ''}
                  {selectedCategory !== "All" && ` in ${selectedCategory}`}
                  {selectedDistrict !== "All" && ` in ${selectedDistrict}`}
                  {selectedCity !== "All" && `, ${selectedCity}`}
                  {searchTerm && ` matching "${searchTerm}"`}
                </p>
              </div>

              <div className="space-y-4">
                {filteredEmployees.length > 0 ? (
                  filteredEmployees.map((employee, index) => (
                    <motion.div
                      key={employee.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="bg-black/50 backdrop-blur-lg p-6 rounded-2xl border border-white/20 hover:border-purple-400/50 transition-all duration-300 relative z-0"
                    >
                      {/* Employee Info Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <h3 className="text-sm font-medium text-gray-400 mb-1">First Name</h3>
                          <p className="text-white font-medium">{employee.firstName}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-400 mb-1">Last Name</h3>
                          <p className="text-white font-medium">{employee.lastName}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-400 mb-1">District</h3>
                          <p className="text-green-300 font-medium">{employee.district}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-400 mb-1">City</h3>
                          <p className="text-green-300 font-medium">{employee.city}</p>
                        </div>
                      </div>

                      {/* Skills Section */}
                      <div className="mb-6">
                        <h3 className="text-sm font-medium text-gray-400 mb-3">Skills & Experience</h3>
                        {employee.skills.length > 0 ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {employee.skills.map((skillData, skillIndex) => (
                              <div
                                key={skillIndex}
                                className="bg-black/30 p-3 rounded-lg border border-white/10"
                              >
                                <div className="mb-2">
                                  <span className="text-xs text-gray-400">Skill:</span>
                                  <p className="text-purple-300 font-medium">{skillData.skill}</p>
                                </div>
                                <div>
                                  <span className="text-xs text-gray-400">Experience:</span>
                                  <p className="text-blue-300 font-medium">{skillData.experience}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500 italic">No skills listed</p>
                        )}
                      </div>

                      {/* Rating Section */}
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-yellow-400 text-lg">
                          ★
                        </span>
                        <span className="text-white font-medium">
                          {employee.ratedCount && employee.ratedCount > 0
                            ? (employee.rating! / employee.ratedCount!).toFixed(1)
                            : "No rating"}
                        </span>
                        <span className="text-gray-400 text-xs">
                          {employee.ratedCount && employee.ratedCount > 0 ? `(${employee.ratedCount} ratings)` : ""}
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-3">
                        <button
                          onClick={() => handleHireNow(employee)}
                          className="flex items-center space-x-2 px-4 py-2 bg-green-600/20 hover:bg-green-600/30 rounded-xl border border-green-400/30 transition-all duration-300 hover:scale-105"
                        >
                          <Phone className="h-4 w-4" />
                          <span>Hire Now</span>
                        </button>
                        
                        <button
                          onClick={() => handleGetDirections(employee)}
                          className="flex items-center space-x-2 px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 rounded-xl border border-blue-400/30 transition-all duration-300 hover:scale-105"
                          disabled={!employee.serviceLocation}
                        >
                          <Navigation className="h-4 w-4" />
                          <span>Get Directions</span>
                        </button>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Search className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 text-lg">No employees found matching your criteria</p>
                    <p className="text-gray-500 text-sm mt-2">Try adjusting your search or filter settings</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Hire Now Modal - Highest z-index */}
      <AnimatePresence>
        {showHireModal && selectedEmployee && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[200] p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              className="bg-black/80 backdrop-blur-xl border border-white/20 rounded-2xl p-6 max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-purple-400">Contact Employee</h3>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-white/10 rounded-xl transition-all duration-200"
                >
                  <X className="h-5 w-5 text-gray-400" />
                </button>
              </div>

              {/* Employee Info */}
              <div className="space-y-4">
                <div className="bg-black/30 p-4 rounded-xl border border-white/10">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="bg-purple-600/20 p-2 rounded-lg">
                      <Phone className="h-5 w-5 text-purple-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-white">{selectedEmployee.firstName}</h4>
                      <p className="text-sm text-gray-400">Professional Service Provider</p>
                    </div>
                  </div>
                  
                  <div className="border-t border-white/10 pt-3">
                    <p className="text-sm text-gray-400 mb-1">Contact Number:</p>
                    <p className="text-green-400 font-mono text-lg">{selectedEmployee.contactNumber}</p>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-sm text-gray-400">
                    Call or message {selectedEmployee.firstName} to discuss your requirements
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-6">
                <a
                  href={`tel:${selectedEmployee.contactNumber}`}
                  onClick={() => setLastCalledEmployee({ id: selectedEmployee.id, contactNumber: selectedEmployee.contactNumber })}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 hover:bg-green-700 rounded-xl text-white font-medium transition-all duration-300"
                >
                  <Phone className="h-5 w-5" />
                  <span>Call Now</span>
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rating Modal - Highest z-index */}
      <AnimatePresence>
        {showRatingModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[300] p-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-gray-900 p-8 rounded-2xl max-w-md w-full border border-purple-600/30"
            >
              <h3 className="text-xl font-bold mb-4 text-white text-center">Rate Your Experience</h3>
              <div className="flex justify-center mb-4">
                {[1,2,3,4,5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRatingValue(star)}
                    className={`mx-1 text-3xl ${star <= ratingValue ? "text-yellow-400" : "text-gray-500"}`}
                    aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                  >★</button>
                ))}
              </div>
              <input
                type="email"
                placeholder="Enter your Gmail address"
                value={reviewerEmail}
                onChange={e => setReviewerEmail(e.target.value)}
                className="w-full p-3 rounded-lg bg-black/40 border border-gray-600 text-white mb-3"
                disabled={submittingRating}
              />
              <button
                onClick={async () => {
                  setRatingError("");
                  if (ratingValue < 1 || ratingValue > 5) {
                    setRatingError("Please select a rating (1-5 stars).");
                    return;
                  }
                  if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(reviewerEmail)) {
                    setRatingError("Please enter a valid Gmail address.");
                    return;
                  }
                  setSubmittingRating(true);
                  try {
                    // Get current rating and ratedCount
                    const userRef = collection(firestore, "userlog");
                    const employeeDoc = (await getDocs(query(userRef, where("contactNumber", "==", lastCalledEmployee!.contactNumber)))).docs[0];
                    const rating = employeeDoc?.data().rating || 0;
                    const ratedCount = employeeDoc?.data().ratedCount || 0;

                    // Update rating and ratedCount
                    const newRating = rating + ratingValue;
                    const newRatedCount = ratedCount + 1;
                    await updateDoc(employeeDoc.ref, { rating: newRating, ratedCount: newRatedCount });

                    // Save to ratings collection
                    await getDocs(collection(firestore, "ratings")); // Ensure collection exists
                    await import("firebase/firestore").then(async ({ addDoc, collection }) => {
                      await addDoc(collection(firestore, "ratings"), {
                        employeeId: lastCalledEmployee!.id,
                        contactNumber: lastCalledEmployee!.contactNumber,
                        rating: ratingValue,
                        reviewerEmail,
                        createdAt: new Date()
                      });
                    });

                    setShowRatingModal(false);
                    setLastCalledEmployee(null);
                    setRatingValue(0);
                    setReviewerEmail("");
                    setRatingError("");
                    router.push('/');
                  } catch {
                    setRatingError("Failed to submit rating. Try again.");
                  } finally {
                    setSubmittingRating(false);
                  }
                }}
                className="w-full bg-purple-600 hover:bg-purple-700 py-3 rounded-lg transition font-medium text-white mb-2"
                disabled={submittingRating}
              >
                {submittingRating ? "Submitting..." : "Submit Rating"}
              </button>
              <button
                onClick={() => {
                  setShowRatingModal(false);
                  setLastCalledEmployee(null);
                  setRatingValue(0);
                  setReviewerEmail("");
                  setRatingError("");
                  router.push('/');
                }}
                className="w-full bg-gray-700 hover:bg-gray-800 py-2 rounded-lg transition font-medium text-white"
                disabled={submittingRating}
              >
                Skip
              </button>
              {ratingError && <p className="text-red-400 text-center mt-2">{ratingError}</p>}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
