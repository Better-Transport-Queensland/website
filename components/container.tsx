import { clsx } from 'clsx'

export function Container({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className="px-6 lg:px-8">
      <div className={clsx(className, 'mx-auto max-w-2xl lg:max-w-7xl')}>
        {children}
      </div>
    </div>
  )
}
