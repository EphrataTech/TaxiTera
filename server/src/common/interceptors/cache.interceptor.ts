import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const key = this.generateCacheKey(request);
    
    // Only cache GET requests
    if (request.method !== 'GET') {
      return next.handle();
    }

    // Check if we have cached data
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      return of(cached.data);
    }

    return next.handle().pipe(
      tap(data => {
        // Cache for 5 minutes for most endpoints
        let ttl = 5 * 60 * 1000;
        
        // Longer cache for static data
        if (request.url.includes('/pricing/routes') || request.url.includes('/pricing/vehicles')) {
          ttl = 30 * 60 * 1000; // 30 minutes
        }
        
        this.cache.set(key, {
          data,
          timestamp: Date.now(),
          ttl
        });
        
        // Clean up old cache entries
        this.cleanupCache();
      })
    );
  }

  private generateCacheKey(request: any): string {
    return `${request.method}:${request.url}:${JSON.stringify(request.query)}`;
  }

  private cleanupCache(): void {
    const now = Date.now();
    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp > value.ttl) {
        this.cache.delete(key);
      }
    }
  }
}