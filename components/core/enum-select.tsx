'use client'

import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import { ChevronUpDownIcon } from '@heroicons/react/16/solid'
import { useState } from 'react'

type EnumLike = { [key: string]: string | number }

interface EnumSelectProps<T extends EnumLike> {
  id: string
  name: string
  enumObject: T
  placeholder: string
  required?: boolean
  className?: string
  value?: string
  onChange?: (value: T[keyof T]) => void
}

const formatLabel = (val: string) =>
  val.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())

export function EnumSelect<T extends EnumLike>({
  id,
  name,
  enumObject,
  placeholder,
  required = false,
  className = '',
  value: controlledValue,
  onChange,
}: EnumSelectProps<T>) {
  const [internalValue, setInternalValue] = useState('')
  const value = controlledValue !== undefined ? controlledValue : internalValue

  const handleChange = (newValue: string) => {
    if (controlledValue === undefined) {
      setInternalValue(newValue)
    }
    onChange?.(newValue as T[keyof T])
  }

  const options = Object.values(enumObject).map(String)

  return (
    <Listbox value={value} onChange={handleChange}>
      {/* Hidden native input so form validation and POST still work */}
      <input type="hidden" id={id} name={name} value={value} required={required} />

      <div className={`relative mt-2 ${className}`}>
        <ListboxButton
          className={`flex w-full items-center justify-between rounded-md border border-[var(--input-border)] bg-[var(--input-bg)] px-3 py-2 text-left shadow-sm transition-colors focus:border-[var(--input-focus-ring)] focus:ring-1 focus:ring-[var(--input-focus-ring)] focus:outline-none ${value === '' ? 'text-[var(--input-placeholder)]' : 'text-[var(--input-text)]'}`}
        >
          <span>{value === '' ? placeholder : formatLabel(value)}</span>
          <ChevronUpDownIcon className="h-4 w-4 shrink-0 text-[var(--text-muted)]" />
        </ListboxButton>

        <ListboxOptions
          anchor="bottom start"
          className="z-50 mt-1 w-(--button-width) overflow-auto rounded-md border border-[var(--input-border)] bg-[var(--input-bg)] py-1 text-sm shadow-lg focus:outline-none"
        >
          {options.map((val) => (
            <ListboxOption
              key={val}
              value={val}
              className="select-option"
            >
              {formatLabel(val)}
            </ListboxOption>
          ))}
        </ListboxOptions>
      </div>
    </Listbox>
  )
}
