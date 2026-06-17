'use client'

import { createContext, useContext, useLayoutEffect, useState } from 'react'
import { Footer } from './footer'

type FooterContextType = {
  disableFooter: () => void
  enableFooter: () => void
}

const FooterContext = createContext<FooterContextType>({
  disableFooter: () => {},
  enableFooter: () => {},
})

export function FooterProvider({ children }: { children: React.ReactNode }) {
  const [footerEnabled, setFooterEnabled] = useState(true)

  return (
    <FooterContext.Provider
      value={{
        disableFooter: () => setFooterEnabled(false),
        enableFooter: () => setFooterEnabled(true),
      }}
    >
      {children}
      {footerEnabled && <Footer />}
    </FooterContext.Provider>
  )
}

/**
 * Render this component inside any page to hide the global footer.
 * The footer is automatically restored when navigating away.
 *
 * @example
 * // app/my-page/page.tsx
 * import { DisableFooter } from '@/components/footer/footer-provider'
 * export default function MyPage() {
 *   return <>
 *     <DisableFooter />
 *     ...page content...
 *   </>
 * }
 */
export function DisableFooter() {
  const { disableFooter, enableFooter } = useContext(FooterContext)
  useLayoutEffect(() => {
    disableFooter()
    return () => enableFooter()
  }, [disableFooter, enableFooter])
  return null
}
