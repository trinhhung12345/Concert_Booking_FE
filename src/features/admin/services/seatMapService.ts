import axios from '@/lib/axios';
import type { SeatMap, Section, SectionAttribute, Seat, SeatMapElement } from '../types/seatmap';

export const seatMapService = {
  // Seat Map CRUD operations
  createSeatMap: async (payload: Omit<SeatMap, 'id'>): Promise<SeatMap> => {
    const response = await axios.post('/api/seat-map', payload);
    return response.data;
  },

  getSeatMapById: async (id: number): Promise<SeatMap> => {
    const response = await axios.get(`/api/seat-map/${id}`);
    return response.data;
  },

  updateSeatMap: async (id: number, payload: Partial<SeatMap>): Promise<SeatMap> => {
    const response = await axios.put(`/api/seat-map/${id}`, payload);
    return response.data;
  },

  deleteSeatMap: async (id: number): Promise<void> => {
    await axios.delete(`/api/seat-map/${id}`);
  },

  // Alternative API route for seat maps by showing ID
  getSeatMapsByShowingId: async (showingId: number): Promise<SeatMap[]> => {
    const response = await axios.get(`/seat-maps/showings/${showingId}`);
    return response.data;
  },

  // Section CRUD operations
  createSection: async (payload: Omit<Section, 'id'>): Promise<Section> => {
    const response = await axios.post('/api/seat-map-section', payload);
    return response.data;
  },

  getSectionById: async (id: number): Promise<Section> => {
    const response = await axios.get(`/api/seat-map-section/${id}`);
    return response.data;
  },

  updateSection: async (id: number, payload: Partial<Section>): Promise<Section> => {
    const response = await axios.put(`/api/seat-map-section/${id}`, payload);
    return response.data;
  },

  deleteSection: async (id: number): Promise<void> => {
    await axios.delete(`/api/seat-map-section/${id}`);
  },

  // Section Attribute CRUD operations
  createSectionAttribute: async (payload: Omit<SectionAttribute, 'id'>): Promise<SectionAttribute> => {
    const response = await axios.post('/api/seat-map-section-attribute', payload);
    return response.data;
  },

  getSectionAttributeById: async (id: number): Promise<SectionAttribute> => {
    const response = await axios.get(`/api/seat-map-section-attribute/${id}`);
    return response.data;
  },

  updateSectionAttribute: async (id: number, payload: Partial<SectionAttribute>): Promise<SectionAttribute> => {
    const response = await axios.put(`/api/seat-map-section-attribute/${id}`, payload);
    return response.data;
  },

  deleteSectionAttribute: async (id: number): Promise<void> => {
    await axios.delete(`/api/seat-map-section-attribute/${id}`);
  },

  // Seat CRUD operations
  createSeat: async (payload: Omit<Seat, 'id'>): Promise<Seat> => {
    const response = await axios.post('/api/seat', payload);
    return response.data;
  },

  getSeatById: async (id: number): Promise<Seat> => {
    const response = await axios.get(`/api/seat/${id}`);
    return response.data;
  },

  updateSeat: async (id: number, payload: Partial<Seat>): Promise<Seat> => {
    const response = await axios.put(`/api/seat/${id}`, payload);
    return response.data;
  },

  deleteSeat: async (id: number): Promise<void> => {
    await axios.delete(`/api/seat/${id}`);
  },

  // Batch operations for seats
  createSeatsBatch: async (payload: {
    sectionId: number;
    price: number;
    status: 'AVAILABLE' | 'BOOKED' | 'SELECTED';
    isSalable: boolean;
    rows: number;
    cols: number;
    startRow: number;
    startCol: number;
    codePrefix: string;
    overwrite: boolean;
  }): Promise<Seat[]> => {
    const response = await axios.post('/api/seat/batch', payload);
    return response.data;
  },

  getSeatsBySectionId: async (sectionId: number): Promise<Seat[]> => {
    const response = await axios.get(`/api/seat/section/${sectionId}`);
    return response.data;
  },

  // Seat Map Element CRUD operations
  createSeatMapElement: async (payload: Omit<SeatMapElement, 'id'>): Promise<SeatMapElement> => {
    const response = await axios.post('/api/seat-map/elements', payload);
    return response.data;
  },

  getSeatMapElementById: async (id: number): Promise<SeatMapElement> => {
    const response = await axios.get(`/api/seat-map/elements/${id}`);
    return response.data;
  },

  getSeatMapElementsBySectionId: async (sectionId: number): Promise<SeatMapElement[]> => {
    const response = await axios.get(`/api/seat-map/elements/section/${sectionId}`);
    return response.data;
  },

  updateSeatMapElement: async (id: number, payload: Partial<SeatMapElement>): Promise<SeatMapElement> => {
    const response = await axios.put(`/api/seat-map/elements/${id}`, payload);
    return response.data;
  },

  deleteSeatMapElement: async (id: number): Promise<void> => {
    await axios.delete(`/api/seat-map/elements/${id}`);
  }
};