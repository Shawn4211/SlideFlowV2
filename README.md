# SlideFlow 1.0

SlideFlow is a cloud-based Digital Signage Content Management System (CMS) built with Next.js, React, and Supabase. It allows administrators to create, manage, schedule, and broadcast visual presentations to remote screens in real-time.

## System Requirements
To run this application, you will need the following installed on your machine:
*   [Node.js](https://nodejs.org/) (Version 18.x or higher)
*   [Git](https://git-scm.com/) (Optional, for cloning the repository)
*   A modern web browser (Chrome, Firefox, Edge, Safari)

## Installation Guide

Follow these steps to set up and run SlideFlow on your local machine:

### 1. Download the Project
Extract the provided project ZIP file to a folder on your computer, or clone the repository via Git:
```bash
git clone <repository-url>
cd SlideFlow
```

### 2. Install Dependencies
Open a terminal (Command Prompt, PowerShell, or macOS Terminal) inside the `SlideFlow` project folder and run the following command to download all required packages:
```bash
npm install
```

### 3. Configure Environment Variables
SlideFlow relies on a Supabase backend for its database, file storage, and authentication. 
1. Create a new file in the very main/root project directory named **exactly**: `.env.local`
2. Open this `.env.local` file in a text editor and add your Supabase credentials provided by the development team. It should look exactly like this:

```env
NEXT_PUBLIC_SUPABASE_URL="YOUR_SUPABASE_PROJECT_URL"
NEXT_PUBLIC_SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_KEY"
```
*(Note: If you are the instructor grading this project, please consult the submission notes for the live API keys required to connect to our hosted database.)*

### 4. Start the Development Server
Once the dependencies are installed and the environment variables are set, you can start the local server by running:
```bash
npm run dev
```

### 5. Access the Application
Open your web browser and navigate to:
```
http://localhost:3000
```
You should now see the SlideFlow login screen!

---

## Default Administrator Login
To access the Dashboard, use the following credentials provided in the database `credentials` table:
*   **Username:** `Admin`
*   **Password:** `Password1`

## Key Features
*   **Secure Authentication:** Access restricted exclusively to authorized administrators.
*   **Drag-and-Drop Editor:** Create dynamic slides with text, shapes, and media using a fully integrated visual editor.
*   **Advanced Scheduling:** Chronological validation ensures robust content rotation logic.
*   **Real-Time Sync:** Screens polling `/display` update instantly without page refreshes when manual overrides are triggered via the "Present" buttons.
*   **Cloud Storage Integration:** Fast asset uploads using multipart chunking to the Supabase cloud bucket.
