AI-Powered Note-Taking Platform (PERN Stack)

A note-taking application featuring real-time AI content processing.

Links: 
Live Application :https://pern-stack-developer-poc-task-ql54.vercel.app/
Demo Video : https://www.loom.com/share/aa5686f081fb481dbcd64600b37929a9

Key Features :
- AI Content Engine : Powered by Groq API for near-instant "AI Improve," "Summarize," and "Auto-Tags" functionality.
- Theme Intelligence: Custom-engineered Dark/Light mode toggle using next-themes and Tailwind CSS utility classes.
- Data Integrity: Implemented "Null Guard" logic and Z-index (z-50) Toast notifications to prevent empty notes from entering the   database. 
- Responsive UI: Mobile-first design built with Tailwind CSS and shadcn/ui.
- Secure Auth: User authentication and session management powered by Clerk.

Tech Stack :

Frontend: Next.js 14 (App Router), TypeScript, Tailwind CSS.
Backend: Node.js API Routes (Next.js Serverless).
Database: PostgreSQL hosted on Neon DB.
Authentication: Clerk Auth.
AI Engine: Groq (Llama-3 model).

Architecture & Logic :

1. Theme Management

The application uses a ThemeProvider to inject a .dark class into the HTML root. Components use adaptive Tailwind classes (e.g., bg-white dark:bg-slate-900) to ensure a seamless visual transition.

2. AI Methodology

The AI features are integrated via a dedicated API route that communicates with Groq.

    Improve: Refined grammar and sentence structure.

    Summarize: Extracts core concepts into a concise paragraph.

    Auto-Tags: Intelligently analyzes content to generate uppercase title prefixes.

3. Validation & UX

    To maintain database health, the NoteEditor component:

    Trims whitespace and validates input length before permitting a POST request to Neon.

    Utilizes a fixed z-50 Toast system to provide non-intrusive feedback that floats above all UI layers.

4. Installation & Setup

- Clone the repository : `git clone https://github.com/vrundaparekh/pern-stack-developer-poc-task.git`

- Install the dependencies : `npm install`

- Environment Variables

    Create a .env.local file and add your credentials:

    DATABASE_URL="your_neon_url"
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_clerk_key"
    CLERK_SECRET_KEY="your_clerk_secret"
    GROQ_API_KEY="your_groq_key"


