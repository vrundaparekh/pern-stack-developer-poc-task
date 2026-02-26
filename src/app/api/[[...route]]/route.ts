import { Hono } from 'hono';
import { handle } from 'hono/vercel';
import { db } from '@/db';
import { notes } from '@/db/schema';
import { auth } from '@clerk/nextjs/server';
import { eq,desc } from 'drizzle-orm';

const app = new Hono().basePath('/api');

// 1. GET: Fetch notes for the specific user
app.get('/notes', async (c) => {
  const { userId } = await auth();
  if (!userId) return c.json({ error: "Unauthorized" }, 401);

  const userNotes = await db.select().from(notes).where(eq(notes.userId, userId)).orderBy(desc(notes.id));
  return c.json(userNotes);
});

// 2. POST: Create a new note
app.post('/notes', async (c) => {
  const { userId } = await auth();
  if (!userId) return c.json({ error: "Unauthorized" }, 401);

  const { title, content } = await c.req.json();
  
  const result = await db.insert(notes).values({
    title,
    content,
    userId, 
  }).returning();

  return c.json(result[0]);
});
// 3. DELETE: Remove a note by ID
app.delete('/notes/:id', async (c) => {
  const { userId } = await auth();
  const id = c.req.param('id'); 

  if (!userId) return c.json({ error: "Unauthorized" }, 401);

  await db.delete(notes).where(eq(notes.id, Number(id))); 
  
  return c.json({ success: true });
});

// 4. PATCH: Update an existing note
app.patch('/notes/:id', async (c) => {
  const { userId } = await auth();
  const id = c.req.param('id');
  const { title, content } = await c.req.json();

  if (!userId) return c.json({ error: "Unauthorized" }, 401);


 const updatedNote = await db.update(notes)
  .set({ title, content })
  .where(eq(notes.id, Number(id)))
  .returning(); 
return c.json(updatedNote[0]);
});



app.post('/ai/process', async (c) => {
  try {
    const { userId } = await auth();
    if (!userId) return c.json({ error: "Unauthorized" }, 401);

    const { content, mode } = await c.req.json();
    
    let prompt = "";
    if (mode === 'summary') prompt = `Summarize this in 2 short sentences: ${content}`;
    if (mode === 'improve') prompt = `Fix grammar and improve clarity: ${content}`;
    if (mode === 'tags') prompt = `Generate 3 single-word tags separated by commas: ${content}`;

   const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    // Change this line from mixtral to llama
    model: "llama-3.3-70b-versatile", 
    messages: [{ role: "user", content: prompt }],
  }),
});

    const data = await response.json();
    
    if (!response.ok) throw new Error(data.error?.message || "Groq Error");

    const aiText = data.choices[0].message.content;
    return c.json({ output: aiText });

  } catch (err: any) {
    console.error("AI Error:", err.message);
    return c.json({ error: "AI failed", details: err.message }, 500);
  }
});

export const GET = handle(app);
export const POST = handle(app);
export const DELETE = handle(app); 
export const PATCH = handle(app);  