import axios from '@/lib/axios';
import type { SeatMap, Section, SectionAttribute, Seat, SeatMapElement } from '../types/seatmap';

export const seatMapService = {
  // Seat Map CRUD operations
  createSeatMap: async (payload: Omit<SeatMap, 'id'>): Promise<SeatMap> => {
    const response = await axios.post('/seat-maps', payload);
    // Note: Due to axios interceptor, response is already the data from server
    if (response && typeof response === 'object' && 'id' in response) {
      return response as unknown as SeatMap; // Direct response
    } else if (response && typeof response === 'object' && 'data' in response && response.data && typeof response.data === 'object' && 'id' in response.data) {
      return response.data as unknown as SeatMap; // Wrapped response
    } else {
      // Fallback to response if it looks like a valid SeatMap object
      if (response && typeof response === 'object' && 'id' in response) {
        return response as unknown as SeatMap;
      }
      throw new Error('Invalid response format from server');
    }
  },

  getSeatMapById: async (id: number): Promise<SeatMap> => {
    const response = await axios.get(`/seat-maps/${id}`);
    // Note: Due to axios interceptor, response is already the data from server
    if (response && typeof response === 'object' && 'id' in response) {
      return response as unknown as SeatMap; // Direct response
    } else if (response && typeof response === 'object' && 'data' in response && response.data && typeof response.data === 'object' && 'id' in response.data) {
      return response.data as unknown as SeatMap; // Wrapped response
    } else {
      // Fallback to response if it looks like a valid SeatMap object
      if (response && typeof response === 'object' && 'id' in response) {
        return response as unknown as SeatMap;
      }
      throw new Error('Invalid response format from server');
    }
  },

  updateSeatMap: async (id: number, payload: Partial<SeatMap>): Promise<SeatMap> => {
    const response = await axios.put(`/seat-maps/${id}`, payload);
    // Note: Due to axios interceptor, response is already the data from server
    if (response && typeof response === 'object' && 'id' in response) {
      return response as unknown as SeatMap; // Direct response
    } else if (response && typeof response === 'object' && 'data' in response && response.data && typeof response.data === 'object' && 'id' in response.data) {
      return response.data as unknown as SeatMap; // Wrapped response
    } else {
      // Fallback to response if it looks like a valid SeatMap object
      if (response && typeof response === 'object' && 'id' in response) {
        return response as unknown as SeatMap;
      }
      throw new Error('Invalid response format from server');
    }
  },

  // Alternative API route for seat maps by showing ID
 getSeatMapsByShowingId: async (showingId: number): Promise<SeatMap[]> => {
    const response = await axios.get(`/seat-maps/showings/${showingId}`);
    // Note: Due to axios interceptor, response is already the data from server
    // The interceptor in lib/axios.ts does: (response) => response.data
    if (Array.isArray(response)) {
      return response; // Response is directly an array (empty or populated)
    } else if (response && typeof response === 'object' && 'data' in response && Array.isArray(response.data)) {
      return response.data; // Wrapped response
    } else if (response && typeof response === 'object' && 'data' in response && response.data === null) {
      return []; // Wrapped response with null data (treat as empty)
    } else {
      // If we still don't have a valid format, try to handle gracefully
      console.warn('Unexpected response format from getSeatMapsByShowingId:', response);
      // Return empty array as fallback to prevent breaking the UI
      return [];
    }
  },

  // Section CRUD operations
  createSection: async (payload: Omit<Section, 'id'>): Promise<Section> => {
    const response = await axios.post('/seat-map-sections', payload);
    // Note: Due to axios interceptor, response is already the data from server
    if (response && typeof response === 'object' && 'id' in response) {
      return response as unknown as Section; // Direct response
    } else if (response && typeof response === 'object' && 'data' in response && response.data && typeof response.data === 'object' && 'id' in response.data) {
      return response.data as unknown as Section; // Wrapped response
    } else {
      // Fallback to response if it looks like a valid Section object
      if (response && typeof response === 'object' && 'id' in response) {
        return response as unknown as Section;
      }
      throw new Error('Invalid response format from server');
    }
  },

  getSectionById: async (id: number): Promise<Section> => {
    const response = await axios.get(`/seat-map-sections/${id}`);
    // Note: Due to axios interceptor, response is already the data from server
    if (response && typeof response === 'object' && 'id' in response) {
      return response as unknown as Section; // Direct response
    } else if (response && typeof response === 'object' && 'data' in response && response.data && typeof response.data === 'object' && 'id' in response.data) {
      return response.data as unknown as Section; // Wrapped response
    } else {
      // Fallback to response if it looks like a valid Section object
      if (response && typeof response === 'object' && 'id' in response) {
        return response as unknown as Section;
      }
      throw new Error('Invalid response format from server');
    }
  },

  updateSection: async (id: number, payload: Partial<Section>): Promise<Section> => {
    const response = await axios.put(`/seat-map-sections/${id}`, payload);
    // Note: Due to axios interceptor, response is already the data from server
    if (response && typeof response === 'object' && 'id' in response) {
      return response as unknown as Section; // Direct response
    } else if (response && typeof response === 'object' && 'data' in response && response.data && typeof response.data === 'object' && 'id' in response.data) {
      return response.data as unknown as Section; // Wrapped response
    } else {
      // Fallback to response if it looks like a valid Section object
      if (response && typeof response === 'object' && 'id' in response) {
        return response as unknown as Section;
      }
      throw new Error('Invalid response format from server');
    }
  },

  // Section Attribute CRUD operations
  createSectionAttribute: async (payload: Omit<SectionAttribute, 'id'>): Promise<SectionAttribute> => {
    const response = await axios.post('/seat-map/section-attributes', payload);
    // Note: Due to axios interceptor, response is already the data from server
    if (response && typeof response === 'object' && 'x' in response) {
      return response as unknown as SectionAttribute; // Direct response (SectionAttribute has x property)
    } else if (response && typeof response === 'object' && 'data' in response && response.data && typeof response.data === 'object' && 'x' in response.data) {
      return response.data as unknown as SectionAttribute; // Wrapped response
    } else {
      // Fallback to response if it looks like a valid SectionAttribute object
      if (response && typeof response === 'object' && 'x' in response) {
        return response as unknown as SectionAttribute;
      }
      throw new Error('Invalid response format from server');
    }
  },

  getSectionAttributeById: async (id: number): Promise<SectionAttribute> => {
    const response = await axios.get(`/seat-map/section-attributes/${id}`);
    // Note: Due to axios interceptor, response is already the data from server
    if (response && typeof response === 'object' && 'x' in response) {
      return response as unknown as SectionAttribute; // Direct response (SectionAttribute has x property)
    } else if (response && typeof response === 'object' && 'data' in response && response.data && typeof response.data === 'object' && 'x' in response.data) {
      return response.data as unknown as SectionAttribute; // Wrapped response
    } else {
      // Fallback to response if it looks like a valid SectionAttribute object
      if (response && typeof response === 'object' && 'x' in response) {
        return response as unknown as SectionAttribute;
      }
      throw new Error('Invalid response format from server');
    }
  },

  // Get section attribute by section ID
  getSectionAttributeBySectionId: async (sectionId: number): Promise<SectionAttribute> => {
    const response = await axios.get(`/seat-map/section-attributes/${sectionId}`);
    // Handle wrapped response format: { code: 200, data: {...}, message: "..." }
    if (response && typeof response === 'object' && 'data' in response && response.data && typeof response.data === 'object' && 'data' in response.data && response.data.data) {
      // Return the inner data which contains the SectionAttribute with ID
      // Since the endpoint returns attribute by section ID, the response data is the attribute itself
      // The ID of the attribute can be retrieved from the sectionId parameter passed in
      const attributeData = response.data.data as any;
      // Try to return the attribute with the ID if it exists in the response, otherwise return without ID
      return attributeData as SectionAttribute;
    } else if (response && typeof response === 'object' && 'data' in response && response.data && typeof response.data === 'object' && 'x' in response.data) {
      // Direct response with SectionAttribute properties
      return response.data as unknown as SectionAttribute;
    } else if (response && typeof response === 'object' && 'x' in response) {
      // Direct response
      return response as unknown as SectionAttribute;
    } else {
      throw new Error('Invalid response format from server');
    }
  },

  // Get section attribute ID by section ID (helper method to get the attribute ID)
  getSectionAttributeIdBySectionId: async (sectionId: number): Promise<number | null> => {
    try {
      // Try to get the attribute and check if it has an ID field
      const response = await axios.get(`/seat-map/section-attributes/${sectionId}`);
      if (response && typeof response === 'object' && 'data' in response && response.data && typeof response.data === 'object' && 'data' in response.data && response.data.data) {
        // The attribute object is in response.data.data
        const attributeData = response.data.data as any;
        if (attributeData && attributeData.id) {
          return attributeData.id;
        } else {
          // If the attribute doesn't have an ID field, we can't return an ID
          // This suggests the attribute exists but doesn't have a separate ID
          // We might need to create a new one instead of updating
          return null;
        }
      }
    } catch (error) {
      // If there's an error, it means the attribute might not exist
      return null;
    }
    return null;
 },

  updateSectionAttribute: async (payload: Partial<SectionAttribute>): Promise<SectionAttribute> => {
    const response = await axios.put(`/seat-map/section-attributes`, payload);
    // Note: Due to axios interceptor, response is already the data from server
    if (response && typeof response === 'object' && 'x' in response) {
      return response as unknown as SectionAttribute; // Direct response (SectionAttribute has x property)
    } else if (response && typeof response === 'object' && 'data' in response && response.data && typeof response.data === 'object' && 'x' in response.data) {
      return response.data as unknown as SectionAttribute; // Wrapped response
    } else {
      // Fallback to response if it looks like a valid SectionAttribute object
      if (response && typeof response === 'object' && 'x' in response) {
        return response as unknown as SectionAttribute;
      }
      throw new Error('Invalid response format from server');
    }
  },

  // Seat CRUD operations
  createSeat: async (payload: Omit<Seat, 'id'>): Promise<Seat> => {
    const response = await axios.post('/seats', payload);
    // Note: Due to axios interceptor, response is already the data from server
    if (response && typeof response === 'object' && 'id' in response) {
      return response as unknown as Seat; // Direct response
    } else if (response && typeof response === 'object' && 'data' in response && response.data && typeof response.data === 'object' && 'id' in response.data) {
      return response.data as unknown as Seat; // Wrapped response
    } else {
      // Fallback to response if it looks like a valid Seat object
      if (response && typeof response === 'object' && 'id' in response) {
        return response as unknown as Seat;
      }
      throw new Error('Invalid response format from server');
    }
  },

  getSeatById: async (id: number): Promise<Seat> => {
    const response = await axios.get(`/seats/${id}`);
    // Note: Due to axios interceptor, response is already the data from server
    if (response && typeof response === 'object' && 'id' in response) {
      return response as unknown as Seat; // Direct response
    } else if (response && typeof response === 'object' && 'data' in response && response.data && typeof response.data === 'object' && 'id' in response.data) {
      return response.data as unknown as Seat; // Wrapped response
    } else {
      // Fallback to response if it looks like a valid Seat object
      if (response && typeof response === 'object' && 'id' in response) {
        return response as unknown as Seat;
      }
      throw new Error('Invalid response format from server');
    }
  },

  updateSeat: async (id: number, payload: Partial<Seat>): Promise<Seat> => {
    const response = await axios.put(`/seats/${id}`, payload);
    // Note: Due to axios interceptor, response is already the data from server
    if (response && typeof response === 'object' && 'id' in response) {
      return response as unknown as Seat; // Direct response
    } else if (response && typeof response === 'object' && 'data' in response && response.data && typeof response.data === 'object' && 'id' in response.data) {
      return response.data as unknown as Seat; // Wrapped response
    } else {
      // Fallback to response if it looks like a valid Seat object
      if (response && typeof response === 'object' && 'id' in response) {
        return response as unknown as Seat;
      }
      throw new Error('Invalid response format from server');
    }
  },

  // Batch operations for seats
  createSeatsBatch: async (payload: {
    sectionId: number;
    price: number;
    status: 'AVAILABLE' | 'BOOKED' | 'SELECTED' | 'SOLD';
    isSalable: boolean;
    rows: number;
    cols: number;
    startRow: number;
    startCol: number;
    codePrefix: string;
    overwrite: boolean;
  }): Promise<Seat[]> => {
    const response = await axios.post('/seats/batch', payload);
    // Note: Due to axios interceptor, response is already the data from server
    if (Array.isArray(response)) {
      return response as unknown as Seat[]; // Direct response
    } else if (response && typeof response === 'object' && 'data' in response && Array.isArray(response.data)) {
      return response.data as unknown as Seat[]; // Wrapped response
    } else {
      // Fallback to response if it looks like a valid Seat array
      if (Array.isArray(response)) {
        return response as unknown as Seat[];
      }
      throw new Error('Invalid response format from server');
    }
  },

  getSeatsBySectionId: async (sectionId: number): Promise<Seat[]> => {
    const response = await axios.get(`/seats/section/${sectionId}`);
    // Note: Due to axios interceptor, response is already the data from server
    if (Array.isArray(response)) {
      return response as unknown as Seat[]; // Direct response
    } else if (response && typeof response === 'object' && 'data' in response && Array.isArray(response.data)) {
      return response.data as unknown as Seat[]; // Wrapped response
    } else {
      // Fallback to response if it looks like a valid Seat array
      if (Array.isArray(response)) {
        return response as unknown as Seat[];
      }
      throw new Error('Invalid response format from server');
    }
  },

  // Seat Map Element CRUD operations
  createSeatMapElement: async (payload: Omit<SeatMapElement, 'id'>): Promise<SeatMapElement> => {
    const response = await axios.post('/seat-map/elements', payload);
    // Note: Due to axios interceptor, response is already the data from server
    if (response && typeof response === 'object' && 'id' in response) {
      return response as unknown as SeatMapElement; // Direct response
    } else if (response && typeof response === 'object' && 'data' in response && response.data && typeof response.data === 'object' && 'id' in response.data) {
      return response.data as unknown as SeatMapElement; // Wrapped response
    } else {
      // Fallback to response if it looks like a valid SeatMapElement object
      if (response && typeof response === 'object' && 'id' in response) {
        return response as unknown as SeatMapElement;
      }
      throw new Error('Invalid response format from server');
    }
  },

  getSeatMapElementById: async (id: number): Promise<SeatMapElement> => {
    const response = await axios.get(`/seat-map/elements/${id}`);
    // Note: Due to axios interceptor, response is already the data from server
    if (response && typeof response === 'object' && 'id' in response) {
      return response as unknown as SeatMapElement; // Direct response
    } else if (response && typeof response === 'object' && 'data' in response && response.data && typeof response.data === 'object' && 'id' in response.data) {
      return response.data as unknown as SeatMapElement; // Wrapped response
    } else {
      // Fallback to response if it looks like a valid SeatMapElement object
      if (response && typeof response === 'object' && 'id' in response) {
        return response as unknown as SeatMapElement;
      }
      throw new Error('Invalid response format from server');
    }
  },

  getSeatMapElementsBySectionId: async (sectionId: number): Promise<SeatMapElement[]> => {
    const response = await axios.get(`/seat-map/elements/${sectionId}`);
    // Note: Due to axios interceptor, response is already the data from server
    if (Array.isArray(response)) {
      return response as unknown as SeatMapElement[]; // Direct response
    } else if (response && typeof response === 'object' && 'data' in response && Array.isArray(response.data)) {
      return response.data as unknown as SeatMapElement[]; // Wrapped response
    } else {
      // Fallback to response if it looks like a valid SeatMapElement array
      if (Array.isArray(response)) {
        return response as unknown as SeatMapElement[];
      }
      throw new Error('Invalid response format from server');
    }
  },

  updateSeatMapElement: async (id: number, payload: Partial<SeatMapElement>): Promise<SeatMapElement> => {
    const response = await axios.put(`/seat-map/elements/${id}`, payload);
    // Note: Due to axios interceptor, response is already the data from server
    if (response && typeof response === 'object' && 'id' in response) {
      return response as unknown as SeatMapElement; // Direct response
    } else if (response && typeof response === 'object' && 'data' in response && response.data && typeof response.data === 'object' && 'id' in response.data) {
      return response.data as unknown as SeatMapElement; // Wrapped response
    } else {
      // Fallback to response if it looks like a valid SeatMapElement object
      if (response && typeof response === 'object' && 'id' in response) {
        return response as unknown as SeatMapElement;
      }
      throw new Error('Invalid response format from server');
    }
  },

  // Additional API endpoints based on provided specifications
  getSeatMapElements: async (sectionId: number): Promise<SeatMapElement[]> => {
    const response = await axios.get(`/seat-map/elements/${sectionId}`);
    // Note: Due to axios interceptor, response is already the data from server
    if (Array.isArray(response)) {
      return response as unknown as SeatMapElement[]; // Direct response
    } else if (response && typeof response === 'object' && 'data' in response && Array.isArray(response.data)) {
      return response.data as unknown as SeatMapElement[]; // Wrapped response
    } else {
      // Fallback to response if it looks like a valid SeatMapElement array
      if (Array.isArray(response)) {
        return response as unknown as SeatMapElement[];
      }
      throw new Error('Invalid response format from server');
    }
  },

  updateSeatMapSection: async (id: number, payload: Partial<Section>): Promise<Section> => {
    const response = await axios.put(`/seat-map-sections/${id}`, payload);
    // Note: Due to axios interceptor, response is already the data from server
    if (response && typeof response === 'object' && 'id' in response) {
      return response as unknown as Section; // Direct response
    } else if (response && typeof response === 'object' && 'data' in response && response.data && typeof response.data === 'object' && 'id' in response.data) {
      return response.data as unknown as Section; // Wrapped response
    } else {
      // Fallback to response if it looks like a valid Section object
      if (response && typeof response === 'object' && 'id' in response) {
        return response as unknown as Section;
      }
      throw new Error('Invalid response format from server');
    }
  },

  // Soft delete operations
  softDeleteSeat: async (id: number): Promise<Seat> => {
    const response = await axios.put(`/seats/${id}`, { status: 'UNAVAILABLE' });
    // Note: Due to axios interceptor, response is already the data from server
    if (response && typeof response === 'object' && 'id' in response) {
      return response as unknown as Seat; // Direct response
    } else if (response && typeof response === 'object' && 'data' in response && response.data && typeof response.data === 'object' && 'id' in response.data) {
      return response.data as unknown as Seat; // Wrapped response
    } else {
      // Fallback to response if it looks like a valid Seat object
      if (response && typeof response === 'object' && 'id' in response) {
        return response as unknown as Seat;
      }
      throw new Error('Invalid response format from server');
    }
  },

  softDeleteSeatMapElement: async (id: number): Promise<SeatMapElement> => {
    const response = await axios.put(`/seat-map/elements/${id}`, { display: 0 });
    // Note: Due to axios interceptor, response is already the data from server
    if (response && typeof response === 'object' && 'id' in response) {
      return response as unknown as SeatMapElement; // Direct response
    } else if (response && typeof response === 'object' && 'data' in response && response.data && typeof response.data === 'object' && 'id' in response.data) {
      return response.data as unknown as SeatMapElement; // Wrapped response
    } else {
      // Fallback to response if it looks like a valid SeatMapElement object
      if (response && typeof response === 'object' && 'id' in response) {
        return response as unknown as SeatMapElement;
      }
      throw new Error('Invalid response format from server');
    }
  },

  softDeleteSection: async (id: number): Promise<Section> => {
    const response = await axios.put(`/seat-map-sections/${id}`, { status: 0 });
    // Note: Due to axios interceptor, response is already the data from server
    if (response && typeof response === 'object' && 'id' in response) {
      return response as unknown as Section; // Direct response
    } else if (response && typeof response === 'object' && 'data' in response && response.data && typeof response.data === 'object' && 'id' in response.data) {
      return response.data as unknown as Section; // Wrapped response
    } else {
      // Fallback to response if it looks like a valid Section object
      if (response && typeof response === 'object' && 'id' in response) {
        return response as unknown as Section;
      }
      throw new Error('Invalid response format from server');
    }
  },

  softDeleteSeatMap: async (id: number): Promise<SeatMap> => {
    const response = await axios.put(`/seat-maps/${id}`, { status: 0 });
    // Note: Due to axios interceptor, response is already the data from server
    if (response && typeof response === 'object' && 'id' in response) {
      return response as unknown as SeatMap; // Direct response
    } else if (response && typeof response === 'object' && 'data' in response && response.data && typeof response.data === 'object' && 'id' in response.data) {
      return response.data as unknown as SeatMap; // Wrapped response
    } else {
      // Fallback to response if it looks like a valid SeatMap object
      if (response && typeof response === 'object' && 'id' in response) {
        return response as unknown as SeatMap;
      }
      throw new Error('Invalid response format from server');
    }
  },

  softDeleteSectionAttribute: async (id: number): Promise<SectionAttribute> => {
    const response = await axios.put(`/seat-map/section-attributes/${id}`, { 
      x: null, 
      y: null, 
      width: null, 
      height: null, 
      scaleX: null, 
      scaleY: null, 
      rotate: null, 
      fill: null
    });
    // Note: Due to axios interceptor, response is already the data from server
    if (response && typeof response === 'object' && 'x' in response) {
      return response as unknown as SectionAttribute; // Direct response (SectionAttribute has x property)
    } else if (response && typeof response === 'object' && 'data' in response && response.data && typeof response.data === 'object' && 'x' in response.data) {
      return response.data as unknown as SectionAttribute; // Wrapped response
    } else {
      // Fallback to response if it looks like a valid SectionAttribute object
      if (response && typeof response === 'object' && 'x' in response) {
        return response as unknown as SectionAttribute;
      }
      throw new Error('Invalid response format from server');
    }
  },

  // Additional methods for updating specific fields without full deletion
  updateSeatStatus: async (id: number, status: 'AVAILABLE' | 'BOOKED' | 'SELECTED' | 'SOLD' | 'UNAVAILABLE'): Promise<Seat> => {
    const response = await axios.put(`/seats/${id}`, { status });
    // Note: Due to axios interceptor, response is already the data from server
    if (response && typeof response === 'object' && 'id' in response) {
      return response as unknown as Seat; // Direct response
    } else if (response && typeof response === 'object' && 'data' in response && response.data && typeof response.data === 'object' && 'id' in response.data) {
      return response.data as unknown as Seat; // Wrapped response
    } else {
      // Fallback to response if it looks like a valid Seat object
      if (response && typeof response === 'object' && 'id' in response) {
        return response as unknown as Seat;
      }
      throw new Error('Invalid response format from server');
    }
  },

  updateSeatMapElementDisplay: async (id: number, display: number): Promise<SeatMapElement> => {
    const response = await axios.put(`/seat-map/elements/${id}`, { display });
    // Note: Due to axios interceptor, response is already the data from server
    if (response && typeof response === 'object' && 'id' in response) {
      return response as unknown as SeatMapElement; // Direct response
    } else if (response && typeof response === 'object' && 'data' in response && response.data && typeof response.data === 'object' && 'id' in response.data) {
      return response.data as unknown as SeatMapElement; // Wrapped response
    } else {
      // Fallback to response if it looks like a valid SeatMapElement object
      if (response && typeof response === 'object' && 'id' in response) {
        return response as unknown as SeatMapElement;
      }
      throw new Error('Invalid response format from server');
    }
  },

  updateSectionStatus: async (id: number, status: number): Promise<Section> => {
    const response = await axios.put(`/seat-map-sections/${id}`, { status });
    // Note: Due to axios interceptor, response is already the data from server
    if (response && typeof response === 'object' && 'id' in response) {
      return response as unknown as Section; // Direct response
    } else if (response && typeof response === 'object' && 'data' in response && response.data && typeof response.data === 'object' && 'id' in response.data) {
      return response.data as unknown as Section; // Wrapped response
    } else {
      // Fallback to response if it looks like a valid Section object
      if (response && typeof response === 'object' && 'id' in response) {
        return response as unknown as Section;
      }
      throw new Error('Invalid response format from server');
    }
  },

  updateSeatMapStatus: async (id: number, status: number): Promise<SeatMap> => {
    const response = await axios.put(`/seat-maps/${id}`, { status });
    // Note: Due to axios interceptor, response is already the data from server
    if (response && typeof response === 'object' && 'id' in response) {
      return response as unknown as SeatMap; // Direct response
    } else if (response && typeof response === 'object' && 'data' in response && response.data && typeof response.data === 'object' && 'id' in response.data) {
      return response.data as unknown as SeatMap; // Wrapped response
    } else {
      // Fallback to response if it looks like a valid SeatMap object
      if (response && typeof response === 'object' && 'id' in response) {
        return response as unknown as SeatMap;
      }
      throw new Error('Invalid response format from server');
    }
  },
};
