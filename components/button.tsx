import { Link } from '@/components/link'
import * as Headless from '@headlessui/react'
import { clsx } from 'clsx'

const variants = {
  primary: clsx(
    'inline-flex items-center justify-center border border-transparent shadow-md',
    'text-base font-bold whitespace-nowrap text-white',
    'bg-fuchsia-500 data-[hover]:bg-fuchsia-700',
    'selection:bg-indigo-800 selection:text-fuchsia-600',
    'transition duration-200 ease-in-out',
  ),
  secondary: clsx(
    'inline-flex items-center justify-center border border-transparent shadow-md',
    'text-base font-bold whitespace-nowrap text-white',
    'bg-indigo-500 data-[hover]:bg-indigo-600',
    'selection:bg-fuchsia-400 selection:text-indigo-800',
    'transition duration-200 ease-in-out',
  ),
  outline: clsx(
    'inline-flex items-center justify-center border border-transparent shadow ring-1 ring-black/10',
    'font-medium whitespace-nowrap text-gray-950',
    'data-[disabled]:bg-transparent data-[disabled]:opacity-40 data-[hover]:bg-gray-50',
    'transition duration-200 ease-in-out',
  ),
}

const sizes = {
  large: clsx('rounded-full px-5 py-2 text-lg'),
  medium: clsx('text-md rounded-full px-5 py-2'), // Default size
  small: clsx('rounded-full px-4 py-1.5 text-sm'),
}

type ButtonProps = {
  variant?: keyof typeof variants
  size?: keyof typeof sizes
  className?: string
} & (
  | ({ href: string } & React.ComponentPropsWithoutRef<typeof Link>)
  | ({ href?: undefined } & Headless.ButtonProps)
)

export function Button({
  variant = 'primary',
  size = 'medium',
  className,
  ...props
}: ButtonProps) {
  className = clsx(className, variants[variant], sizes[size])

  if (props.href !== undefined) {
    return <Link {...props} className={className} />
  } else {
    return <Headless.Button {...props} className={className} />
  }
}
