import { z } from "zod";
import { createResource } from "mcpresso";
import { NoteSchema, type Note } from "../schemas/Note.js";

// In-memory storage (replace with your database)
const notes: Note[] = [
  {
    id: "1",
    title: "Welcome Note",
    content: "This is a public note that anyone can access.",
    authorId: "public",
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "2", 
    title: "Getting Started",
    content: "This server has no authentication - all data is public.",
    authorId: "public",
    createdAt: new Date("2024-01-02"),
  },
];

// Create the notes resource
export const noteResource = createResource({
  name: "note",
  schema: NoteSchema,
  uri_template: "notes/{id}",
  methods: {
    get: {
      description: "Get a note by ID (public access)",
      handler: async ({ id }) => {
        console.log(`Getting note ${id} (no auth required)`);
        return notes.find((note) => note.id === id);
      },
    },
    list: {
      description: "List all notes (public access) or filter by authorId",
      inputSchema: z.object({
        authorId: z.string().optional().describe("Filter notes by author ID"),
      }),
      handler: async ({ authorId }) => {
        console.log("Listing notes (no auth required)", authorId ? `filtered by author: ${authorId}` : "");
        if (authorId) {
          return notes.filter((note) => note.authorId === authorId);
        }
        return notes;
      },
    },
    create: {
      description: "Create a new note (public access)",
      inputSchema: z.object({
        title: z.string().describe("Note title"),
        content: z.string().describe("Note content"),
        authorId: z.string().optional().describe("Author ID (optional)"),
      }),
      handler: async (data) => {
        console.log("Creating note (no auth required):", data);
        
        const newNote = {
          id: (notes.length + 1).toString(),
          title: data.title || "Untitled",
          content: data.content || "",
          authorId: data.authorId || "anonymous",
          createdAt: new Date(),
        };
        
        notes.push(newNote);
        return newNote;
      },
    },
    delete: {
      description: "Delete a note (public access)",
      handler: async ({ id }) => {
        console.log(`Deleting note ${id} (no auth required)`);
        
        const index = notes.findIndex((note) => note.id === id);
        if (index === -1) {
          return { success: false };
        }
        
        notes.splice(index, 1);
        return { success: true };
      },
    },
    search: {
      description: "Search notes by content (public access)",
      inputSchema: z.object({
        query: z.string().describe("Search query"),
        authorId: z.string().optional().describe("Filter by author ID"),
      }),
      handler: async ({ query, authorId }) => {
        console.log(`Searching notes for "${query}" (no auth required)`, authorId ? `filtered by author: ${authorId}` : "");
        let filteredNotes = notes;
        
        if (authorId) {
          filteredNotes = notes.filter((note) => note.authorId === authorId);
        }
        
        return filteredNotes.filter((note) => 
          note.content.toLowerCase().includes(query.toLowerCase()) ||
          note.title.toLowerCase().includes(query.toLowerCase())
        );
      },
    },
  },
});