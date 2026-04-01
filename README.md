# IdeaMining Machine

A revolutionary chat platform that uses AI to extract startup ideas from real human conversations.

## Features

- **Real-time Chat**: WhatsApp-like interface using Socket.io
- **AI Idea Mining**: Gemini AI analyzes conversations to detect startup opportunities
- **User Roles**: Normal users, Free innovators, and Premium innovators
- **Idea Management**: Daily idea rotation and premium access controls
- **Modern UI**: Built with React and Tailwind CSS

## Tech Stack

### Frontend
- React (Vite)
- Tailwind CSS
- Socket.io Client
- Axios
- React Router
- Lucide React Icons

### Backend
- Node.js + Express
- MongoDB (Mongoose)
- Socket.io
- Gemini AI API
- JWT Authentication
- Node Cron Jobs

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- Gemini API Key

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ideamining
JWT_SECRET=your_jwt_secret_key_here_change_in_production
GEMINI_API_KEY=your_gemini_api_key_here
NODE_ENV=development
```

5. Start the backend server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:
```
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

5. Start the frontend development server:
```bash
npm run dev
```

## User Roles

### Normal User
- Can register and login
- Can chat with other users
- Cannot view startup ideas

### Innovator (Free)
- All Normal User features
- Can access 1 Idea of the Day
- Basic idea preview only

### Innovator Premium
- All Free Innovator features
- Can view 3 AI-generated ideas daily
- Full idea details and analysis
- Market insights and source context

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `POST /api/auth/upgrade-premium` - Upgrade to premium

### Chat
- `GET /api/chats` - Get user's chats
- `POST /api/chats` - Create new chat
- `GET /api/chats/:chatId/messages` - Get chat messages
- `GET /api/users` - Get all users

### Ideas
- `GET /api/ideas` - Get ideas (innovators only)
- `GET /api/ideas/today` - Get idea of the day
- `GET /api/ideas/:ideaId` - Get idea details (premium only)

## Socket Events

### Client to Server
- `join_chat` - Join a chat room
- `send_message` - Send a message
- `typing` - User is typing
- `stop_typing` - User stopped typing

### Server to Client
- `new_message` - New message received
- `user_typing` - User is typing indicator
- `user_stop_typing` - User stopped typing
- `user_status` - User online/offline status
- `new_idea_detected` - New startup idea discovered

## AI Idea Mining

The system analyzes conversations every 5 messages using Gemini AI to detect:
- Startup ideas
- Problems and complaints
- Market opportunities
- Innovation gaps

Ideas are structured with:
- Title
- Problem detected
- Startup solution
- Potential market
- Future scope

## Cron Jobs

- **Daily at midnight**: Updates "Idea of the Day"
- **Real-time**: Analyzes conversations for new ideas

## Development

### Backend Structure
```
backend/
├── models/          # MongoDB schemas
├── routes/          # API routes
├── controllers/     # Route handlers
├── middleware/      # Auth middleware
├── services/        # External services (Gemini)
├── socket/          # Socket.io handlers
├── cron/           # Scheduled jobs
└── server.js       # Main server file
```

### Frontend Structure
```
frontend/src/
├── pages/          # React pages
├── components/     # Reusable components
├── context/        # React context
├── services/       # API and Socket services
└── App.jsx        # Main app component
```

## License

MIT License