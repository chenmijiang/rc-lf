import localForage from 'localforage';
import clientCache from './ClientCache';
import { isBrowser } from './utils';

/**
 * get the client
 */
function _dataStore(config: LocalForageOptions = {}, capture: boolean) {
  if (!isBrowser) {
    return;
  }
  let configString = JSON.stringify(config);
  let client = clientCache.getCache(configString);
  if (!client && capture) {
    client = localForage;
  }
  return client;
}

/**
 * Drop the localForage instance
 */
export function dropDataStore(config: LocalForageOptions = {}, capture: boolean = false) {
  let client = _dataStore(config, capture);
  let configString = JSON.stringify(config);
  client?.dropInstance();
  clientCache?.removeCache(configString);
}

/**
 * Removes all keys from the database
 */
export function removeDataStoreItems(config: LocalForageOptions = {}, capture: boolean = false) {
  let client = _dataStore(config, capture);
  client?.clear().then(() => {
    clientCache.refleshCache();
  });
}

/**
 * data storage driver
 */
export const driver = {
  WEBSQL: localForage.WEBSQL,
  INDEXEDDB: localForage.INDEXEDDB,
  LOCALSTORAGE: localForage.LOCALSTORAGE,
};
