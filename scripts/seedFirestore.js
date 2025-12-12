const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc, deleteDoc, collection } = require('firebase/firestore');

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDD4V0vLy5PRoI6nSsHJEyN0Z3CdW0Gu_Q",
  authDomain: "ucpportalclone-b264a.firebaseapp.com",
  projectId: "ucpportalclone-b264a",
  storageBucket: "ucpportalclone-b264a.firebasestorage.app",
  messagingSenderId: "339496645684",
  appId: "1:339496645684:android:916e98b95f1f4d6df54661",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Parse command line arguments
const args = process.argv.slice(2);
let USER_ID = "D0KvwixOp4gwPYGmOf1Fs9K9ctb2"; // Default user ID
let USER_EMAIL = ""; // Will be set from args or empty

// Parse arguments
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--uid' && args[i + 1]) {
    USER_ID = args[i + 1];
    i++;
  } else if (args[i] === '--email' && args[i + 1]) {
    USER_EMAIL = args[i + 1];
    i++;
  } else if (args[i] === '--help' || args[i] === '-h') {
    console.log(`
Usage: node scripts/seedFirestore.js [options]

Options:
  --uid <userId>    Firebase user UID (required for new users)
  --email <email>   User's email address
  --help, -h        Show this help message

Examples:
  node scripts/seedFirestore.js --uid ABC123XYZ --email student@ucp.edu.pk
  node scripts/seedFirestore.js --uid ABC123XYZ
`);
    process.exit(0);
  }
}

// Data to seed
const subjects = [
  { icon: "book-outline", name: "Advanced Web Technologies", time: "Tue, Thu 10:00 AM", code: "IT-501", credits: 4 },
  { icon: "beaker-outline", name: "Machine Learning Fundamentals", time: "Mon, Wed 1:00 PM", code: "AI-302", credits: 3 },
  { icon: "layers-outline", name: "Database Design", time: "Wed, Fri 9:30 AM", code: "DB-201", credits: 3 },
  { icon: "settings-outline", name: "Network Security", time: "Tue, Thu 2:00 PM", code: "SEC-401", credits: 3 },
  { icon: "trending-up-outline", name: "Big Data Analytics", time: "Mon, Wed 3:00 PM", code: "BD-350", credits: 3 },
  { icon: "code-working-outline", name: "DevOps Engineering", time: "Fri 11:00 AM", code: "DE-401", credits: 3 },
];

const notifications = [
  { id: 1, sender: "Department Head", message: "New research seminar scheduled for next week", time: "2 hours ago", icon: "megaphone-outline", color: "#8B5CF6" },
  { id: 2, sender: "Prof. Ahmed Khan", message: "Midterm exam rescheduled to January 15", time: "5 hours ago", icon: "alert-circle-outline", color: "#EC4899" },
  { id: 3, sender: "Admissions", message: "Your scholarship renewal application received", time: "12 hours ago", icon: "checkmark-circle-outline", color: "#06B6D4" },
  { id: 4, sender: "Library", message: "Late books reminder - 3 books due today", time: "1 day ago", icon: "library-outline", color: "#D97706" },
];

const gradebook = {
  "Fall 2025": [
    { name: "Advanced Web Technologies", code: "IT-501", credits: 4, grade: "A", gpa: 4.0, color: "#7C3AED" },
    { name: "Machine Learning Fundamentals", code: "AI-302", credits: 3, grade: "A-", gpa: 3.7, color: "#0891B2" },
    { name: "Database Design", code: "DB-201", credits: 3, grade: "B+", gpa: 3.3, color: "#EA580C" },
    { name: "Network Security", code: "SEC-401", credits: 3, grade: "A", gpa: 4.0, color: "#059669" },
  ],
  "Spring 2025": [
    { name: "Big Data Analytics", code: "BD-350", credits: 3, grade: "B", gpa: 3.0, color: "#DC2626" },
    { name: "DevOps Engineering", code: "DE-401", credits: 3, grade: "A-", gpa: 3.7, color: "#7F1D1D" },
  ],
};

const attendance = {
  "December 2025": [
    { subject: "Advanced Web Technologies", total: 16, present: 15, absent: 1, percentage: 94, color: "#7C3AED" },
    { subject: "Machine Learning Fundamentals", total: 13, present: 12, absent: 1, percentage: 92, color: "#0891B2" },
    { subject: "Database Design", total: 11, present: 10, absent: 1, percentage: 91, color: "#EA580C" },
    { subject: "Network Security", total: 9, present: 9, absent: 0, percentage: 100, color: "#059669" },
  ],
  "November 2025": [
    { subject: "Big Data Analytics", total: 14, present: 13, absent: 1, percentage: 93, color: "#DC2626" },
    { subject: "DevOps Engineering", total: 11, present: 10, absent: 1, percentage: 91, color: "#7F1D1D" },
  ],
};

const invoices = {
  "2025": [
    { id: "INV-2025-101", semester: "Fall 2025", amountUSD: 520, amountPKR: 156000, status: "Pending", statusColor: "#EF4444", dueDate: "Jan 15, 2026", issueDate: "Dec 1, 2025", description: "Semester Fee with Laboratory Charges" },
    { id: "INV-2025-102", semester: "Spring 2026", amountUSD: 510, amountPKR: 152000, status: "Paid", statusColor: "#10B981", dueDate: "Jun 15, 2026", issueDate: "May 1, 2026", description: "Tuition Fee - Spring Semester 2026" },
  ],
  "2024": [
    { id: "INV-2024-101", semester: "Fall 2024", amountUSD: 475, amountPKR: 142000, status: "Paid", statusColor: "#10B981", dueDate: "Dec 10, 2024", issueDate: "Nov 5, 2024", description: "Annual Tuition and Facility Fee" },
  ],
};

const schedule = [
  {
    day: "Monday",
    classes: [
      { subject: "Advanced Web Technologies", time: "10:00 AM - 11:30 AM", room: "Room 401", professor: "Dr. Hassan Raza", color: "#7C3AED", icon: "code-working-outline" },
      { subject: "Machine Learning Fundamentals", time: "1:00 PM - 2:30 PM", room: "Lab 501", professor: "Dr. Fatima Khan", color: "#0891B2", icon: "beaker-outline" },
    ],
  },
  {
    day: "Tuesday",
    classes: [
      { subject: "Database Design", time: "9:30 AM - 11:00 AM", room: "Room 301", professor: "Dr. Imran Ali", color: "#EA580C", icon: "layers-outline" },
      { subject: "Network Security", time: "2:00 PM - 3:30 PM", room: "Lab 301", professor: "Prof. Sana Ahmed", color: "#059669", icon: "shield-checkmark-outline" },
    ],
  },
  {
    day: "Wednesday",
    classes: [
      { subject: "Advanced Web Technologies", time: "10:00 AM - 11:30 AM", room: "Room 401", professor: "Dr. Hassan Raza", color: "#7C3AED", icon: "code-working-outline" },
      { subject: "Big Data Analytics", time: "1:00 PM - 2:30 PM", room: "Lab 401", professor: "Dr. Muhammad Hassan", color: "#DC2626", icon: "trending-up-outline" },
    ],
  },
  {
    day: "Thursday",
    classes: [
      { subject: "Database Design", time: "9:30 AM - 11:00 AM", room: "Room 301", professor: "Dr. Imran Ali", color: "#EA580C", icon: "layers-outline" },
      { subject: "Machine Learning Fundamentals", time: "2:00 PM - 3:30 PM", room: "Lab 501", professor: "Dr. Fatima Khan", color: "#0891B2", icon: "beaker-outline" },
    ],
  },
  {
    day: "Friday",
    classes: [
      { subject: "Advanced Web Technologies", time: "10:00 AM - 11:30 AM", room: "Room 401", professor: "Dr. Hassan Raza", color: "#7C3AED", icon: "code-working-outline" },
      { subject: "DevOps Engineering", time: "1:00 PM - 2:30 PM", room: "Lab 201", professor: "Dr. Usman Khan", color: "#7F1D1D", icon: "cog-outline" },
    ],
  },
];

const profile = {
  name: "Muhammad Hassan",
  email: USER_EMAIL,
  phone: "+92 321 7654321",
  address: "456 University Avenue, Lahore, Pakistan",
  dob: "1998-03-22",
  studentId: "UCP567890",
  department: "Information Technology",
  semester: "6th",
  profilePicture: ""
};

const dashboard = {
  grades: "88%",
  attendance: "94%",
  pendingFees: "PKR 156,000",
  dueDate: "Jan 15, 2026"
};

// User document path
const userDocPath = `users/${USER_ID}`;

async function seedFirestore() {
  try {
    console.log("========================================");
    console.log("Seed Firestore for New User");
    console.log("========================================\n");
    console.log(`User ID: ${USER_ID}`);
    console.log(`Email: ${USER_EMAIL || '(not provided)'}`);
    console.log(`Writing data to: ${userDocPath}\n`);

    // Update user document with all the data
    console.log("Seeding all data to user document...");
    await setDoc(doc(db, userDocPath), {
      profile: profile,
      dashboard: dashboard,
      subjects: subjects,
      notifications: notifications,
      submittedFeedback: [],
      gradebook: gradebook,
      attendance: attendance,
      invoices: invoices,
      schedule: schedule,
    }, { merge: true });
    
    console.log("✓ Profile seeded successfully");
    console.log("✓ Dashboard seeded successfully");
    console.log("✓ Subjects seeded successfully");
    console.log("✓ Notifications seeded successfully");
    console.log("✓ Gradebook seeded successfully");
    console.log("✓ Attendance seeded successfully");
    console.log("✓ Invoices seeded successfully");
    console.log("✓ Schedule seeded successfully\n");

    console.log("========================================");
    console.log("All data seeded successfully!");
    console.log("========================================");
    
    process.exit(0);
  } catch (error) {
    console.error("Error seeding Firestore:", error);
    process.exit(1);
  }
}

// Run the seeding function
seedFirestore();
