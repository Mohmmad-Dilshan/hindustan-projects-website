const cacheStore = new Map()

/**
 * Get value from cache if it exists and is not expired
 * @param {string} key 
 * @returns {any|null}
 */
export const getCache = (key) => {
  const item = cacheStore.get(key)
  if (!item) return null

  if (Date.now() > item.expiry) {
    cacheStore.delete(key)
    return null
  }
  return item.value
}

/**
 * Set value in cache with a TTL
 * @param {string} key 
 * @param {any} value 
 * @param {number} ttlSeconds - defaults to 600 (10 minutes)
 */
export const setCache = (key, value, ttlSeconds = 600) => {
  const expiry = Date.now() + ttlSeconds * 1000
  cacheStore.set(key, { value, expiry })
}

/**
 * Delete a specific key from cache
 * @param {string} key 
 */
export const deleteCache = (key) => {
  cacheStore.delete(key)
}

/**
 * Delete all keys that start with a specific prefix
 * @param {string} prefix 
 */
export const deleteCacheByPrefix = (prefix) => {
  for (const key of cacheStore.keys()) {
    if (key.startsWith(prefix)) {
      cacheStore.delete(key)
    }
  }
}

/**
 * Clear the entire cache
 */
export const clearCache = () => {
  cacheStore.clear()
}
