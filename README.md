# Movie Application Using OMDb API

## Overview

The **Movie App** is a web application that allows users to search for movies, view detailed information about them, and manage a list of their favorite movies. It leverages the OMDb API to fetch movie data and provides a user-friendly interface for exploring movies by title, year, and other details.

## Features

- **Search for Movies by Title**: Easily search for movies by entering the title in the search bar.
- **Narrow Down Search Results with Year**: Filter movie listings by year to refine your search results.
- **View Detailed Movie Information**: Get comprehensive details about movies including box office collections, ratings, plot summaries, and more.
- **Add/Remove Movies to/from Favorites**: Users can save their favorite movies to their list for easy access later.
- **Responsive Design**: The app is designed to work seamlessly on both mobile and desktop devices for an optimal user experience.

## Technologies Used

- **Frontend**: React.js
- **API**: OMDb API
- **Libraries**:
  - Axios (for making API requests)
  - React Router (for routing)
  - Firebase (for user authentication and storing favorite movies)
  - Tailwind CSS (for styling)
  - React Icons (for icons like heart and star)

## Setup and Installation

### Prerequisites

Ensure the following are installed on your machine:

- **Node.js** (includes npm) — [Install Node.js](https://nodejs.org/)
- **Firebase account** — [Get started with Firebase](https://firebase.google.com/)
- **API Key** from OMDb API — [Get OMDb API Key](https://www.omdbapi.com/apikey.aspx)

### Steps to Run the Application Locally

1. **Clone the Repository**  
   Clone the project to your local machine using:
   ```bash
   git clone https://github.com/papireddy903/Movie-Application-Using-OMDb-API.git
   ```
2. **Navigate to the Project Directory**  
   Change into the project directory:
   ```bash
   cd Movie-Application-Using-OMDb-API
   ```
3. **Install Dependencies**
    Install necessary dependencies
    ```bash
    npm install
    ```
4. **Setup Firebase**
    * Create a Firebase project and enable Firebase Authentication.
    * Obtain the Firebase configuration details from the Firebase console.
    * In the src/firebase.js file, add your Firebase config data:
    ```bash
    import { initializeApp } from "firebase/app";
    import { getAuth } from "firebase/auth";
    import { getFirestore } from "firebase/firestore";

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

    export { auth, db };

```

5. **Obtain OMDb API KEY**
    * Obtain APIKEY from [here](https://www.omdbapi.com/apikey.aspx)
    * Once you have your key, add it to the .env file in the root of your project:
    ```bash
    REACT_APP_OMDB_API_KEY=your-omdb-api-key
    ```
    * Ensure that the .env file is added to your .gitignore to prevent exposing sensitive information.

6. **Run the Application**
    Start the app with 
    ```bash
    npm start
    ```
    This will launch the application on http://localhost:3000 in your browser.












