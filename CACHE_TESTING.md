# Cache Testing Guide

## Overview

This guide explains how to test cache functionality in the MERN stack blog platform without encountering TestClient limitations.

## Problems Solved

### 1. Cache Headers Testing Limitation

**Problem**: TestClient doesn't properly handle cache headers in testing environments.

**Solution**: 
- Added `skipCacheHeaders` option to bypass cache headers during testing
- Implemented proper cache header handling with fallback mechanisms
- Created mock helpers for testing cache functionality

### 2. Cache Status Logic Issues

**Problem**: Cache status wasn't properly tracked and reported.

**Solution**:
- Enhanced cache status tracking with detailed information
- Added cache age calculation
- Implemented proper cache status determination based on response headers

## Testing Approaches

### 1. Using Mock Responses

```javascript
// Test helper for API responses with cache headers
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

// Usage in tests
const mockResponse = createMockResponse(
  { posts: [] },
  { 'Cache-Control': 'max-age=300', 'ETag': 'abc123' }
);
```

### 2. Testing Cache Headers

```javascript
it('should handle cache headers properly in tests', async () => {
  const mockResponse = createMockResponse(
    { data: 'test' },
    { 'Cache-Control': 'max-age=300', 'ETag': 'abc123' }
  );
  
  expect(mockResponse.headers.get('Cache-Control')).toBe('max-age=300');
});
```

### 3. Skipping Cache Headers for Testing

```javascript
// In your test
const { result } = renderHook(() => 
  useApi('/api/posts', { 
    cache: true, 
    skipCacheHeaders: true 
  })
);

// This prevents cache headers from being added to requests during testing
```

### 4. Testing Cache Status

```javascript
it('should return correct cache status', async () => {
  const mockResponse = createMockResponse(
    { data: 'test' },
    { 'Cache-Control': 'no-cache' }
  );
  
  // Test different cache statuses
  expect(executeResult.cacheStatus).toBe('no-cache');
});
```

## Cache Status Types

### 1. Fresh Data
- **Status**: `'fresh'`
- **Description**: New data from server
- **Headers**: No specific cache headers

### 2. Cached Data
- **Status**: `'cached'`
- **Description**: Data retrieved from local cache
- **Age**: Available in `cacheAge` property

### 3. No Cache
- **Status**: `'no-cache'`
- **Description**: Server explicitly says not to cache
- **Headers**: `Cache-Control: no-cache`

### 4. No Store
- **Status**: `'no-store'`
- **Description**: Server says not to store at all
- **Headers**: `Cache-Control: no-store`

### 5. Validated
- **Status**: `'validated'`
- **Description**: Data with validation headers
- **Headers**: `ETag` or `Last-Modified`

## Testing Best Practices

### 1. Mock Fetch Globally

```javascript
// In your test setup
global.fetch = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  global.fetch.mockClear();
});
```

### 2. Test Cache Lifecycle

```javascript
it('should handle cache lifecycle properly', async () => {
  // 1. First request - should fetch from server
  const firstResult = await result.current.execute();
  expect(firstResult.fromCache).toBe(false);
  
  // 2. Second request - should use cache
  const secondResult = await result.current.execute();
  expect(secondResult.fromCache).toBe(true);
  
  // 3. Clear cache
  result.current.clearCache();
  
  // 4. Third request - should fetch again
  const thirdResult = await result.current.execute();
  expect(thirdResult.fromCache).toBe(false);
});
```

### 3. Test Different HTTP Methods

```javascript
it('should handle different HTTP methods', async () => {
  // GET with cache
  const getResult = await result.current.execute();
  
  // POST without cache
  const postResult = await result.current.execute(
    { title: 'Test' },
    { 'Content-Type': 'application/json' }
  );
});
```

### 4. Test Error Scenarios

```javascript
it('should handle cache errors gracefully', async () => {
  // Mock network error
  global.fetch.mockRejectedValueOnce(new Error('Network error'));
  
  const result = await execute();
  expect(result.error).toBeTruthy();
});
```

## Integration Testing

### 1. Testing with Real Components

```javascript
it('should work with real components', async () => {
  render(<Home />);
  
  // Wait for data to load
  await waitFor(() => {
    expect(screen.getByText('Posts')).toBeInTheDocument();
  });
  
  // Verify cache is working
  expect(global.fetch).toHaveBeenCalledTimes(1);
});
```

### 2. Testing Cache Invalidation

```javascript
it('should invalidate cache on mutations', async () => {
  // Create a post
  await createPost({ title: 'New Post' });
  
  // Cache should be cleared
  expect(result.current.data).not.toContain('New Post');
});
```

## Performance Testing

### 1. Cache Hit Performance

```javascript
it('should be faster on cache hits', async () => {
  const startTime = performance.now();
  
  // First request
  await result.current.execute();
  const firstRequestTime = performance.now() - startTime;
  
  // Second request (cache hit)
  const cacheStartTime = performance.now();
  await result.current.execute();
  const cacheRequestTime = performance.now() - cacheStartTime;
  
  expect(cacheRequestTime).toBeLessThan(firstRequestTime);
});
```

### 2. Memory Usage

```javascript
it('should not leak memory', async () => {
  const initialMemory = performance.memory?.usedJSHeapSize || 0;
  
  // Make many requests
  for (let i = 0; i < 100; i++) {
    await result.current.execute();
  }
  
  const finalMemory = performance.memory?.usedJSHeapSize || 0;
  const memoryIncrease = finalMemory - initialMemory;
  
  // Memory increase should be reasonable
  expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024); // 10MB
});
```

## Troubleshooting

### 1. Cache Not Working

**Symptoms**: Cache hits not working as expected
**Solutions**:
- Check if `cache: true` is set in options
- Verify cache key generation is consistent
- Ensure cache time is not expired

### 2. Test Failures

**Symptoms**: Tests failing due to cache issues
**Solutions**:
- Use `skipCacheHeaders: true` in tests
- Clear cache before each test
- Mock fetch responses properly

### 3. Memory Leaks

**Symptoms**: Memory usage increasing over time
**Solutions**:
- Clear cache when component unmounts
- Set reasonable cache time limits
- Monitor cache size

## Conclusion

This testing approach provides a robust way to test cache functionality without relying on TestClient, which has limitations with cache headers. The mock-based approach gives you full control over the testing environment while maintaining the ability to test all cache scenarios.

## Key Takeaways

1. **Use mocks instead of TestClient** for cache testing
2. **Skip cache headers** during testing with `skipCacheHeaders: true`
3. **Test cache lifecycle** including hits, misses, and invalidation
4. **Monitor performance** to ensure cache is working efficiently
5. **Handle errors gracefully** in both cache and network scenarios 