import { useState, useEffect, useCallback, useRef } from 'react';

const useApi = (endpoint, options = {}) => {
  const {
    method = 'GET',
    body = null,
    headers = {},
    immediate = true,
    cache = false,
    cacheTime = 5 * 60 * 1000, // 5 minutes
    retryCount = 3,
    retryDelay = 1000,
    onSuccess,
    onError,
    skipCacheHeaders = false // New option to skip cache headers in testing
  } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(null);
  const abortControllerRef = useRef(null);
  const cacheRef = useRef(new Map());

  // Generate cache key
  const getCacheKey = useCallback(() => {
    return `${method}:${endpoint}:${JSON.stringify(body)}:${JSON.stringify(headers)}`;
  }, [method, endpoint, body, headers]);

  // Check cache
  const getCachedData = useCallback(() => {
    if (!cache) return null;
    
    const cacheKey = getCacheKey();
    const cached = cacheRef.current.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < cacheTime) {
      return {
        data: cached.data,
        status: 'cached',
        timestamp: cached.timestamp,
        age: Date.now() - cached.timestamp
      };
    }
    
    // Remove expired cache
    if (cached) {
      cacheRef.current.delete(cacheKey);
    }
    
    return null;
  }, [cache, cacheTime, getCacheKey]);

  // Set cache
  const setCachedData = useCallback((data, status = 'fresh') => {
    if (!cache) return;
    
    const cacheKey = getCacheKey();
    cacheRef.current.set(cacheKey, {
      data,
      timestamp: Date.now(),
      status
    });
  }, [cache, getCacheKey]);

  // Clear cache
  const clearCache = useCallback(() => {
    cacheRef.current.clear();
  }, []);

  // Make API request
  const execute = useCallback(async (requestBody = body, requestHeaders = headers) => {
    // Check cache first
    const cachedResult = getCachedData();
    if (cachedResult) {
      setData(cachedResult.data);
      setStatus(200);
      return { 
        data: cachedResult.data, 
        status: 200, 
        fromCache: true,
        cacheStatus: cachedResult.status,
        cacheAge: cachedResult.age
      };
    }

    setLoading(true);
    setError(null);

    // Create abort controller
    abortControllerRef.current = new AbortController();

    let retries = 0;
    
    while (retries <= retryCount) {
      try {
        const config = {
          method,
          headers: {
            'Content-Type': 'application/json',
            ...requestHeaders
          },
          signal: abortControllerRef.current.signal
        };

        // Add cache headers for GET requests (unless skipped for testing)
        if (method === 'GET' && !skipCacheHeaders) {
          config.headers['Cache-Control'] = 'max-age=300'; // 5 minutes
          config.headers['Pragma'] = 'cache';
        }

        if (requestBody && method !== 'GET') {
          config.body = JSON.stringify(requestBody);
        }

        const response = await fetch(endpoint, config);
        setStatus(response.status);

        // Handle cache headers from response
        const cacheControl = response.headers.get('Cache-Control');
        const etag = response.headers.get('ETag');
        const lastModified = response.headers.get('Last-Modified');

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseData = await response.json();
        
        setData(responseData);
        
        // Determine cache status based on response headers
        let cacheStatus = 'fresh';
        if (cacheControl && cacheControl.includes('no-cache')) {
          cacheStatus = 'no-cache';
        } else if (cacheControl && cacheControl.includes('no-store')) {
          cacheStatus = 'no-store';
        } else if (etag || lastModified) {
          cacheStatus = 'validated';
        }
        
        setCachedData(responseData, cacheStatus);
        
        if (onSuccess) {
          onSuccess(responseData, response);
        }

        return { 
          data: responseData, 
          status: response.status, 
          fromCache: false,
          cacheStatus,
          cacheHeaders: {
            cacheControl,
            etag,
            lastModified
          }
        };
      } catch (err) {
        if (err.name === 'AbortError') {
          return { data: null, status: null, aborted: true };
        }

        retries++;
        
        if (retries > retryCount) {
          setError(err.message);
          if (onError) {
            onError(err, retries);
          }
          throw err;
        }

        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, retryDelay * retries));
      }
    }
  }, [method, endpoint, body, headers, retryCount, retryDelay, onSuccess, onError, getCachedData, setCachedData, skipCacheHeaders]);

  // Abort request
  const abort = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  // Execute immediately on mount
  useEffect(() => {
    if (immediate) {
      execute();
    }

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [immediate, execute]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    data,
    loading,
    error,
    status,
    execute,
    abort,
    clearCache,
    refetch: () => execute()
  };
};

export default useApi; 