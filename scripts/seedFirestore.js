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
let USER_ID = "8oTrBQtYoXTeKaEJdPr3N0tkvan2"; // Default user ID
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
  { icon: "code-slash-outline", name: "Object Oriented Programming", time: "Mon, Wed 9:00 AM", code: "CS-210", credits: 3 },
  { icon: "git-network-outline", name: "Software Engineering", time: "Mon, Wed 11:00 AM", code: "CS-320", credits: 3 },
  { icon: "analytics-outline", name: "Data Science", time: "Tue, Thu 9:00 AM", code: "CS-410", credits: 3 },
  { icon: "cloud-outline", name: "Cloud Computing", time: "Tue, Thu 11:00 AM", code: "CS-420", credits: 3 },
  { icon: "phone-portrait-outline", name: "Mobile App Development", time: "Mon, Wed 2:00 PM", code: "CS-330", credits: 3 },
  { icon: "terminal-outline", name: "System Programming", time: "Fri 10:00 AM", code: "CS-310", credits: 3 },
];

const notifications = [
  { id: 1, sender: "Admin Office", message: "Registration for Spring 2025 opens on Jan 5", time: "1 hour ago", icon: "calendar-outline", color: "#4F46E5" },
  { id: 2, sender: "Dr. Sarah Ahmed", message: "OOP project submission deadline extended", time: "3 hours ago", icon: "document-text-outline", color: "#10B981" },
  { id: 3, sender: "Finance Office", message: "Fee challan generated for Spring 2025", time: "1 day ago", icon: "cash-outline", color: "#EF4444" },
  { id: 4, sender: "IT Department", message: "Portal maintenance scheduled for Sunday", time: "2 days ago", icon: "construct-outline", color: "#F59E0B" },
];

const gradebook = {
  "Fall 2025": [
    { name: "Object Oriented Programming", code: "CS-210", credits: 3, grade: "A-", gpa: 3.7, color: "#4F46E5" },
    { name: "Software Engineering", code: "CS-320", credits: 3, grade: "B+", gpa: 3.3, color: "#10B981" },
    { name: "Data Science", code: "CS-410", credits: 3, grade: "A", gpa: 4.0, color: "#F59E0B" },
    { name: "Cloud Computing", code: "CS-420", credits: 3, grade: "B", gpa: 3.0, color: "#8B5CF6" },
  ],
  "Spring 2025": [
    { name: "Mobile App Development", code: "CS-330", credits: 3, grade: "A", gpa: 4.0, color: "#EC4899" },
    { name: "System Programming", code: "CS-310", credits: 3, grade: "A-", gpa: 3.7, color: "#06B6D4" },
  ],
};

const attendance = {
  "December 2025": [
    { subject: "Object Oriented Programming", total: 14, present: 13, absent: 1, percentage: 93, color: "#4F46E5" },
    { subject: "Software Engineering", total: 12, present: 11, absent: 1, percentage: 92, color: "#10B981" },
    { subject: "Data Science", total: 10, present: 9, absent: 1, percentage: 90, color: "#F59E0B" },
    { subject: "Cloud Computing", total: 8, present: 7, absent: 1, percentage: 88, color: "#8B5CF6" },
  ],
  "November 2025": [
    { subject: "Object Oriented Programming", total: 12, present: 12, absent: 0, percentage: 100, color: "#4F46E5" },
    { subject: "Software Engineering", total: 10, present: 9, absent: 1, percentage: 90, color: "#10B981" },
  ],
};

const invoices = {
  "2025": [
    { id: "INV-2025-001", semester: "Fall 2025", amountUSD: 500, amountPKR: 140000, status: "Pending", statusColor: "#EF4444", dueDate: "Dec 20, 2025", issueDate: "Nov 15, 2025", description: "Tuition Fee - Fall Semester 2025" },
    { id: "INV-2025-002", semester: "Spring 2025", amountUSD: 480, amountPKR: 135000, status: "Paid", statusColor: "#10B981", dueDate: "Jun 20, 2025", issueDate: "May 15, 2025", description: "Tuition Fee - Spring Semester 2025" },
  ],
  "2024": [
    { id: "INV-2024-001", semester: "Fall 2024", amountUSD: 450, amountPKR: 125000, status: "Paid", statusColor: "#10B981", dueDate: "Dec 15, 2024", issueDate: "Nov 1, 2024", description: "Tuition Fee - Fall Semester 2024" },
  ],
};

const schedule = [
  {
    day: "Monday",
    classes: [
      { subject: "Object Oriented Programming", time: "9:00 AM - 10:30 AM", room: "Room 201", professor: "Dr. Sarah Ahmed", color: "#4F46E5", icon: "code-slash-outline" },
      { subject: "Software Engineering", time: "11:00 AM - 12:30 PM", room: "Room 305", professor: "Dr. Bilal Khan", color: "#10B981", icon: "git-network-outline" },
      { subject: "Mobile App Development", time: "2:00 PM - 3:30 PM", room: "Lab 201", professor: "Ms. Ayesha Tariq", color: "#EC4899", icon: "phone-portrait-outline" },
    ],
  },
  {
    day: "Tuesday",
    classes: [
      { subject: "Data Science", time: "9:00 AM - 10:30 AM", room: "Lab 301", professor: "Dr. Zainab Ali", color: "#F59E0B", icon: "analytics-outline" },
      { subject: "Cloud Computing", time: "11:00 AM - 12:30 PM", room: "Room 401", professor: "Dr. Farhan Malik", color: "#8B5CF6", icon: "cloud-outline" },
      { subject: "System Programming", time: "2:00 PM - 3:30 PM", room: "Lab 102", professor: "Dr. Kamran Shah", color: "#06B6D4", icon: "terminal-outline" },
    ],
  },
  {
    day: "Wednesday",
    classes: [
      { subject: "Object Oriented Programming", time: "9:00 AM - 10:30 AM", room: "Room 201", professor: "Dr. Sarah Ahmed", color: "#4F46E5", icon: "code-slash-outline" },
      { subject: "Software Engineering", time: "11:00 AM - 12:30 PM", room: "Room 305", professor: "Dr. Bilal Khan", color: "#10B981", icon: "git-network-outline" },
      { subject: "Mobile App Development", time: "2:00 PM - 3:30 PM", room: "Lab 201", professor: "Ms. Ayesha Tariq", color: "#EC4899", icon: "phone-portrait-outline" },
    ],
  },
  {
    day: "Thursday",
    classes: [
      { subject: "Data Science", time: "9:00 AM - 10:30 AM", room: "Lab 301", professor: "Dr. Zainab Ali", color: "#F59E0B", icon: "analytics-outline" },
      { subject: "Cloud Computing", time: "11:00 AM - 12:30 PM", room: "Room 401", professor: "Dr. Farhan Malik", color: "#8B5CF6", icon: "cloud-outline" },
      { subject: "System Programming", time: "2:00 PM - 3:30 PM", room: "Lab 102", professor: "Dr. Kamran Shah", color: "#06B6D4", icon: "terminal-outline" },
    ],
  },
  {
    day: "Friday",
    classes: [
      { subject: "Object Oriented Programming", time: "10:00 AM - 11:30 AM", room: "Room 201", professor: "Dr. Sarah Ahmed", color: "#4F46E5", icon: "code-slash-outline" },
      { subject: "Data Science", time: "1:00 PM - 2:30 PM", room: "Lab 301", professor: "Dr. Zainab Ali", color: "#F59E0B", icon: "analytics-outline" },
      { subject: "Cloud Computing", time: "3:00 PM - 4:30 PM", room: "Room 401", professor: "Dr. Farhan Malik", color: "#8B5CF6", icon: "cloud-outline" },
    ],
  },
];

const profile = {
  name: "",
  email: USER_EMAIL,
  phone: "",
  address: "",
  dob: "",
  studentId: "",
  department: "",
  semester: "",
  profilePicture: ""
};

const dashboard = {
  grades: "85%",
  attendance: "90%",
  pendingFees: "PKR 140,000",
  dueDate: "Dec 20, 2025"
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
