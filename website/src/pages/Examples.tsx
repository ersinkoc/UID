import { CodeBlock } from '../components/CodeBlock';
import { Lightbulb, Database, Link2, Key, Terminal } from 'lucide-react';

const examples = [
  {
    title: 'React List Keys',
    description: 'Use generated IDs as React component keys',
    icon: Key,
    gradient: 'from-blue-500 to-cyan-500',
    code: `import { uid } from '@oxog/uid';

interface Item {
  id: string;
  name: string;
}

const items: Item[] = [
  { id: uid.uuid(), name: 'Item 1' },
  { id: uid.uuid(), name: 'Item 2' },
  { id: uid.uuid(), name: 'Item 3' }
];

// Use in React
function ItemList() {
  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
}`,
  },
  {
    title: 'Database Primary Keys',
    description: 'Use generated IDs as primary keys',
    icon: Database,
    gradient: 'from-green-500 to-emerald-500',
    code: `import { uid } from '@oxog/uid';

interface User {
  id: string;
  name: string;
  email: string;
}

// Create user with UUID
const user: User = {
  id: uid.uuid(),
  name: 'John Doe',
  email: 'john@example.com'
};

// Insert into database
await db.users.insert(user);`,
  },
  {
    title: 'URL Shortener',
    description: 'Generate short codes for URLs',
    icon: Link2,
    gradient: 'from-purple-500 to-pink-500',
    code: `import { uid } from '@oxog/uid';
import { shortPlugin } from '@oxog/uid/plugins';

uid.use(shortPlugin);

class UrlShortener {
  private urls = new Map<string, string>();

  shorten(url: string): string {
    const code = uid.short.youtube();
    this.urls.set(code, url);
    return code;
  }

  expand(code: string): string | null {
    return this.urls.get(code) || null;
  }
}

const shortener = new UrlShortener();
const shortCode = shortener.shorten('https://example.com');
console.log(shortCode); // 'dQw4w9WgXcQ'

const originalUrl = shortener.expand(shortCode);
console.log(originalUrl); // 'https://example.com'`,
  },
  {
    title: 'Session Tokens',
    description: 'Generate secure session tokens',
    icon: Terminal,
    gradient: 'from-yellow-500 to-orange-500',
    code: `import { uid } from '@oxog/uid';

interface Session {
  token: string;
  userId: string;
  createdAt: Date;
}

class SessionManager {
  private sessions = new Map<string, Session>();

  createSession(userId: string): string {
    const token = uid.nanoid(32); // 192 bits of entropy
    this.sessions.set(token, {
      token,
      userId,
      createdAt: new Date()
    });
    return token;
  }

  validateSession(token: string): boolean {
    return this.sessions.has(token);
  }

  getUserSession(token: string): Session | undefined {
    return this.sessions.get(token);
  }

  deleteSession(token: string): void {
    this.sessions.delete(token);
  }
}

const manager = new SessionManager();
const token = manager.createSession('user-123');
console.log(token); // 32-character URL-safe string
console.log(manager.validateSession(token)); // true`,
  },
  {
    title: 'Distributed Tracing',
    description: 'Generate trace IDs for distributed systems',
    icon: Lightbulb,
    gradient: 'from-red-500 to-pink-500',
    code: `import { uid } from '@oxog/uid';

interface TraceContext {
  traceId: string;
  spanId: string;
  parentSpanId?: string;
}

class Tracer {
  generateSpanId(): string {
    return uid.nanoid(16);
  }

  createTrace(parentContext?: TraceContext): TraceContext {
    return {
      traceId: parentContext?.traceId || uid.ulid(),
      spanId: this.generateSpanId(),
      parentSpanId: parentContext?.spanId
    };
  }
}

const tracer = new Tracer();

// Start a new trace
const rootTrace = tracer.createTrace();
console.log(rootTrace);
// { traceId: '01ARZ3NDEKTSV4RRFFQ69G5FAV', spanId: 'V1StGXR8_Z5jdHi6' }

// Create a child span
const childTrace = tracer.createTrace(rootTrace);
console.log(childTrace);
// { traceId: '01ARZ3NDEKTSV4RRFFQ69G5FAV', spanId: 'B-myT_l8vQ9aE3xK', parentSpanId: 'V1StGXR8_Z5jdHi6' }`,
  },
];

interface ExamplesProps {
  isDark: boolean;
}

export function Examples({ isDark }: ExamplesProps) {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 py-20">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cmFkaWFsR3JhZGllbnQgaWQ9ImEiIGN4PSI1MCUiIGN5PSI1MCUiIHI9IjUwJSIgZ3JhZGllbnRUcmFuc2Zvcm09InVybCIgc3RvcC1jb2xvcj0iIzM2M2Y5MCIgc3RvcC1vcGFjaXR5PSIwLjEiPjxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iIzZiNzY4MSIvPjwvcmFkaWFsR3JhZGllbnQ+PC9kZWZzPjwvc3ZnPg==')] bg-[length:20px_20px] opacity-20" />
        <div className="relative container-custom max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-medium mb-6">
            <Lightbulb className="w-4 h-4" />
            <span>Practical Examples</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Usage Examples
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Real-world examples of using @oxog/uid in your applications.
          </p>
        </div>
      </section>

      {/* Examples */}
      <div className="container-custom max-w-5xl py-16">
        <div className="space-y-20">
          {examples.map((example, index) => {
            const Icon = example.icon;
            return (
              <section
                key={example.title}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className={`p-4 rounded-2xl bg-gradient-to-br ${example.gradient} shadow-lg`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{example.title}</h2>
                    <p className="text-gray-600 dark:text-gray-400">{example.description}</p>
                  </div>
                </div>
                <CodeBlock code={example.code} isDark={isDark} />
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
