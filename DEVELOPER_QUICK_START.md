# Guidee - Developer Quick Start Guide

## What Just Happened

The Guidee project had critical issues that have been **completely fixed**:

1. ✅ **Server Components render error** - Fixed with hydration barriers
2. ✅ **CSS styling not displaying** - Fixed @import order and background color
3. ✅ **Homepage design** - Modernized with waterfall layout
4. ✅ **Build errors** - All database connection issues resolved
5. ✅ **Post detail page** - Now works reliably

**Status: Production Ready** 🚀

---

## Quick Navigation

### 📖 Essential Guides

1. **`COMPONENT_RENDERING_GUIDE.md`** ⭐ **READ THIS FIRST**
   - Explains server/client component boundaries
   - When to use 'use client' directive
   - How hydration works (why that error happened)
   - Hydration barrier pattern
   - Common errors and fixes

2. **`API_ROUTES_GUIDE.md`**
   - Which API routes need `export const dynamic = 'force-dynamic'`
   - Why Prisma routes need it
   - Checklist for creating new API routes
   - 13 categories of API routes

3. **`FIXES_SUMMARY.md`**
   - Complete summary of all issues and fixes
   - Before/after comparison
   - Timeline of fixes
   - Files modified

---

## For Developers

### Local Development Setup

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env.local

# Run dev server
npm run dev

# Open http://localhost:3000
```

### Creating New Components

#### ✅ DO: Use 'use client' for interactive components
```typescript
'use client'

import { useState } from 'react'

export function MyInteractiveComponent() {
  const [count, setCount] = useState(0)

  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  )
}
```

#### ❌ DON'T: Use hooks in Server Components
```typescript
// ❌ WRONG - This will error in production
import { useState } from 'react'  // Can't use in server component!

export function MyComponent() {
  const [count, setCount] = useState(0)  // Error!
  return <div>{count}</div>
}
```

### Creating New API Routes

#### ✅ DO: Mark Prisma routes as dynamic
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// ✅ Required for any route using Prisma
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const items = await prisma.table.findMany()
  return NextResponse.json(items)
}
```

#### ❌ DON'T: Forget dynamic export
```typescript
// ❌ WRONG - This will fail build with database error
export async function GET(request: NextRequest) {
  const items = await prisma.table.findMany()  // Build error!
  return NextResponse.json(items)
}
```

### Testing

```bash
# Production build (reveals all issues)
npm run build

# Run production build locally
npm run start

# Check for errors in browser console
```

---

## Understanding the Fixes

### The Hydration Barrier Pattern

Many of our components use this pattern now:

```typescript
'use client'

import { useEffect, useState } from 'react'

export function MyComponent() {
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  // Server and client render the same thing initially
  if (!isHydrated) {
    return <SimpleVersion />
  }

  // After hydration, can use full functionality
  return <FullComponent />
}
```

**Why?** When server and client render different HTML, React throws a hydration error in production. The barrier ensures they're always identical initially.

### The Component Structure

```
Homepage
├── Renders PostCard (Client)
│   └── Uses hooks and events ✅
│
└── Wrapped by DualLayout (Client with hydration barrier)
    ├── During SSR: renders minimal output
    └── After hydration: renders full layout

    └── Wrapped by ProfileSetupGuard (Client with hydration barrier)
        ├── During SSR: renders children as-is
        └── After hydration: checks KYC and redirects if needed
```

---

## Common Tasks

### Update API Route
```typescript
// ✅ Always add this at the top if using Prisma
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const item = await prisma.table.create({
    data: body
  })
  return NextResponse.json(item, { status: 201 })
}
```

### Add New Page
```typescript
// If the page needs client-side interactivity:
'use client'

export default function MyPage() {
  // Your component code
}

// If the page only displays server data:
export default function MyPage() {
  // No 'use client' needed
}
```

### Fix Hydration Issues

**Symptom:** Component works in dev, errors in production build

**Steps:**
1. Read `COMPONENT_RENDERING_GUIDE.md` - "Common Errors" section
2. Check if component uses hooks (needs `'use client'`)
3. Check if server and client render differently
4. Add hydration barrier if needed
5. Test with `npm run build && npm run start`

---

## Key Files to Know

### Core Application
- `src/app/layout.tsx` - Root layout, imports styles
- `src/app/(main)/page.tsx` - Homepage (Client Component)
- `src/app/(main)/layout.tsx` - Main layout (renders DualLayout, ProfileSetupGuard)

### Important Components
- `src/components/layout/dual-layout.tsx` - Main layout with hydration barrier
- `src/components/auth/profile-setup-guard.tsx` - KYC guard with hydration barrier
- `src/components/post/post-card.tsx` - Individual post card in feed
- `src/components/layout/home-sidebar.tsx` - Navigation sidebar

### Configuration
- `tailwind.config.js` - Tailwind CSS config with brand colors
- `next.config.js` - Next.js configuration
- `tsconfig.json` - TypeScript configuration

### Documentation
- `COMPONENT_RENDERING_GUIDE.md` - Server/client boundary rules
- `API_ROUTES_GUIDE.md` - API route best practices
- `FIXES_SUMMARY.md` - All issues and fixes

---

## Troubleshooting

### Error: "An error occurred in the Server Components render"

**Cause:** Server and client render different HTML

**Solution:**
1. Make sure parent component has `'use client'`
2. Add hydration barrier if component uses hooks
3. See `COMPONENT_RENDERING_GUIDE.md` for patterns

### Error: "Can't reach database server"

**Cause:** API route using Prisma missing `export const dynamic = 'force-dynamic'`

**Solution:**
1. Add at top of route file: `export const dynamic = 'force-dynamic'`
2. See `API_ROUTES_GUIDE.md` for all Prisma routes

### Build fails with type errors

**Solution:**
```bash
npm run build 2>&1 | grep "error TS"
# Fix the TypeScript errors shown
```

### Homepage shows no styling

**Cause:** Typically globals.css issues

**Solution:**
1. Check `src/styles/globals.css`
2. Verify @import comes BEFORE @tailwind
3. Check body background-color is not opaque

---

## Before You Deploy to Vercel

### Checklist
- [ ] `npm run build` succeeds locally
- [ ] No errors in build output
- [ ] No TypeScript errors
- [ ] No hydration warnings in console
- [ ] Homepage displays with styling
- [ ] All links work
- [ ] API routes respond

### Commands to Run
```bash
# Full test cycle
npm run build && npm run start

# Then open http://localhost:3000 and test thoroughly
```

---

## Getting Help

### Understanding Hydration
→ Read: `COMPONENT_RENDERING_GUIDE.md` - Entire document

### Understanding API Routes
→ Read: `API_ROUTES_GUIDE.md` - Section "Complete Example"

### Understanding All Fixes
→ Read: `FIXES_SUMMARY.md` - Overview and Solutions sections

### Need to Debug?

1. Check browser console for errors
2. Check terminal/build output
3. Run `npm run build` to see all issues
4. Read the relevant guide document
5. Compare your code to the examples

---

## Key Takeaways

**The three critical fixes:**

1. **Add `'use client'` to components that:**
   - Use hooks (useState, useEffect, useContext)
   - Have event handlers (onClick, onChange)
   - Use browser APIs (useRouter, useSearchParams)

2. **Add `export const dynamic = 'force-dynamic'` to API routes that:**
   - Use Prisma or any database
   - Cannot be statically generated at build time

3. **Add hydration barrier to components that:**
   - Render differently on server vs client
   - Use context that might be undefined on server
   - Have conditional rendering based on client state

---

## Contact & Support

For issues or questions:
- Check the relevant guide document first
- Search for error message in guide documents
- Review the examples in this guide
- See `FIXES_SUMMARY.md` for similar issues

---

**Last Updated:** December 3, 2024
**Project Status:** ✅ Production Ready
**Deployed:** Ready for Vercel deployment

