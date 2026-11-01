export type InstalledExtension = {
  url: string;
  name: string;
  internalName: string;
  version: number | null;
  pluginClassName: string;
  requiresResources: boolean;
  installedAt: number;
  packageBytes: ArrayBuffer;
  checksum: string;
};

const DB_NAME = 'cloudstream-web';
const STORE_NAME = 'extensions';

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) db.createObjectStore(STORE_NAME, { keyPath: 'url' });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function getInstalledExtensions(): Promise<InstalledExtension[]> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const request = db.transaction(STORE_NAME, 'readonly').objectStore(STORE_NAME).getAll();
    request.onsuccess = () => resolve(request.result as InstalledExtension[]);
    request.onerror = () => reject(request.error);
  });
}

export async function saveInstalledExtension(extension: InstalledExtension): Promise<void> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const request = db.transaction(STORE_NAME, 'readwrite').objectStore(STORE_NAME).put(extension);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function removeInstalledExtension(url: string): Promise<void> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const request = db.transaction(STORE_NAME, 'readwrite').objectStore(STORE_NAME).delete(url);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}
