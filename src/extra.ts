import localForage from 'localforage';
import clientCache from './ClientCache';
import { isBrowser } from './utils';

/**
 * Drop the localForage instance
 */
export function dropDataStore(config: LocalForageOptions = {}) {
  if (!isBrowser) {
    return;
  }
  let client: LocalForage = localForage;
  let configString = JSON.stringify(config);
  clientCache.removeCache(configString);
  if (configString !== '{}') {
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
  clientCache.removeCache(configString);
  if (configString !== '{}') {
    client.dropInstance(config).then(() => {
      clientCache.addCache(configString, client.createInstance(config));
    });
    return;
  }
  client.clear();
}

/**
 * data storage driver
 */
export const driver = {
  WEBSQL: localForage.WEBSQL,
  INDEXEDDB: localForage.INDEXEDDB,
  LOCALSTORAGE: localForage.LOCALSTORAGE,
};
