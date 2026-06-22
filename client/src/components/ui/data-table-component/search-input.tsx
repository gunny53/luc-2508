'use client'
import * as React from 'react'
import { Input } from '@/components/ui/input'
import { Search as SearchIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value?: string
  onValueChange?: (value: string) => void
  onSearch?: (value: string) => void
  placeholder?: string
  debounce?: number
  icon?: React.ReactNode
  className?: string
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value: controlledValue,
  onValueChange,
  onSearch,
  placeholder = 'Search...',
  debounce = 0,
  icon,
  className,
  onChange,
  ...rest
}) => {
  const [localValue, setLocalValue] = React.useState(controlledValue || '')
  const debounceTimeout = React.useRef<NodeJS.Timeout | null>(null)
  React.useEffect(() => {
    if (controlledValue !== undefined) {
      setLocalValue(controlledValue)
    }
  }, [controlledValue])

  React.useEffect(() => {
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current)
      }
    }
  }, [])
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setLocalValue(newValue)
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current)
    }
    if (debounce > 0) {
      debounceTimeout.current = setTimeout(() => {
        onValueChange?.(newValue)
      }, debounce)
    } else {
      onValueChange?.(newValue)
    }
    onChange?.(e)
  }
  const handleSearch = () => {
    onSearch?.(localValue)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className={cn('relative flex items-center', className)}>
      <Input
        type="text"
        value={localValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="pl-10 pr-4"
        {...rest}
      />
      <button
        type="button"
        className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary focus:outline-none"
        tabIndex={-1}
        onClick={handleSearch}
      >
        {icon || <SearchIcon size={18} />}
      </button>
    </div>
  )
}

export default SearchInput
