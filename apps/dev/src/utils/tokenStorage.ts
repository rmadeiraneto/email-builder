/**
 * IndexedDB utility for storing and retrieving custom design token values
 */

const DB_NAME = 'EmailBuilderTokens';
const DB_VERSION = 1;
const STORE_NAME = 'customTokens';

export interface CustomTokens {
  [key: string]: any;
}

class TokenStorage {
  private db: IDBDatabase | null = null;

  /**
   * Initialize the IndexedDB database
   */
  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        reject(new Error('Failed to open IndexedDB'));
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create object store if it doesn't exist
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };
    });
  }

  /**
   * Save custom tokens to IndexedDB
   */
  async saveTokens(tokens: CustomTokens): Promise<void> {
    if (!this.db) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(tokens, 'customTokens');

      request.onerror = () => {
        reject(new Error('Failed to save tokens'));
      };

      request.onsuccess = () => {
        resolve();
      };
    });
  }

  /**
   * Load custom tokens from IndexedDB
   */
  async loadTokens(): Promise<CustomTokens | null> {
    if (!this.db) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get('customTokens');

      request.onerror = () => {
        reject(new Error('Failed to load tokens'));
      };

      request.onsuccess = () => {
        resolve(request.result || null);
      };
    });
  }

  /**
   * Clear all custom tokens from IndexedDB
   */
  async clearTokens(): Promise<void> {
    if (!this.db) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete('customTokens');

      request.onerror = () => {
        reject(new Error('Failed to clear tokens'));
      };

      request.onsuccess = () => {
        resolve();
      };
    });
  }

  /**
   * Check if custom tokens exist
   */
  async hasCustomTokens(): Promise<boolean> {
    const tokens = await this.loadTokens();
    return tokens !== null && Object.keys(tokens).length > 0;
  }
}

// Export singleton instance
export const tokenStorage = new TokenStorage();
