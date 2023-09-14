import localForage from 'localforage';

import { isBrowser } from './utils';

export const clientCache = new Map<string, LocalForage>();

/**
 * Drop the localForage instance
 */
export function dropDataStore(config: LocalForageOptions = {}) {
  if (!isBrowser) {
    return;
  }
  let client: LocalForage = localForage;
  let configString = JSON.stringify(config);
  if (configString !== '{}') {
    clientCache.delete(configString);
    client.dropInstance(config);
    return;
  }
  client.dropInstance();
}

/**
 * Removes every key from the database
 */
export function removeDataStoreItems(config: LocalForageOptions = {}) {
  if (!isBrowser) {
    return;
  }
  let client: LocalForage = localForage;
  let configString = JSON.stringify(config);
  if (configString !== '{}') {
    client.dropInstance(config).then(() => {
      clientCache.set(configString, client.createInstance(config));
    });
    return;
  }
  client.clear();
}
