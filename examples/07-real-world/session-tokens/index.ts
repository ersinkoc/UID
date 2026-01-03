/**
 * Session Token Generation
 *
 * Generate secure, unique session tokens.
 */

import { uid } from '@oxog/uid';

interface Session {
  token: string;
  userId: string;
  createdAt: Date;
  expiresAt: Date;
}

class SessionManager {
  private sessions: Map<string, Session> = new Map();

  /**
   * Create a new session
   */
  createSession(userId: string, durationMs: number = 24 * 60 * 60 * 1000): Session {
    const now = new Date();
    const session: Session = {
      token: uid.nanoid(32), // 32 chars = ~192 bits of entropy
      userId,
      createdAt: now,
      expiresAt: new Date(now.getTime() + durationMs)
    };

    this.sessions.set(session.token, session);
    return session;
  }

  /**
   * Validate a session token
   */
  validateSession(token: string): Session | null {
    const session = this.sessions.get(token);
    if (!session) return null;

    if (session.expiresAt < new Date()) {
      this.sessions.delete(token);
      return null;
    }

    return session;
  }

  /**
   * Destroy a session
   */
  destroySession(token: string): void {
    this.sessions.delete(token);
  }
}

// Usage
const manager = new SessionManager();

const session = manager.createSession('user-123');
console.log('Session token:', session.token);
// Output: 32-character URL-safe string

console.log('Expires at:', session.expiresAt);

// Validate session
const validSession = manager.validateSession(session.token);
console.log('Valid session:', validSession?.userId);
// Output: user-123
