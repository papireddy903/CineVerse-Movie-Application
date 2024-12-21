import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getPerformance, trace } from "firebase/performance";
import { onCLS, onFID, onLCP } from 'web-vitals';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: `${process.env.REACT_APP_PROJECT_ID}.appspot.com`, 
  messagingSenderId: process.env.REACT_APP_MESSAGE_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const perf = getPerformance(app);

const logVitals = ({ name, value, id }) => {
  console.log({ name, value, id });
  
  // Create a custom trace for each web vital
  const vitalTrace = trace(perf, `web_vital_${name}`);
  vitalTrace.start();
  vitalTrace.putMetric('value', value);
  vitalTrace.stop();
};

// Track Cumulative Layout Shift (CLS)
onCLS(logVitals);

// Track First Input Delay (FID)
onFID(logVitals);

// Track Largest Contentful Paint (LCP)
onLCP(logVitals);

export { auth, db, perf };