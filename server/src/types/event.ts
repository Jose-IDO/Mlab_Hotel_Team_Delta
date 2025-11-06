// types/Event.ts
export interface EventInput {
  title: string;
  date: string;
  description: string;
  imageUrl?: string; // use camelCase for TS convention
}