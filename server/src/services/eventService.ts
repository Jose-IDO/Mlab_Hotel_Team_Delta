import { eventRepository } from "../repositories/eventRepository";

export const eventService = {
  getAll: () => eventRepository.findAll(),
  create: (data: any) => eventRepository.create(data),
  delete: (id: string) => eventRepository.delete(id),
};