// Type definitions for Next.js routes

/**
 * Internal types used by the Next.js router and Link component.
 * These types are not meant to be used directly.
 * @internal
 */
declare namespace __next_route_internal_types__ {
  type SearchOrHash = `?${string}` | `#${string}`
  type WithProtocol = `${string}:${string}`

  type Suffix = '' | SearchOrHash

  type SafeSlug<S extends string> = S extends `${string}/${string}`
    ? never
    : S extends `${string}${SearchOrHash}`
    ? never
    : S extends ''
    ? never
    : S

  type CatchAllSlug<S extends string> = S extends `${string}${SearchOrHash}`
    ? never
    : S extends ''
    ? never
    : S

  type OptionalCatchAllSlug<S extends string> =
    S extends `${string}${SearchOrHash}` ? never : S

  type StaticRoutes = 
    | `/api/admin/activity`
    | `/api/admin/bookings`
    | `/api/admin/bookings/seed`
    | `/api/admin/chat`
    | `/api/admin/chat/seed`
    | `/api/admin/dashboard`
    | `/api/admin/guides`
    | `/api/admin/notifications`
    | `/api/admin/services`
    | `/api/admin/users`
    | `/api/auth/admin/login`
    | `/api/auth/login`
    | `/api/auth/logout`
    | `/api/auth/me`
    | `/api/auth/refresh`
    | `/api/auth/register`
    | `/api/bookings/payment`
    | `/api/bookings`
    | `/api/conversations`
    | `/api/guides`
    | `/api/health`
    | `/api/notifications/send`
    | `/api/notifications/subscribe`
    | `/api/notifications/unsubscribe`
    | `/api/reviews`
    | `/api/services`
    | `/api/services/search`
    | `/api/services/suggestions`
    | `/api/users/profile`
    | `/auth/login`
    | `/about`
    | `/booking/confirmation`
    | `/booking`
    | `/chat`
    | `/favorites`
    | `/auth/register`
    | `/forgot-password`
    | `/bookings`
    | `/guide-dashboard`
    | `/guide/account`
    | `/guide/messages`
    | `/guide/dashboard`
    | `/history`
    | `/kyc`
    | `/messages`
    | `/login`
    | `/my-bookings`
    | `/profile`
    | `/privacy`
    | `/tasks`
    | `/search`
    | `/register`
    | `/terms`
    | `/admin/bookings`
    | `/admin/demo`
    | `/admin/cms`
    | `/admin/chat`
    | `/admin/guides`
    | `/admin/simple`
    | `/admin/services`
    | `/admin/test`
    | `/admin`
    | `/admin/users`
    | `/admin/reviews`
    | `/guides`
    | `/guide/orders`
    | `/guide/tasks`
    | `/`
    | `/admin/login`
    | `/guide`
    | `/guides`
    | `/home`
  type DynamicRoutes<T extends string = string> = 
    | `/api/admin/bookings/${SafeSlug<T>}`
    | `/api/admin/chat/${SafeSlug<T>}`
    | `/api/admin/services/${SafeSlug<T>}`
    | `/api/admin/users/${SafeSlug<T>}`
    | `/api/bookings/${SafeSlug<T>}/cancel`
    | `/api/bookings/${SafeSlug<T>}/confirm`
    | `/api/bookings/${SafeSlug<T>}/review`
    | `/api/conversations/${SafeSlug<T>}/messages`
    | `/api/conversations/${SafeSlug<T>}`
    | `/api/guides/${SafeSlug<T>}`
    | `/api/reviews/${SafeSlug<T>}/helpful`
    | `/api/reviews/${SafeSlug<T>}/responses`
    | `/api/reviews/${SafeSlug<T>}`
    | `/api/services/${SafeSlug<T>}`
    | `/bookings/${SafeSlug<T>}/review`
    | `/guides/${SafeSlug<T>}`
    | `/services/${SafeSlug<T>}`
    | `/admin/users/${SafeSlug<T>}`
    | `/api/v1/${OptionalCatchAllSlug<T>}`

  type RouteImpl<T> = 
    | StaticRoutes
    | SearchOrHash
    | WithProtocol
    | `${StaticRoutes}${SearchOrHash}`
    | (T extends `${DynamicRoutes<infer _>}${Suffix}` ? T : never)
    
}

declare module 'next' {
  export { default } from 'next/types/index.js'
  export * from 'next/types/index.js'

  export type Route<T extends string = string> =
    __next_route_internal_types__.RouteImpl<T>
}

declare module 'next/link' {
  import type { LinkProps as OriginalLinkProps } from 'next/dist/client/link.js'
  import type { AnchorHTMLAttributes, DetailedHTMLProps } from 'react'
  import type { UrlObject } from 'url'

  type LinkRestProps = Omit<
    Omit<
      DetailedHTMLProps<
        AnchorHTMLAttributes<HTMLAnchorElement>,
        HTMLAnchorElement
      >,
      keyof OriginalLinkProps
    > &
      OriginalLinkProps,
    'href'
  >

  export type LinkProps<RouteInferType> = LinkRestProps & {
    /**
     * The path or URL to navigate to. This is the only required prop. It can also be an object.
     * @see https://nextjs.org/docs/api-reference/next/link
     */
    href: __next_route_internal_types__.RouteImpl<RouteInferType> | UrlObject
  }

  export default function Link<RouteType>(props: LinkProps<RouteType>): JSX.Element
}

declare module 'next/navigation' {
  export * from 'next/dist/client/components/navigation.js'

  import type { NavigateOptions, AppRouterInstance as OriginalAppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime.js'
  interface AppRouterInstance extends OriginalAppRouterInstance {
    /**
     * Navigate to the provided href.
     * Pushes a new history entry.
     */
    push<RouteType>(href: __next_route_internal_types__.RouteImpl<RouteType>, options?: NavigateOptions): void
    /**
     * Navigate to the provided href.
     * Replaces the current history entry.
     */
    replace<RouteType>(href: __next_route_internal_types__.RouteImpl<RouteType>, options?: NavigateOptions): void
    /**
     * Prefetch the provided href.
     */
    prefetch<RouteType>(href: __next_route_internal_types__.RouteImpl<RouteType>): void
  }

  export declare function useRouter(): AppRouterInstance;
}
