import { renderHook, act, waitFor } from '@testing-library/react';
import useApi from '../useApi';

// Mock fetch globally
global.fetch = jest.fn();

// Test helpers
const createMockResponse = (data, headers = {}, status = 200) => {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: jest.fn().mockResolvedValue(data),
    headers: {
      get: jest.fn((name) => headers[name] || null)
    }
  };
};

const createMockCache = () => {
  const cache = new Map();
  return {
    get: jest.fn((key) => cache.get(key)),
    set: jest.fn((key, value) => cache.set(key, value)),
    clear: jest.fn(() => cache.clear()),
    has: jest.fn((key) => cache.has(key)),
    delete: jest.fn((key) => cache.delete(key))
  };
};

describe('useApi Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch.mockClear();
  });

  describe('Basic Functionality', () => {
    it('should make API request successfully', async () => {
      const mockData = { posts: [] };
      const mockResponse = createMockResponse(mockData);
      global.fetch.mockResolvedValueOnce(mockResponse);

      const { result } = renderHook(() => useApi('/api/posts'));

      await waitFor(() => {
        expect(result.current.data).toEqual(mockData);
        expect(result.current.status).toBe(200);
        expect(result.current.loading).toBe(false);
      });

      expect(global.fetch).toHaveBeenCalledWith('/api/posts', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        signal: expect.any(AbortSignal)
      });
    });

    it('should handle errors properly', async () => {
      const mockResponse = createMockResponse({}, {}, 500);
      global.fetch.mockResolvedValueOnce(mockResponse);

      const { result } = renderHook(() => useApi('/api/posts'));

      await waitFor(() => {
        expect(result.current.error).toBeTruthy();
        expect(result.current.loading).toBe(false);
      });
    });
  });

  describe('Cache Functionality', () => {
    it('should return cached data when available', async () => {
      const mockData = { posts: [] };
      const mockResponse = createMockResponse(mockData);
      global.fetch.mockResolvedValueOnce(mockResponse);

      const { result } = renderHook(() => 
        useApi('/api/posts', { cache: true })
      );

      // First request
      await waitFor(() => {
        expect(result.current.data).toEqual(mockData);
      });

      // Second request should use cache
      act(() => {
        result.current.execute();
      });

      await waitFor(() => {
        expect(result.current.data).toEqual(mockData);
        expect(result.current.fromCache).toBe(true);
      });

      // Should only call fetch once
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it('should handle cache headers properly', async () => {
      const mockData = { posts: [] };
      const mockResponse = createMockResponse(mockData, {
        'Cache-Control': 'max-age=300',
        'ETag': 'abc123',
        'Last-Modified': 'Wed, 21 Oct 2015 07:28:00 GMT'
      });
      global.fetch.mockResolvedValueOnce(mockResponse);

      const { result } = renderHook(() => 
        useApi('/api/posts', { cache: true })
      );

      await waitFor(() => {
        expect(result.current.data).toEqual(mockData);
      });

      // Check that cache headers are handled
      expect(mockResponse.headers.get).toHaveBeenCalledWith('Cache-Control');
      expect(mockResponse.headers.get).toHaveBeenCalledWith('ETag');
      expect(mockResponse.headers.get).toHaveBeenCalledWith('Last-Modified');
    });

    it('should skip cache headers when testing', async () => {
      const mockData = { posts: [] };
      const mockResponse = createMockResponse(mockData);
      global.fetch.mockResolvedValueOnce(mockResponse);

      const { result } = renderHook(() => 
        useApi('/api/posts', { 
          cache: true, 
          skipCacheHeaders: true 
        })
      );

      await waitFor(() => {
        expect(result.current.data).toEqual(mockData);
      });

      // Should not add cache headers to request
      expect(global.fetch).toHaveBeenCalledWith('/api/posts', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        signal: expect.any(AbortSignal)
      });
    });

    it('should clear cache when requested', async () => {
      const mockData = { posts: [] };
      const mockResponse = createMockResponse(mockData);
      global.fetch.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => 
        useApi('/api/posts', { cache: true })
      );

      // First request
      await waitFor(() => {
        expect(result.current.data).toEqual(mockData);
      });

      // Clear cache
      act(() => {
        result.current.clearCache();
      });

      // Make another request
      act(() => {
        result.current.execute();
      });

      await waitFor(() => {
        expect(result.current.data).toEqual(mockData);
      });

      // Should call fetch twice (once after clearing cache)
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });
  });

  describe('Cache Status Logic', () => {
    it('should return correct cache status for fresh data', async () => {
      const mockData = { posts: [] };
      const mockResponse = createMockResponse(mockData);
      global.fetch.mockResolvedValueOnce(mockResponse);

      const { result } = renderHook(() => 
        useApi('/api/posts', { cache: true })
      );

      await waitFor(() => {
        expect(result.current.data).toEqual(mockData);
      });

      // Check cache status
      const executeResult = await result.current.execute();
      expect(executeResult.cacheStatus).toBe('fresh');
    });

    it('should return correct cache status for no-cache response', async () => {
      const mockData = { posts: [] };
      const mockResponse = createMockResponse(mockData, {
        'Cache-Control': 'no-cache'
      });
      global.fetch.mockResolvedValueOnce(mockResponse);

      const { result } = renderHook(() => 
        useApi('/api/posts', { cache: true })
      );

      await waitFor(() => {
        expect(result.current.data).toEqual(mockData);
      });

      // Check cache status
      const executeResult = await result.current.execute();
      expect(executeResult.cacheStatus).toBe('no-cache');
    });

    it('should return correct cache status for validated response', async () => {
      const mockData = { posts: [] };
      const mockResponse = createMockResponse(mockData, {
        'ETag': 'abc123'
      });
      global.fetch.mockResolvedValueOnce(mockResponse);

      const { result } = renderHook(() => 
        useApi('/api/posts', { cache: true })
      );

      await waitFor(() => {
        expect(result.current.data).toEqual(mockData);
      });

      // Check cache status
      const executeResult = await result.current.execute();
      expect(executeResult.cacheStatus).toBe('validated');
    });
  });

  describe('Retry Logic', () => {
    it('should retry failed requests', async () => {
      const mockData = { posts: [] };
      const mockResponse = createMockResponse(mockData);
      
      // First call fails, second succeeds
      global.fetch
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce(mockResponse);

      const { result } = renderHook(() => 
        useApi('/api/posts', { retryCount: 1 })
      );

      await waitFor(() => {
        expect(result.current.data).toEqual(mockData);
        expect(result.current.loading).toBe(false);
      });

      expect(global.fetch).toHaveBeenCalledTimes(2);
    });

    it('should not retry aborted requests', async () => {
      const abortError = new Error('Aborted');
      abortError.name = 'AbortError';
      global.fetch.mockRejectedValueOnce(abortError);

      const { result } = renderHook(() => 
        useApi('/api/posts', { retryCount: 3 })
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Should not retry aborted requests
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });
  });

  describe('Abort Functionality', () => {
    it('should abort ongoing requests', async () => {
      const mockData = { posts: [] };
      const mockResponse = createMockResponse(mockData);
      global.fetch.mockResolvedValueOnce(mockResponse);

      const { result } = renderHook(() => useApi('/api/posts'));

      // Abort the request
      act(() => {
        result.current.abort();
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });
  });

  describe('Different HTTP Methods', () => {
    it('should handle POST requests', async () => {
      const mockData = { success: true };
      const mockResponse = createMockResponse(mockData);
      global.fetch.mockResolvedValueOnce(mockResponse);

      const postData = { title: 'Test Post' };
      const { result } = renderHook(() => 
        useApi('/api/posts', { 
          method: 'POST', 
          body: postData 
        })
      );

      await waitFor(() => {
        expect(result.current.data).toEqual(mockData);
      });

      expect(global.fetch).toHaveBeenCalledWith('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData),
        signal: expect.any(AbortSignal)
      });
    });

    it('should handle PUT requests', async () => {
      const mockData = { success: true };
      const mockResponse = createMockResponse(mockData);
      global.fetch.mockResolvedValueOnce(mockResponse);

      const putData = { title: 'Updated Post' };
      const { result } = renderHook(() => 
        useApi('/api/posts/1', { 
          method: 'PUT', 
          body: putData 
        })
      );

      await waitFor(() => {
        expect(result.current.data).toEqual(mockData);
      });

      expect(global.fetch).toHaveBeenCalledWith('/api/posts/1', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(putData),
        signal: expect.any(AbortSignal)
      });
    });

    it('should handle DELETE requests', async () => {
      const mockData = { success: true };
      const mockResponse = createMockResponse(mockData);
      global.fetch.mockResolvedValueOnce(mockResponse);

      const { result } = renderHook(() => 
        useApi('/api/posts/1', { method: 'DELETE' })
      );

      await waitFor(() => {
        expect(result.current.data).toEqual(mockData);
      });

      expect(global.fetch).toHaveBeenCalledWith('/api/posts/1', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        signal: expect.any(AbortSignal)
      });
    });
  });

  describe('Custom Headers', () => {
    it('should include custom headers', async () => {
      const mockData = { posts: [] };
      const mockResponse = createMockResponse(mockData);
      global.fetch.mockResolvedValueOnce(mockResponse);

      const customHeaders = {
        'Authorization': 'Bearer token123',
        'X-Custom-Header': 'custom-value'
      };

      const { result } = renderHook(() => 
        useApi('/api/posts', { headers: customHeaders })
      );

      await waitFor(() => {
        expect(result.current.data).toEqual(mockData);
      });

      expect(global.fetch).toHaveBeenCalledWith('/api/posts', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...customHeaders
        },
        signal: expect.any(AbortSignal)
      });
    });
  });

  describe('Callbacks', () => {
    it('should call onSuccess callback', async () => {
      const mockData = { posts: [] };
      const mockResponse = createMockResponse(mockData);
      global.fetch.mockResolvedValueOnce(mockResponse);

      const onSuccess = jest.fn();
      const { result } = renderHook(() => 
        useApi('/api/posts', { onSuccess })
      );

      await waitFor(() => {
        expect(onSuccess).toHaveBeenCalledWith(mockData, mockResponse);
      });
    });

    it('should call onError callback', async () => {
      const mockResponse = createMockResponse({}, {}, 500);
      global.fetch.mockResolvedValueOnce(mockResponse);

      const onError = jest.fn();
      const { result } = renderHook(() => 
        useApi('/api/posts', { onError })
      );

      await waitFor(() => {
        expect(onError).toHaveBeenCalled();
      });
    });
  });
}); 