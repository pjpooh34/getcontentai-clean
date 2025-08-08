import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Mock Firebase configuration for development
// In production, replace with real Firebase config
const firebaseConfig = {
  apiKey: "mock-api-key",
  authDomain: "mock-project.firebaseapp.com",
  projectId: "mock-project-id",
  storageBucket: "mock-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "mock-app-id"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

export default app; 