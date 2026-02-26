'use client'; 
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { UserButton, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import NoteEditor from "@/components/NoteEditor";
import NoteList from "@/components/NoteList";
import { Moon, Sun } from "lucide-react";

export default function Home() {
  
  const [refreshKey, setRefreshKey] = useState(0);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);  
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

 return (
  <main className="min-h-screen max-w-4xl mx-auto p-6 md:p-10 transition-colors duration-300">
    <header className="flex justify-between items-center mb-12"> 
<h1 
  className="text-3xl font-extrabold tracking-tight transition-colors duration-300"
  style={{ color: 'var(--text-main)' }}
>
  My AI Notes
</h1>
      
      <div className="flex items-center gap-4">
        {mounted && (
          <button 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:scale-105 transition-all"
            title="Toggle Theme"
          >
            {theme === 'dark' ? (
              <Sun size={20} className="text-yellow-400" />
            ) : (
              <Moon size={20} className="text-blue-300" />
            )}
          </button>
        )}
        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
      </div>
    </header>

    <SignedIn>
      <div className="flex flex-col gap-12"> 
        <NoteEditor onSaveSuccess={handleRefresh} />
        <NoteList key={refreshKey} />
      </div>
    </SignedIn>

    <SignedOut>
      <div className="text-center py-20 bg-white dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
        <h2 className="text-xl mb-6 font-medium text-slate-600 dark:text-slate-300">Please sign in to manage your notes</h2>
        <SignInButton mode="modal">
          <button className="bg-slate-900 dark:bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:opacity-90 transition-all">
            Get Started
          </button>
        </SignInButton>
      </div>
    </SignedOut>
  </main>
);
}