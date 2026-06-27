T?i li?u k? thu?t ECSite

T?i li?u k? thu?t ECSite

T?i li?u k? thu?t ECSite

T?i li?u k? thu?t ECSite `_next/js_original-stack-frames` T?i li?u k? thu?t ECSite

1. **Error Overlay**: T?i li?u k? thu?t ECSite

T?i li?u k? thu?t ECSite

3. **React StrictMode**: T?i li?u k? thu?t ECSite

T?i li?u k? thu?t ECSite

T?i li?u k? thu?t ECSite

T?i li?u k? thu?t ECSite

T?i li?u k? thu?t ECSite

2. **Memoized Callbacks**: T?i li?u k? thu?t ECSite

3. **Disable StrictMode**: T?i li?u k? thu?t ECSite

T?i li?u k? thu?t ECSite

T?i li?u k? thu?t ECSite

1. **Custom Error Boundary**: T?i li?u k? thu?t ECSite

T?i li?u k? thu?t ECSite

3. **Production Preview**: T?i li?u k? thu?t ECSite

T?i li?u k? thu?t ECSite

T?i li?u k? thu?t ECSite

T?i li?u k? thu?t ECSite

T?i li?u k? thu?t ECSite

1. **Debounce Search**: T?i li?u k? thu?t ECSite

2. **Abort Previous Requests**: T?i li?u k? thu?t ECSite

3. **Request Timeout**: T?i li?u k? thu?t ECSite

4. **Memoized Callback**: T?i li?u k? thu?t ECSite

5. **Optimistic UI Updates**: T?i li?u k? thu?t ECSite

T?i li?u k? thu?t ECSite

1. **Lazy Loading Modules**: T?i li?u k? thu?t ECSite

T?i li?u k? thu?t ECSite

3. **State Management**: T?i li?u k? thu?t ECSite

4. **API Connection Pool**: T?i li?u k? thu?t ECSite

5. **Monitoring & Analytics**: T?i li?u k? thu?t ECSite

T?i li?u k? thu?t ECSite

T?i li?u k? thu?t ECSite

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  // ...other config
  reactStrictMode: T?i li?u k? thu?t ECSite
};
```

### Custom Error Boundary

```tsx
// components/ErrorBoundary.tsx
import React from 'react'

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(_: Error) {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <div>Something went wrong. Please try again.</div>
    }

    return this.props.children
  }
}
```

T?i li?u k? thu?t ECSite

```typescript
T?i li?u k? thu?t ECSite
const apiCache = new Map();

export async function cachedApiCall(key, apiFn) {
  if (apiCache.has(key)) {
    return apiCache.get(key);
  }

  const result = await apiFn();
  apiCache.set(key, result);
  return result;
}
```
