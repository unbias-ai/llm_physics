# Security and Compliance Protocol

**Version**: 1.0.0
**Applies To**: All AI agents
**Status**: Required

---

## Security First

**Principle**: Security is not optional. All agents MUST follow these protocols.

---

## Secret Management

### Rule: NEVER Commit Secrets

**What are secrets?**
- API keys
- Access tokens
- Passwords
- Private keys
- Database credentials
- OAuth client secrets
- Encryption keys

### Detecting Secrets Before Commit

```bash
# The audit script checks for common secret patterns
node scripts/verify_audit_block.js

# Patterns checked:
# - API keys (api_key, apiKey)
# - Tokens (token, bearer)
# - Passwords (password, passwd)
# - AWS keys (AKIA...)
# - GitHub tokens (ghp_...)
```

### Proper Secret Management

```typescript
//  BAD - Never do this
const API_KEY = "sk_live_123456789abcdef"
const DATABASE_URL = "postgres://user:pass@host:5432/db"

//  GOOD - Use environment variables
const API_KEY = process.env.API_KEY
const DATABASE_URL = process.env.DATABASE_URL

//  GOOD - Validate required secrets
if (!process.env.API_KEY) {
  throw new Error('API_KEY environment variable is required')
}
```

### Environment Variables

**Development**:
```bash
# .env.local (gitignored)
API_KEY=your_dev_key_here
DATABASE_URL=postgres://localhost:5432/dev
```

**Production**:
- Set in Vercel dashboard
- Use GitHub Secrets for CI/CD
- Never in code or version control

---

## Input Validation

### Rule: Validate All Inputs

**Untrusted inputs**:
- User input (forms, URLs)
- API responses
- File uploads
- Query parameters
- Agent-generated code (yes, validate your own output!)

### Validation Pattern

```typescript
// Define expected shape
interface UserInput {
  email: string
  age: number
}

// Validate and sanitize
function validateUserInput(input: unknown): UserInput {
  if (typeof input !== 'object' || input === null) {
    throw new ValidationError('Invalid input: expected object')
  }

  const { email, age } = input as Record<string, unknown>

  // Validate email
  if (typeof email !== 'string' || !isValidEmail(email)) {
    throw new ValidationError('Invalid email format')
  }

  // Validate age
  if (typeof age !== 'number' || age < 0 || age > 150) {
    throw new ValidationError('Invalid age')
  }

  // Return sanitized
  return { email: sanitizeEmail(email), age }
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function sanitizeEmail(email: string): string {
  return email.trim().toLowerCase()
}
```

### SQL Injection Prevention

```typescript
//  BAD - SQL injection vulnerable
const query = `SELECT * FROM users WHERE email = '${userEmail}'`

//  GOOD - Use parameterized queries
const query = 'SELECT * FROM users WHERE email = ?'
db.execute(query, [userEmail])

//  GOOD - Use ORM (Drizzle, Prisma)
await db.select().from(users).where(eq(users.email, userEmail))
```

### XSS Prevention

```typescript
// React automatically escapes JSX content
// But be careful with dangerouslySetInnerHTML

//  BAD - XSS vulnerable
<div dangerouslySetInnerHTML={{ __html: userContent }} />

//  GOOD - Sanitize first
import DOMPurify from 'dompurify'

const sanitized = DOMPurify.sanitize(userContent)
<div dangerouslySetInnerHTML={{ __html: sanitized }} />

//  BETTER - Avoid dangerouslySetInnerHTML entirely
<div>{userContent}</div>
```

---

## Authentication and Authorization

### Authentication

```typescript
// Verify user identity
async function authenticate(token: string): Promise<User> {
  // Verify JWT token
  const payload = await verifyJWT(token)

  // Load user from database
  const user = await db.getUser(payload.userId)

  if (!user) throw new AuthenticationError('User not found')

  return user
}
```

### Authorization

```typescript
// Verify user permissions
async function authorize(user: User, action: string, resource: string): Promise<boolean> {
  // Check if user has permission for this action
  const hasPermission = await db.checkPermission(user.id, action, resource)

  if (!hasPermission) {
    throw new AuthorizationError(`User ${user.id} cannot ${action} ${resource}`)
  }

  return true
}
```

### API Route Protection (Next.js)

```typescript
// app/api/protected/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { authenticate } from '@/lib/auth'

export async function GET(request: NextRequest) {
  // Authenticate user
  const token = request.headers.get('authorization')?.replace('Bearer ', '')

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const user = await authenticate(token)

    // User authenticated, proceed
    return NextResponse.json({ data: 'protected data', user })

  } catch (error) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }
}
```

---

## Rate Limiting

### Why Rate Limiting?

Prevent:
- Brute force attacks
- DoS attacks
- API abuse
- Resource exhaustion

### Implementation (Upstash Rate Limit)

```typescript
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'), // 10 requests per 10 seconds
})

export async function POST(request: NextRequest) {
  // Get identifier (IP or user ID)
  const identifier = request.ip ?? 'anonymous'

  // Check rate limit
  const { success, remaining } = await ratelimit.limit(identifier)

  if (!success) {
    return NextResponse.json(
      { error: 'Rate limit exceeded', retryAfter: '10s' },
      { status: 429 }
    )
  }

  // Process request
  return NextResponse.json({ success: true, remaining })
}
```

---

## Security Headers

### Next.js Configuration

```typescript
// next.config.ts
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ]
  },
}

export default nextConfig
```

---

## Compliance Levels

### CRITICAL (Blocks Merge)

**Issues that MUST be fixed immediately**:
- Exposed secrets or credentials
- Known security vulnerabilities (CVE)
- Missing authentication on protected endpoints
- SQL injection vulnerabilities
- XSS vulnerabilities
- CSRF vulnerabilities

**Action**: Fix immediately, blocks merge

### HIGH (Should Fix Before Merge)

**Issues that should be addressed**:
- Missing rate limiting on public APIs
- Weak input validation
- Missing security headers
- Insecure direct object references
- Insufficient logging

**Action**: Fix before merge (can be deferred with approval)

### MEDIUM (Fix Soon)

**Issues to address soon**:
- Outdated dependencies with known issues
- Missing HTTPS enforcement (dev only)
- Insufficient error messages
- Missing audit logging

**Action**: Create issue, fix in next PR

### LOW (Nice to Have)

**Improvements**:
- Code quality improvements
- Performance optimizations
- Additional logging
- Better error handling

**Action**: Backlog

---

## Audit Script

### Running the Audit

```bash
# Full audit
node scripts/verify_audit_block.js

# Output:
# - CRITICAL: 0 (must be zero)
# - HIGH: 0 (should be zero)
# - MEDIUM: X
# - LOW: X
# Status: PASS or FAIL
```

### Audit Log Format

```json
{
  "timestamp": "2025-11-06T13:00:00Z",
  "level": "HIGH",
  "findings": [
    {
      "category": "security",
      "severity": "CRITICAL",
      "file": "app/api/route.ts",
      "line": 42,
      "message": "Potential API key exposure",
      "recommendation": "Move to environment variable"
    }
  ],
  "summary": {
    "critical": 0,
    "high": 1,
    "medium": 2,
    "low": 5
  },
  "status": "FAIL"
}
```

---

## Common Security Anti-Patterns

### 1. Trusting Client-Side Validation

```typescript
//  BAD - Client-side only
function SubmitForm() {
  const handleSubmit = (e) => {
    if (!email.includes('@')) {
      alert('Invalid email')
      return
    }
    fetch('/api/submit', { body: JSON.stringify({ email }) })
  }
}

//  GOOD - Server-side validation
// app/api/submit/route.ts
export async function POST(request: NextRequest) {
  const { email } = await request.json()

  // Validate on server
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
  }

  // Process
}
```

### 2. Exposing Internal Errors

```typescript
//  BAD - Exposes internal details
catch (error) {
  return NextResponse.json({ error: error.message }, { status: 500 })
}

//  GOOD - Generic error message
catch (error) {
  console.error('Internal error:', error) // Log internally
  return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
}
```

### 3. Using Weak Crypto

```typescript
//  BAD - MD5 is broken
import md5 from 'md5'
const hash = md5(password)

//  GOOD - Use bcrypt or argon2
import bcrypt from 'bcrypt'
const hash = await bcrypt.hash(password, 10)
```

### 4. Missing CORS Configuration

```typescript
//  BAD - Allow all origins
res.setHeader('Access-Control-Allow-Origin', '*')

//  GOOD - Specific origins
const allowedOrigins = ['https://example.com']
const origin = req.headers.get('origin')

if (origin && allowedOrigins.includes(origin)) {
  res.headers.set('Access-Control-Allow-Origin', origin)
}
```

---

## Dependency Security

### Check for Vulnerabilities

```bash
# Check dependencies
npm audit

# Fix automatically (if possible)
npm audit fix

# Review manually
npm audit --json > audit-report.json
```

### Update Strategy

1. **Review changes**: Read changelogs
2. **Test locally**: Ensure no breaking changes
3. **Update dev dependencies first**: Lower risk
4. **Update prod dependencies**: Test thoroughly
5. **Monitor**: Check for issues after deployment

---

## Incident Response

### If Security Issue Detected

1. **Assess severity**: CRITICAL, HIGH, MEDIUM, LOW
2. **Contain**: Disable affected feature if needed
3. **Fix**: Implement fix following PTIV workflow
4. **Test**: Verify fix resolves issue
5. **Deploy**: Push fix immediately (CRITICAL/HIGH)
6. **Notify**: Inform stakeholders if user data affected
7. **Post-mortem**: Document and learn

### Example Incident

```
Issue: API key exposed in commit abc123

Actions:
1. Revoke exposed API key immediately
2. Generate new API key
3. Update environment variables
4. Remove key from git history (git filter-branch)
5. Force push (with team coordination)
6. Update documentation
7. Add detection to audit script
```

---

## Security Checklist

Before every commit:

- [ ] No secrets in code
- [ ] All inputs validated
- [ ] SQL queries parameterized
- [ ] XSS prevention in place
- [ ] Authentication on protected routes
- [ ] Authorization checks implemented
- [ ] Rate limiting on public endpoints
- [ ] Security headers configured
- [ ] Dependencies up to date
- [ ] Audit script passes

---

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security Best Practices](https://nextjs.org/docs/pages/building-your-application/configuring/security)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)

---

*Security is everyone's responsibility. When in doubt, ask for review.*
