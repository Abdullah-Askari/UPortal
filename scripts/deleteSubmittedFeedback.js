const { initializeApp } = require('firebase/app');
const { getFirestore, doc, updateDoc, deleteField, getDoc } = require('firebase/firestore');

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

// User document path - UPDATE THIS WITH YOUR USER ID
const USER_ID = "yRS0HjxXOSVU6xlSqpMKy25nWx02";

async function deleteAllSubmittedFeedback() {
  try {
    console.log("========================================");
    console.log("Delete Submitted Feedback Script");
    console.log("========================================\n");
    console.log(`User ID: ${USER_ID}\n`);

    const userDocRef = doc(db, 'users', USER_ID);
    
    // First, get current feedback to show what will be deleted
    const userDoc = await getDoc(userDocRef);
    
    if (!userDoc.exists()) {
      console.log("❌ User document not found!");
      process.exit(1);
    }

    const userData = userDoc.data();
    const submittedFeedback = userData.submittedFeedback || [];

    if (submittedFeedback.length === 0) {
      console.log("ℹ️  No submitted feedback found to delete.");
      process.exit(0);
    }

    console.log(`Found ${submittedFeedback.length} submitted feedback(s):\n`);
    
    submittedFeedback.forEach((feedback, index) => {
      console.log(`${index + 1}. Subject: ${feedback.subject}`);
      console.log(`   Rating: ${'⭐'.repeat(feedback.rating)}`);
      console.log(`   Date: ${feedback.date}`);
      console.log(`   Message: ${feedback.message || '(no message)'}\n`);
    });

    // Delete all submitted feedback
    console.log("Deleting all submitted feedback...\n");
    
    await updateDoc(userDocRef, {
      submittedFeedback: []
    });

    console.log("✓ All submitted feedback deleted successfully!\n");
    console.log("========================================");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error deleting feedback:", error);
    process.exit(1);
  }
}

async function deleteSpecificFeedback(feedbackId) {
  try {
    console.log("========================================");
    console.log("Delete Specific Feedback Script");
    console.log("========================================\n");
    console.log(`User ID: ${USER_ID}`);
    console.log(`Feedback ID to delete: ${feedbackId}\n`);

    const userDocRef = doc(db, 'users', USER_ID);
    const userDoc = await getDoc(userDocRef);
    
    if (!userDoc.exists()) {
      console.log("❌ User document not found!");
      process.exit(1);
    }

    const userData = userDoc.data();
    const submittedFeedback = userData.submittedFeedback || [];
    
    const feedbackIndex = submittedFeedback.findIndex(f => f.id === feedbackId);
    
    if (feedbackIndex === -1) {
      console.log(`❌ Feedback with ID "${feedbackId}" not found!`);
      process.exit(1);
    }

    const deletedFeedback = submittedFeedback[feedbackIndex];
    console.log(`Deleting feedback for: ${deletedFeedback.subject}\n`);

    // Remove the specific feedback
    const updatedFeedback = submittedFeedback.filter(f => f.id !== feedbackId);
    
    await updateDoc(userDocRef, {
      submittedFeedback: updatedFeedback
    });

    console.log("✓ Feedback deleted successfully!\n");
    console.log("========================================");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error deleting feedback:", error);
    process.exit(1);
  }
}

// Parse command line arguments
const args = process.argv.slice(2);

if (args.length === 0) {
  // Delete all feedback
  deleteAllSubmittedFeedback();
} else if (args[0] === '--id' && args[1]) {
  // Delete specific feedback by ID
  deleteSpecificFeedback(args[1]);
} else if (args[0] === '--help' || args[0] === '-h') {
  console.log(`
Usage: node scripts/deleteSubmittedFeedback.js [options]

Options:
  (no args)     Delete ALL submitted feedback for the user
  --id <id>     Delete specific feedback by ID
  --help, -h    Show this help message

Examples:
  node scripts/deleteSubmittedFeedback.js
  node scripts/deleteSubmittedFeedback.js --id 1733401234567
  
Note: Update USER_ID in the script to match your user's UID.
`);
  process.exit(0);
} else {
  console.log("Invalid arguments. Use --help for usage information.");
  process.exit(1);
}
