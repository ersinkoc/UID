/**
 * URL Shortener Service
 *
 * A complete URL shortener using @oxog/uid
 */

import { uid } from '@oxog/uid';
import { shortPlugin } from '@oxog/uid/plugins';

uid.use(shortPlugin);

interface ShortenedUrl {
  code: string;
  url: string;
  createdAt: Date;
}

class UrlShortener {
  private urls: Map<string, ShortenedUrl> = new Map();

  /**
   * Shorten a URL
   */
  shorten(url: string): string {
    const code = uid.short.youtube(); // 11 chars like YouTube
    const shortened: ShortenedUrl = {
      code,
      url,
      createdAt: new Date()
    };

    this.urls.set(code, shortened);
    return code;
  }

  /**
   * Expand a short code
   */
  expand(code: string): string | null {
    const shortened = this.urls.get(code);
    return shortened?.url ?? null;
  }

  /**
   * Get URL info
   */
  info(code: string): ShortenedUrl | null {
    return this.urls.get(code) ?? null;
  }
}

// Usage
const shortener = new UrlShortener();

const longUrl = 'https://example.com/very/long/url/that/needs/to/be/shortened';
const shortCode = shortener.shorten(longUrl);

console.log('Short code:', shortCode);
// Output: dQw4w9WgXcQ

console.log('Original URL:', shortener.expand(shortCode));
// Output: https://example.com/very/long/url/that/needs/to/be/shortened

console.log('Info:', shortener.info(shortCode));
// Output: { code: 'dQw4w9WgXcQ', url: '...', createdAt: Date }
