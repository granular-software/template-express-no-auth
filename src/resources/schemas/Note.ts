import { z } from "zod";

export const NoteSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  authorId: z.string().optional(),
  createdAt: z.date(),
});

export type Note = z.infer<typeof NoteSchema>;