# Component Rendering Strategy Guide

## Overview

This document explains the Next.js 14 App Router component rendering strategy used in Guidee to prevent hydration errors and ensure proper server/client boundaries.

## Critical Issue Fixed (December 2024)

**Error:** "Error: An error occurred in the Server Components render"

**Root Cause:** Hydration mismatches between server and client renders due to improper component boundaries.

**Solution:** Proper use of `'use client'` directive and hydration barriers.

---

## Key Concepts

### Server Components vs Client Components

| Aspect | Server Component | Client Component |
|--------|---|---|
| **Directive** | None (default) | `'use client'` |
| **Can use** | async/await, databases, secrets | hooks (useState, useEffect), events |
| **Execution** | Only on server | Both server (for initial render) and client (hydration) |
| **Use case** | Data fetching, direct DB access | Interactivity, state management |

### Hydration

Hydration is when React initializes client-side interactivity by:
1. Server renders page to HTML string
2. Browser receives and displays HTML
3. Client JavaScript loads and "hydrates" the page
4. **If server and client output differs → hydration error**

---

## Rules Applied in Guidee

### Rule 1: HomePage Must Be Client Component

**File:** `src/app/(main)/page.tsx`

```typescript
'use client'  // ✅ REQUIRED - HomePage renders PostCard (client component)

import { PostCard } from '@/components/post/post-card'

export default function HomePage() {
  const MOCK_POSTS = [...]

  return (
    <div>
      {MOCK_POSTS.map((post) => (
        <PostCard key={post.id} {...post} />  // ✅ Can safely render client component
      ))}
    </div>
  )
}
```

**Why:** Server Components cannot directly render Client Components. Since HomePage renders `<PostCard>` (which has `'use client'`), HomePage must also be a Client Component.

---

### Rule 2: DualLayout Must Handle Hydration Safely

**File:** `src/components/layout/dual-layout.tsx`

```typescript
'use client'

import { useEffect, useState } from 'react'

export function DualLayout({ children }: DualLayoutProps) {
  const { mode } = useUserMode()
  const [isHydrated, setIsHydrated] = useState(false)

  // ✅ Ensure hydration completes before rendering mode-specific content
  useEffect(() => {
    setIsHydrated(true)
  }, [])

  // During SSR, render minimal output to match what client will render
  if (!isHydrated) {
    return <>{children}</>
  }

  // After hydration, safe to render mode-specific layout
  if (mode === 'guide') {
    return (
      <div className="bg-white">
        <GuideSidebar />
        <main className="flex-1 lg:ml-80">
          {children}
        </main>
        {/* ... */}
      </div>
    )
  }

  return /* other layouts */
}
```

**Why:** DualLayout decides layout based on user mode (from context/store). During server render, this might be undefined, causing client to render different HTML than server. The hydration barrier ensures they match:
- SSR output: `<>{children}</>`
- Client output after hydration: Full layout based on actual mode

---

### Rule 3: ProfileSetupGuard Must Defer Side Effects

**File:** `src/components/auth/profile-setup-guard.tsx`

```typescript
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export function ProfileSetupGuard({ children }: ProfileSetupGuardProps) {
  const router = useRouter()
  const [isHydrated, setIsHydrated] = useState(false)

  // ✅ Mark hydration complete
  useEffect(() => {
    setIsHydrated(true)
  }, [])

  // ✅ Only run client-specific logic (router.push) after hydration
  useEffect(() => {
    if (!isHydrated) return

    // Check KYC verification and redirect if needed
    if (!user.isKYCVerified && !isAllowedPath) {
      router.push('/profile/setup')
    }
  }, [isHydrated, user, pathname, router])

  return <>{children}</>
}
```

**Why:** `router.push()` can only run on client. If it runs during SSR, server and client render different things. The hydration barrier defers it until client-side.

---

### Rule 4: No SSR-Only Exports in Client Components

**❌ WRONG:**
```typescript
'use client'

// ❌ Cannot use this in client component
export const revalidate = 0  // Error: export const revalidate = "[object Object]"

export default function Page() {
  return <div>Content</div>
}
```

**✅ CORRECT:**
```typescript
'use client'

// Cache control happens automatically for client components
// No need for revalidate export

export default function Page() {
  return <div>Content</div>
}
```

**Why:** `export const revalidate` is a server-side build directive. Client components don't need it - they're always dynamic.

---

## Pattern: Hydration Barrier

Use this pattern for any client component that has conditional rendering or state-dependent output:

```typescript
'use client'

import { useEffect, useState } from 'react'

export function MyComponent() {
  const [isHydrated, setIsHydrated] = useState(false)
  const stateFromContext = useMyContext() // might be undefined on server

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  // During SSR, render minimal output
  if (!isHydrated) {
    return <SimpleVersion />
  }

  // After hydration, render full component based on actual state
  return <FullComponent />
}
```

**When to use:**
- Component reads from context/store that's undefined during SSR
- Component uses `useRouter()` or other navigation
- Server and client might render different content
- Component has conditional layout based on user state

---

## Component Hierarchy in Guidee

```
RootLayout (Server Component)
├── layout.tsx (imports globals.css, renders Providers)
│
└── (main)Layout (Server Component)
    ├── AuthInit (Client) - initializes auth state only
    │
    ├── ProfileSetupGuard (Client) ⚠️ Has hydration barrier
    │   └── Defers router.push until after hydration
    │
    └── DualLayout (Client) ⚠️ Has hydration barrier
        ├── Defers mode-specific layout until after hydration
        │
        └── HomePage (Client) ✅ Marked 'use client'
            └── PostCard (Client) ✅ Can safely render here
                └── HomeSidebar (Client)
```

---

## Common Errors and Fixes

### Error 1: "An error occurred in the Server Components render"

**Cause:** Hydration mismatch - server and client rendered different HTML

**Fix:** Add `'use client'` to the component or add hydration barrier

### Error 2: "Invalid revalidate value [object Object]"

**Cause:** Using `export const revalidate` in a client component

**Fix:** Remove the revalidate export - client components are always dynamic

### Error 3: "useRouter is not supported in Server Components"

**Cause:** Using `useRouter()` in a server component

**Fix:** Wrap in a client component or move to client component boundary

### Error 4: Network/Context undefined during SSR

**Cause:** Trying to access context that's only initialized on client

**Fix:** Add hydration barrier and check `isHydrated` before using context

---

## Testing for Hydration Issues

### Local Development (works even with issues)
```bash
npm run dev
# Open http://localhost:3000
# Issues hidden because dev mode is forgiving
```

### Production Build (reveals hydration issues)
```bash
npm run build
npm run start
# Open http://localhost:3000
# Hydration errors show in browser console
```

### Vercel Deployment (same as production)
```bash
git push origin main
# Wait for Vercel deployment
# Check browser console for hydration errors
```

---

## Best Practices

1. **Mark interactive components with `'use client'`**
   - Components that use hooks
   - Components with event handlers
   - Components that need browser APIs

2. **Server-side only at route level**
   - API routes with `export const dynamic = 'force-dynamic'`
   - Page components that fetch data
   - Layouts that need server context

3. **Minimize client JavaScript**
   - Keep components as server components when possible
   - Use `<Suspense>` for loading states
   - Defer expensive operations to client

4. **Add hydration barriers for conditional rendering**
   - If server and client might render different things
   - If accessing context/store initialized on client
   - If using browser APIs like `useRouter()`

5. **Test in production mode**
   - Always test with `npm run build && npm run start`
   - Production builds reveal hydration issues
   - Dev mode hides many issues

---

## Related Documentation

- [Next.js Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [Next.js Client Components](https://nextjs.org/docs/app/building-your-application/rendering/client-components)
- [React Hydration](https://react.dev/reference/react/hydrateRoot)
- [API_ROUTES_GUIDE.md](./API_ROUTES_GUIDE.md) - For Prisma and dynamic rendering

---

**Last Updated:** December 3, 2024
**Maintainer:** Guidee Team

