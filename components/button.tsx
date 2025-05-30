import { Link } from '@/components/link'
import * as Headless from '@headlessui/react'
import { clsx } from 'clsx'

const variants = {
  primary: clsx(
    'inline-flex items-center justify-center px-4 py-[calc(theme(spacing.2)-1px)]',
    'rounded-full border border-transparent shadow-md',
    'whitespace-nowrap text-base font-medium text-white',
    'bg-pink-400 data-[hover]:bg-pink-600',
    'selection:bg-indigo-800 selection:text-pink-600',
    'transition duration-200 ease-in-out', // Added hover animation
  ),
  secondary: clsx(
    'inline-flex items-center justify-center px-4 py-[calc(theme(spacing.2)-1px)]',
    'rounded-full border border-transparent shadow-md',
    'whitespace-nowrap text-base font-medium text-white',
    'bg-indigo-500 data-[hover]:bg-indigo-600',
    'selection:bg-pink-400 selection:text-indigo-800',
    'transition duration-200 ease-in-out', // Added hover animation
  ),
  outline: clsx(
    'inline-flex items-center justify-center px-2 py-[calc(theme(spacing.[1.5])-1px)]',
    'rounded-lg border border-transparent shadow ring-1 ring-black/10',
    'whitespace-nowrap text-sm font-medium text-gray-950',
    'data-[disabled]:bg-transparent data-[hover]:bg-gray-50 data-[disabled]:opacity-40',
    'transition duration-200 ease-in-out', // Added hover animation
  ),
}

type ButtonProps = {
  variant?: keyof typeof variants
  className?: string
} & (
  | ({ href: string } & React.ComponentPropsWithoutRef<typeof Link>)
  | ({ href?: undefined } & Headless.ButtonProps)
)

export function Button({
  variant = 'primary',
  className,
  ...props
}: ButtonProps) {
  className = clsx(className, variants[variant])

  if (props.href !== undefined) {
    return <Link {...props} className={className} />
  } else {
    return <Headless.Button {...props} className={className} />
  }
}
