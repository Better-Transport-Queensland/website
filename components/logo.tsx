import logo_dark from '@/public/btq_wordmark_dark.svg'
import logo from '@/public/btq_wordmark_light.svg'
import { clsx } from 'clsx'
import Image from 'next/image'

export function Logo({
  className,
  filled,
}: {
  className?: string
  filled: true | undefined
}) {
  return (
    <div className={clsx(className, 'flex items-center overflow-visible')}>
      {filled ? (
        <Image
          src={logo_dark}
          alt="Logo"
          priority
          className="h-auto w-44 sm:w-48 lg:w-52"
        />
      ) : (
        <Image
          src={logo}
          alt="Logo"
          priority
          className="h-auto w-44 sm:w-48 lg:w-52"
        />
      )}
    </div>
  )
}
