# Task Board - Modern Task Management

A modern, real-time task management application built with Next.js, Firebase, and DnD Kit. Organize your tasks efficiently with a beautiful and intuitive interface.

## ✨ Features

- **🔒 Secure Authentication**
  - Email/Password authentication
  - Google Sign-in integration
  - Protected routes and user sessions

- **📋 Task Management**
  - Create, edit, and organize tasks
  - Drag-and-drop interface
  - Real-time updates across devices
  - Priority levels (Low, Medium, High)
  - Task status tracking (To Do, In Progress, Done)

- **💫 Modern UI**
  - Responsive design
  - Beautiful animations
  - Clean and intuitive interface
  - Modern glassmorphism effects

- **🔄 Real-time Sync**
  - Firebase Firestore integration
  - Instant updates across devices
  - Offline support
  - Data persistence

## 🚀 Tech Stack

- **Frontend**
  - [Next.js 13](https://nextjs.org/) - React framework
  - [Tailwind CSS](https://tailwindcss.com/) - Styling
  - [DnD Kit](https://dndkit.com/) - Drag and drop functionality
  - [Geist Fonts](https://vercel.com/font) - Modern typography

- **Backend**
  - [Firebase](https://firebase.google.com/)
    - Authentication
    - Firestore Database
    - Real-time updates
    - Analytics

## 🛠️ Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/task-board.git
   cd task-board
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Create a new Firebase project
   - Enable Authentication (Email/Password and Google)
   - Create a Firestore database
   - Copy your Firebase config
   - Create a `.env.local` file with your Firebase configuration:
     ```env
     NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
     NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
     NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
     NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
     NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
     NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
     NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
     ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 Usage

1. **Sign Up/Sign In**
   - Create an account using email/password
   - Or sign in with Google
   - Your session will be persisted

2. **Create Tasks**
   - Click "New Task" button
   - Fill in task details:
     - Title
     - Description
     - Priority
     - Status

3. **Organize Tasks**
   - Drag and drop tasks between columns
   - Tasks automatically sync across devices
   - Edit tasks by clicking the edit button
   - Status updates in real-time

## 🔨 Development

- **File Structure**
  ```
  src/
  ├── app/              # Next.js 13 app directory
  ├── components/       # React components
  ├── context/         # React context providers
  ├── hooks/           # Custom React hooks
  ├── lib/            # Firebase and utility functions
  └── types/          # TypeScript type definitions
  ```


## 👏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Firebase](https://firebase.google.com/)
- [DnD Kit](https://dndkit.com/)
- [Tailwind CSS](https://tailwindcss.com/)
