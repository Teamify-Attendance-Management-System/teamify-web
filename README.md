# Teamify - Team Management & Attendance System

Modern team management and attendance tracking system built with React, TypeScript, and Supabase.

## Features

- 🔐 **Authentication** - Secure sign-up, sign-in, and sign-out
- 👥 **User Management** - Employee profiles and management
- ⏰ **Attendance Tracking** - QR code-based attendance system
- 📊 **Analytics & Reports** - Real-time attendance analytics
- 🎨 **Modern UI** - Beautiful, responsive interface with Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Teamify-Attendance-Management-System/teamify-web.git
cd teamify-web
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory:
```env
VITE_SUPABASE_PROJECT_ID="your-project-id"
VITE_SUPABASE_PUBLISHABLE_KEY="your-anon-key"
VITE_SUPABASE_URL="https://your-project-id.supabase.co"
```

### Supabase Configuration

#### Disable Email Confirmation (For Development)

For easier development, you can disable email confirmation:

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Authentication** → **Providers** → **Email**
4. **Uncheck "Confirm email"**
5. Click **Save**

This allows users to sign up and immediately access the app without email verification.

#### Email Templates (For Production)

For production, keep email confirmation enabled and customize your email templates:

1. Go to **Authentication** → **Email Templates**
2. Customize the confirmation email template
3. Set up a custom SMTP server (optional) under **Authentication** → **Settings**

### Running the App

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── layout/        # Layout components (DashboardLayout, etc.)
│   ├── ui/            # shadcn/ui components
│   └── ProtectedRoute.tsx
├── contexts/          # React contexts (AuthContext)
├── integrations/      # External service integrations (Supabase)
├── pages/             # Page components
│   ├── Auth.tsx       # Login/Signup page
│   ├── Dashboard.tsx  # Main dashboard
│   └── ...
├── App.tsx            # Main app component
└── main.tsx           # App entry point
```

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI**: Tailwind CSS, shadcn/ui
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **State Management**: React Query
- **Routing**: React Router v6

## Authentication Flow

1. **Sign Up**: Users create an account with email/password
2. **Email Verification**: (If enabled) Users verify their email
3. **Sign In**: Users log in with credentials
4. **Protected Routes**: Dashboard and other pages require authentication
5. **Sign Out**: Users can sign out from the sidebar

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please open an issue on GitHub.
