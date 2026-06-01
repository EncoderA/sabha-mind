# VartaIQ (Sabha Mind)

> AI-powered meeting intelligence platform that transforms Google Meet conversations into actionable insights, structured summaries, and searchable knowledge.

[![Next.js](https://img.shields.io/badge/Next.js-16.2.4-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.4-blue?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)

## 🎯 Overview

VartaIQ is a comprehensive meeting intelligence platform that integrates directly with Google Meet to provide:

- **Real-time Transcription**: Capture every word spoken during meetings
- **AI-Powered Summaries**: Generate structured summaries with decisions, action items, and key topics
- **Speaker Analytics**: Understand participation patterns and speaking time distribution
- **Smart Search**: Find discussions across your meeting history by topic, participant, or keyword
- **Google Meet Add-on**: Seamless integration within the Google Meet interface

## ✨ Key Features

### 🎙️ Meeting Recording & Transcription
- Join meetings automatically via Google Meet add-on or manually via dashboard
- Real-time transcription with speaker identification
- Secure recording controls with audit trails

### 📊 AI-Powered Analysis
- **Executive Summaries**: Concise overview of meeting outcomes
- **Action Items**: Automatically extracted tasks with owners
- **Decisions**: Key decisions made during the meeting
- **Topics**: Recurring themes and discussion points
- **Speaker Analytics**: Participation metrics and speaking time analysis

### 🔍 Smart Organization
- Searchable meeting history
- Filter by date, participants, or topics
- Quick access to recent transcripts and summaries
- Structured data export capabilities

### 🎨 Modern UI/UX
- Clean, professional interface built with shadcn/ui
- Dark mode support
- Responsive design for all devices
- Accessible components following WCAG guidelines

## 🚀 Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm, yarn, pnpm, or bun
- Google Meet account (for add-on features)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/sabha-mind.git
   cd sabha-mind
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory with the required configuration variables. Refer to `.env.example` for the list of required variables.

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
sabha-mind/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── (auth)/              # Authentication pages
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (dashboard)/         # Main dashboard pages
│   │   │   ├── meet-bot/        # Bot control dashboard
│   │   │   └── meetings/        # Meetings list & details
│   │   ├── (root)/              # Landing page
│   │   ├── api/                 # API routes
│   │   │   ├── ai-meetings/    # AI processing endpoints
│   │   │   ├── auth/            # Authentication endpoints
│   │   │   ├── transcripts/    # Transcript management
│   │   │   └── submit-link/    # Meeting link submission
│   │   └── meet-addon/          # Google Meet add-on pages
│   │       ├── summaries/       # Summary views
│   │       └── transcripts/     # Transcript views
│   ├── components/              # React components
│   │   ├── meet-bot/           # Meeting bot components
│   │   └── ui/                 # shadcn/ui components
│   ├── hooks/                   # Custom React hooks
│   │   └── use-meet-bot.ts    # Meeting bot state management
│   └── lib/                     # Utility functions
│       ├── api.ts              # API client
│       ├── bot-api.ts          # Bot-specific API
│       ├── meetings-api.ts     # Meetings API
│       └── utils.ts            # Helper functions
├── public/                      # Static assets
├── .agents/                     # AI agent configurations
└── .kiro/                       # Kiro IDE settings
```

## 🛠️ Tech Stack

### Core Framework
- **Next.js 16.2.4** - React framework with App Router
- **React 19.2.4** - UI library with React Compiler enabled
- **TypeScript 5.x** - Type-safe development

### Styling & UI
- **Tailwind CSS 4.x** - Utility-first CSS framework
- **shadcn/ui** - High-quality React components
- **Lucide React** - Beautiful icon library
- **class-variance-authority** - Component variant management

### Google Integration
- **@googleworkspace/meet-addons** - Google Meet add-on SDK

### Development Tools
- **ESLint** - Code linting
- **Babel React Compiler** - Optimized React compilation
- **PostCSS** - CSS processing

## 📖 Usage

### Dashboard Mode (Manual Join)

1. Navigate to `/meet-bot`
2. Enter a Google Meet URL manually
3. Click "Start Recording" to join the meeting
4. View transcripts at `/meet-bot/transcripts`
5. View summaries at `/meet-bot/summaries`

### Add-on Mode (Auto Join)

1. Install the Google Meet add-on
2. Join a Google Meet call
3. Open the VartaIQ add-on from the side panel
4. The meeting is automatically detected
5. Click "Start Recording" to begin transcription
6. Access transcripts and summaries directly from the add-on

### Viewing Meeting Summaries

1. Go to `/meetings` to see all recorded meetings
2. Click on any meeting to view:
   - Executive summary
   - Full transcript with timestamps
   - Action items and decisions
   - Speaker analytics
   - Topic analysis
   - Meeting insights

## 🎨 Design System

VartaIQ uses a consistent design system based on:

- **Colors**: OKLCH color space for perceptually uniform colors
- **Typography**: Geist Sans (body) and Geist Mono (headings)
- **Spacing**: Consistent 4px-based spacing scale
- **Components**: shadcn/ui component library
- **Icons**: Lucide React icon set

## 🔒 Security Features

- **Content Security Policy**: Configured for Google Meet iframe embedding
- **X-Frame-Options**: Protection against clickjacking
- **Secure API Routes**: Protected endpoints with authentication
- **Role-based Access**: Meeting history based on user roles
- **Audit Trails**: Complete recording and access logs

## 📊 Key Metrics

- **Summary Turnaround**: < 2 minutes
- **Speaker Visibility**: 100% identification
- **Meeting Records**: Fully searchable
- **Responsive Design**: Mobile, tablet, and desktop support

## 🧪 Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linter
npm run lint
```

### Code Quality

- TypeScript strict mode enabled
- ESLint configuration for Next.js
- Component-based architecture
- Custom hooks for state management
- Consistent file naming conventions

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Documentation

Additional documentation is available in the project:

- `MEET_BOT_QUICK_REFERENCE.md` - Quick reference for meet bot features
- `AI_SUMMARY_DESIGN_UPDATE.md` - Design system documentation
- `GOOGLE_AUTH_SETUP.md` - Google authentication setup guide
- `MEETINGS_UI_SUMMARY.md` - Meetings UI documentation


## 📄 License

This project is private and proprietary. All rights reserved.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)

## 📧 Support

For support, please contact the development team or open an issue in the repository.

---

