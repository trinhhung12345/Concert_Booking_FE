import apiClient from '@/lib/axios';
import type { SeatMap, SeatMapSection } from '../types/seatmap';

// Type definitions for API payloads
interface CreateSeatMapPayload {
  name: string;
  status: number;
  viewbox: string;
  showingId: number;
}

interface CreateSectionPayload {
  name: string;
  seatMapId: number;
  status: number;
  isStage: boolean;
  isSalable: boolean;
  isReservingSeat: boolean;
  message: string;
  ticketTypeId: number | null;
}

interface CreateSeatBatchPayload {
  sectionId: number;
  price: number;
  status: string;
  isSalable: boolean;
  rows: number;
  cols: number;
  startRow: number;
  startCol: number;
  codePrefix: string;
  overwrite: boolean;
}

interface CreateSectionAttributePayload {
  x: number;
  y: number;
  width: number;
  height: number;
  scaleX: number;
 scaleY: number;
 rotate: number;
  sectionId: number;
  fill: string;
}

interface CreateSeatMapElementPayload {
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
  data: string;
  display: number;
  sectionId: number;
}

export const seatMapService = {
  // Create a new seatmap
  createSeatMap: async (payload: CreateSeatMapPayload): Promise<SeatMap> => {
    return await apiClient.post('/seat-maps', payload);
  },

  // Get seatmap by ID
  getSeatMapById: async (id: number): Promise<SeatMap> => {
    return await apiClient.get(`/seat-maps/${id}`);
  },

  // Update seatmap
  updateSeatMap: async (id: number, payload: Partial<CreateSeatMapPayload>): Promise<SeatMap> => {
    return await apiClient.put(`/seat-maps/${id}`, payload);
  },

  // Delete seatmap
  deleteSeatMap: async (id: number): Promise<void> => {
    return await apiClient.delete(`/seat-maps/${id}`);
  },

  // Create a new section
  createSection: async (payload: CreateSectionPayload): Promise<SeatMapSection> => {
    return await apiClient.post('/seat-map-sections', payload);
  },

  // Update section
  updateSection: async (id: number, payload: Partial<CreateSectionPayload>): Promise<SeatMapSection> => {
    return await apiClient.put(`/seat-map-sections/${id}`, payload);
  },

  // Delete section
  deleteSection: async (id: number): Promise<void> => {
    return await apiClient.delete(`/seat-map-sections/${id}`);
  },

  // Create seats in batch
  createSeatsBatch: async (payload: CreateSeatBatchPayload): Promise<any> => {
    return await apiClient.post('/seats/batch', payload);
  },

  // Create section attribute
  createSectionAttribute: async (payload: CreateSectionAttributePayload): Promise<any> => {
    return await apiClient.post('/seat-map/section-attributes', payload);
  },

  // Create seatmap element
  createSeatMapElement: async (payload: CreateSeatMapElementPayload): Promise<any> => {
    return await apiClient.post('/seat-map-elements', payload);
  },

  // Get all seatmaps for a showing
  getSeatMapsByShowingId: async (showingId: number): Promise<SeatMap[]> => {
    return await apiClient.get('/seat-maps', {
      params: { showingId }
    });
  },

  // Get all seatmaps for a showing using the new v1 API
  getSeatMapsByShowingIdV1: async (showingId: number): Promise<SeatMap[]> => {
    return await apiClient.get(`/seat-maps/showings/${showingId}`);
  }
};
