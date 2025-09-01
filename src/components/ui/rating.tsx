'use client';

import * as React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingProps {
  value: number;
  onChange?: (value: number) => void;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  readonly?: boolean;
  allowHalf?: boolean;
  className?: string;
  showValue?: boolean;
  showCount?: boolean;
  count?: number;
}

export function Rating({
  value,
  onChange,
  max = 5,
  size = 'md',
  readonly = false,
  allowHalf = false,
  className,
  showValue = false,
  showCount = false,
  count
}: RatingProps) {
  const [hoverValue, setHoverValue] = React.useState<number | null>(null);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const handleClick = (starValue: number) => {
    if (readonly || !onChange) return;
    onChange(starValue);
  };

  const handleMouseEnter = (starValue: number) => {
    if (readonly) return;
    setHoverValue(starValue);
  };

  const handleMouseLeave = () => {
    if (readonly) return;
    setHoverValue(null);
  };

  const getStarValue = (index: number) => {
    const starValue = index + 1;
    const currentValue = hoverValue !== null ? hoverValue : value;
    
    if (allowHalf) {
      if (currentValue >= starValue) return 'full';
      if (currentValue >= starValue - 0.5) return 'half';
      return 'empty';
    } else {
      return currentValue >= starValue ? 'full' : 'empty';
    }
  };

  return (
    <div className={cn('flex items-center space-x-1', className)}>
      <div className="flex items-center">
        {Array.from({ length: max }, (_, index) => {
          const starValue = index + 1;
          const fillType = getStarValue(index);

          return (
            <button
              key={index}
              type="button"
              className={cn(
                'relative transition-colors',
                !readonly && 'hover:scale-110 cursor-pointer',
                readonly && 'cursor-default'
              )}
              onClick={() => handleClick(starValue)}
              onMouseEnter={() => handleMouseEnter(starValue)}
              onMouseLeave={handleMouseLeave}
              disabled={readonly}
            >
              <Star
                className={cn(
                  sizeClasses[size],
                  'transition-colors',
                  fillType === 'full'
                    ? 'text-yellow-400 fill-yellow-400'
                    : fillType === 'half'
                    ? 'text-yellow-400'
                    : 'text-gray-300'
                )}
              />
              {fillType === 'half' && (
                <div className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
                  <Star
                    className={cn(
                      sizeClasses[size],
                      'text-yellow-400 fill-yellow-400'
                    )}
                  />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {showValue && (
        <span className="text-sm text-gray-600 font-medium">
          {value.toFixed(1)}
        </span>
      )}

      {showCount && count !== undefined && (
        <span className="text-sm text-gray-500">
          ({count})
        </span>
      )}
    </div>
  );
}

// Display-only Rating Component
interface DisplayRatingProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showValue?: boolean;
  showCount?: boolean;
  count?: number;
}

export function DisplayRating({
  value,
  max = 5,
  size = 'md',
  className,
  showValue = true,
  showCount = false,
  count
}: DisplayRatingProps) {
  return (
    <Rating
      value={value}
      max={max}
      size={size}
      readonly
      allowHalf
      className={className}
      showValue={showValue}
      showCount={showCount}
      count={count}
    />
  );
}

// Rating Input Component
interface RatingInputProps {
  value: number;
  onChange: (value: number) => void;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  label?: string;
  required?: boolean;
}

export function RatingInput({
  value,
  onChange,
  max = 5,
  size = 'md',
  className,
  label,
  required = false
}: RatingInputProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <Rating
        value={value}
        onChange={onChange}
        max={max}
        size={size}
        showValue
      />
    </div>
  );
}