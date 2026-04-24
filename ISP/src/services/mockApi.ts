/**
 * Mock API Utility
 * Simulates backend API calls using localStorage with realistic delays
 */

const API_DELAY = 500; // 500ms delay to simulate network

// Helper to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Get all items from localStorage with optional filtering
 */
export async function getAll<T>(
  storageKey: string,
  filters?: { status?: string; search?: string }
): Promise<T[]> {
  await delay(API_DELAY);
  
  try {
    const data = localStorage.getItem(storageKey);
    if (!data) return [];
    
    let items: T[] = JSON.parse(data);
    
    // Apply filters if provided
    if (filters) {
      if (filters.status) {
        items = items.filter((item: any) => item.status === filters.status);
      }
      
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        items = items.filter((item: any) => {
          return Object.values(item).some(value =>
            String(value).toLowerCase().includes(searchTerm)
          );
        });
      }
    }

    // Sort by createdAt descending by default (newest first)
    items.sort((a: any, b: any) => {
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();
      return dateB - dateA;
    });
    
    return items;
  } catch (error) {
    console.error(`Error fetching from ${storageKey}:`, error);
    return [];
  }
}

/**
 * Get single item by ID
 */
export async function getById<T>(
  storageKey: string,
  id: string
): Promise<T | null> {
  await delay(API_DELAY);
  
  try {
    const data = localStorage.getItem(storageKey);
    if (!data) return null;
    
    const items: T[] = JSON.parse(data);
    const item = items.find((item: any) => item.id === id);
    
    return item || null;
  } catch (error) {
    console.error(`Error fetching item from ${storageKey}:`, error);
    return null;
  }
}

/**
 * Create new item
 */
export async function create<T>(
  storageKey: string,
  data: any
): Promise<T> {
  await delay(API_DELAY);
  
  try {
    const storageData = localStorage.getItem(storageKey);
    const items: any[] = storageData ? JSON.parse(storageData) : [];
    
    // Auto-generate customerId if it's for the customers table and missing
    let additionalData: any = {};
    if (storageKey === 'isp_customers' && !data.customerId) {
      const nextId = items.length + 1;
      additionalData.customerId = `ISP${String(nextId).padStart(5, '0')}`;
    }

    // Default status if missing
    if (!data.status) {
      additionalData.status = 'active';
    }

    // Default balance if missing
    if (data.balance === undefined) {
      additionalData.balance = 0;
    }

    // Default expiryDate if missing
    if (!data.expiryDate) {
      const expiry = new Date();
      expiry.setFullYear(expiry.getFullYear() + 1);
      additionalData.expiryDate = expiry.toISOString();
    }
    
    const newItem = {
      ...data,
      ...additionalData,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    items.push(newItem);
    localStorage.setItem(storageKey, JSON.stringify(items));
    
    return newItem as T;
  } catch (error) {
    console.error(`Error creating item in ${storageKey}:`, error);
    throw new Error('Failed to create item');
  }
}

/**
 * Update existing item
 */
export async function update<T>(
  storageKey: string,
  id: string,
  data: Partial<any>
): Promise<T> {
  await delay(API_DELAY);
  
  try {
    const storageData = localStorage.getItem(storageKey);
    if (!storageData) {
      throw new Error('Item not found');
    }
    
    const items: any[] = JSON.parse(storageData);
    const index = items.findIndex((item: any) => item.id === id);
    
    if (index === -1) {
      throw new Error('Item not found');
    }
    
    items[index] = {
      ...items[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    
    localStorage.setItem(storageKey, JSON.stringify(items));
    
    return items[index] as T;
  } catch (error) {
    console.error(`Error updating item in ${storageKey}:`, error);
    throw new Error('Failed to update item');
  }
}

/**
 * Delete item
 */
export async function remove(
  storageKey: string,
  id: string
): Promise<void> {
  await delay(API_DELAY);
  
  try {
    const storageData = localStorage.getItem(storageKey);
    if (!storageData) {
      throw new Error('Item not found');
    }
    
    const items: any[] = JSON.parse(storageData);
    const filteredItems = items.filter((item: any) => item.id !== id);
    
    if (filteredItems.length === items.length) {
      throw new Error('Item not found');
    }
    
    localStorage.setItem(storageKey, JSON.stringify(filteredItems));
  } catch (error) {
    console.error(`Error deleting item from ${storageKey}:`, error);
    throw new Error('Failed to delete item');
  }
}

/**
 * Bulk delete items
 */
export async function bulkDelete(
  storageKey: string,
  ids: string[]
): Promise<void> {
  await delay(API_DELAY);
  
  try {
    const storageData = localStorage.getItem(storageKey);
    if (!storageData) return;
    
    const items: any[] = JSON.parse(storageData);
    const filteredItems = items.filter((item: any) => !ids.includes(item.id));
    
    localStorage.setItem(storageKey, JSON.stringify(filteredItems));
  } catch (error) {
    console.error(`Error bulk deleting from ${storageKey}:`, error);
    throw new Error('Failed to delete items');
  }
}

/**
 * Generate unique ID
 */
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Clear all data for a storage key
 */
export async function clear(storageKey: string): Promise<void> {
  await delay(API_DELAY);
  localStorage.removeItem(storageKey);
}

/**
 * Get statistics/count
 */
export async function getStats(
  storageKey: string,
  filters?: { status?: string }
): Promise<number> {
  await delay(API_DELAY / 2);
  
  try {
    const data = localStorage.getItem(storageKey);
    if (!data) return 0;
    
    const items: any[] = JSON.parse(data);
    
    if (filters?.status) {
      return items.filter((item: any) => item.status === filters.status).length;
    }
    
    return items.length;
  } catch (error) {
    console.error(`Error getting stats from ${storageKey}:`, error);
    return 0;
  }
}

/**
 * Bulk create items
 */
export async function bulkCreate<T>(
  storageKey: string,
  dataList: any[]
): Promise<T[]> {
  await delay(API_DELAY);
  
  try {
    const storageData = localStorage.getItem(storageKey);
    const items: any[] = storageData ? JSON.parse(storageData) : [];
    const newItems: any[] = [];

    const now = new Date().toISOString();
    const expiry = new Date();
    expiry.setFullYear(expiry.getFullYear() + 1);
    const expiryStr = expiry.toISOString();
    
    dataList.forEach((data, index) => {
      let additionalData: any = {};
      
      if (storageKey === 'isp_customers' && !data.customerId) {
        const nextId = items.length + newItems.length + 1;
        additionalData.customerId = `ISP${String(nextId).padStart(5, '0')}`;
      }

      if (!data.status) additionalData.status = 'active';
      if (data.balance === undefined) additionalData.balance = 0;
      if (!data.expiryDate) additionalData.expiryDate = expiryStr;

      const newItem = {
        ...data,
        ...additionalData,
        id: generateId() + index, // Ensure uniqueness in bulk
        createdAt: now,
        updatedAt: now,
      };
      
      newItems.push(newItem);
    });
    
    const updatedItems = [...items, ...newItems];
    localStorage.setItem(storageKey, JSON.stringify(updatedItems));
    
    return newItems as T[];
  } catch (error) {
    console.error(`Error bulk creating in ${storageKey}:`, error);
    throw new Error('Failed to bulk create items');
  }
}

// Export as mockApi object
export const mockApi = {
  getAll,
  getById,
  create,
  bulkCreate,
  update,
  remove,
  bulkDelete,
  clear,
  getStats,
};
