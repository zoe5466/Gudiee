'use client';

import * as React from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DatePickerProps {
  value?: Date;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  minDate?: Date;
  maxDate?: Date;
  label?: string;
  required?: boolean;
}

export function DatePicker({
  value,
  onChange,
  placeholder = '選擇日期',
  disabled = false,
  className,
  minDate,
  maxDate,
  label,
  required = false
}: DatePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [currentMonth, setCurrentMonth] = React.useState(
    value ? new Date(value.getFullYear(), value.getMonth()) : new Date()
  );
  const [dropdownPosition, setDropdownPosition] = React.useState<'center' | 'left' | 'right'>('center');
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  React.useEffect(() => {
    if (isOpen && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const windowWidth = window.innerWidth;
      const dropdownWidth = 320;
      
      // Check if there's enough space to center the dropdown
      const spaceOnLeft = buttonRect.left + buttonRect.width / 2 - dropdownWidth / 2;
      const spaceOnRight = buttonRect.left + buttonRect.width / 2 + dropdownWidth / 2;
      
      if (spaceOnLeft < 20) {
        setDropdownPosition('left');
      } else if (spaceOnRight > windowWidth - 20) {
        setDropdownPosition('right');
      } else {
        setDropdownPosition('center');
      }
    }
  }, [isOpen]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const isDateDisabled = (date: Date) => {
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return false;
  };

  const handleDateClick = (date: Date) => {
    if (isDateDisabled(date)) return;
    onChange(date);
    setIsOpen(false);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      if (direction === 'prev') {
        newMonth.setMonth(prev.getMonth() - 1);
      } else {
        newMonth.setMonth(prev.getMonth() + 1);
      }
      return newMonth;
    });
  };

  const days = getDaysInMonth(currentMonth);
  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

  return (
    <div className={cn('relative', className)}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Input */}
      <button
        ref={buttonRef}
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        style={{
          width: '100%',
          padding: '0.75rem 1rem',
          border: isOpen ? '1px solid #3b82f6' : '1px solid #e5e7eb',
          borderRadius: '0.5rem',
          backgroundColor: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: disabled ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s',
          opacity: disabled ? 0.5 : 1,
          fontSize: '1rem',
          textAlign: 'left'
        }}
        className={isOpen ? "ring-2 ring-blue-200" : "hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"}
      >
        <span style={{ 
          color: value ? '#111827' : '#6b7280',
          fontWeight: value ? '500' : '400'
        }}>
          {value ? formatDate(value) : placeholder}
        </span>
        <Calendar style={{ 
          width: '18px', 
          height: '18px', 
          color: '#6b7280',
          flexShrink: 0
        }} />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          ref={dropdownRef}
          style={{
            position: 'absolute',
            top: 'calc(100% + 0.125rem)',
            left: dropdownPosition === 'center' ? '50%' : dropdownPosition === 'left' ? '0' : 'auto',
            right: dropdownPosition === 'right' ? '0' : 'auto',
            transform: dropdownPosition === 'center' ? 'translateX(-50%)' : 'none',
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '0.75rem',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            zIndex: 50,
            padding: '1.5rem',
            width: '320px'
          }}
        >
          {/* Arrow pointing up */}
          <div style={{
            position: 'absolute',
            top: '-6px',
            left: dropdownPosition === 'center' ? '50%' : dropdownPosition === 'left' ? '40px' : 'auto',
            right: dropdownPosition === 'right' ? '40px' : 'auto',
            transform: dropdownPosition === 'center' ? 'translateX(-50%)' : 'none',
            width: 0,
            height: 0,
            borderLeft: '6px solid transparent',
            borderRight: '6px solid transparent',
            borderBottom: '6px solid white'
          }} />
          <div style={{
            position: 'absolute',
            top: '-7px',
            left: dropdownPosition === 'center' ? '50%' : dropdownPosition === 'left' ? '40px' : 'auto',
            right: dropdownPosition === 'right' ? '40px' : 'auto',
            transform: dropdownPosition === 'center' ? 'translateX(-50%)' : 'none',
            width: 0,
            height: 0,
            borderLeft: '7px solid transparent',
            borderRight: '7px solid transparent',
            borderBottom: '7px solid #e5e7eb'
          }} />
          
          {/* Month Navigation */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.5rem'
          }}>
            <button
              type="button"
              onClick={() => navigateMonth('prev')}
              style={{
                padding: '0.5rem',
                borderRadius: '0.5rem',
                border: 'none',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              className="hover:bg-gray-100"
            >
              <ChevronLeft style={{ width: '18px', height: '18px', color: '#374151' }} />
            </button>
            
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: '600',
              color: '#111827',
              textAlign: 'center'
            }}>
              {currentMonth.toLocaleDateString('zh-TW', { 
                year: 'numeric', 
                month: 'long' 
              })}
            </h3>
            
            <button
              type="button"
              onClick={() => navigateMonth('next')}
              style={{
                padding: '0.5rem',
                borderRadius: '0.5rem',
                border: 'none',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              className="hover:bg-gray-100"
            >
              <ChevronRight style={{ width: '18px', height: '18px', color: '#374151' }} />
            </button>
          </div>

          {/* Week Days */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '0.25rem',
            marginBottom: '1rem'
          }}>
            {weekDays.map(day => (
              <div
                key={day}
                style={{
                  textAlign: 'center',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#6b7280',
                  padding: '0.75rem 0'
                }}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Days */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '0.25rem'
          }}>
            {days.map((day, index) => {
              if (!day) {
                return <div key={index} style={{ padding: '0.75rem 0' }} />;
              }

              const isSelected = value && day.toDateString() === value.toDateString();
              const isToday = day.toDateString() === new Date().toDateString();
              const isDisabled = isDateDisabled(day);

              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleDateClick(day)}
                  disabled={isDisabled}
                  style={{
                    textAlign: 'center',
                    fontSize: '0.875rem',
                    padding: '0.75rem 0',
                    borderRadius: '0.5rem',
                    border: 'none',
                    cursor: isDisabled ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s',
                    fontWeight: isSelected ? '600' : isToday ? '500' : '400',
                    backgroundColor: isSelected 
                      ? '#002C56' 
                      : isToday 
                      ? '#f3f4f6' 
                      : 'transparent',
                    color: isSelected 
                      ? 'white' 
                      : isDisabled 
                      ? '#d1d5db' 
                      : isToday 
                      ? '#111827' 
                      : '#374151'
                  }}
                  className={!isDisabled && !isSelected ? "hover:bg-blue-50 hover:text-blue-600" : ""}
                >
                  {day.getDate()}
                </button>
              );
            })}
          </div>

          {/* Today Button */}
          <div style={{
            marginTop: '1.5rem',
            paddingTop: '1rem',
            borderTop: '1px solid #e5e7eb'
          }}>
            <button
              type="button"
              onClick={() => handleDateClick(new Date())}
              style={{
                width: '100%',
                textAlign: 'center',
                fontSize: '0.875rem',
                color: '#002C56',
                fontWeight: '500',
                padding: '0.5rem',
                borderRadius: '0.5rem',
                border: 'none',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              className="hover:bg-red-50 hover:text-red-600"
            >
              今天
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Date Range Picker
interface DateRangePickerProps {
  value?: [Date?, Date?];
  onChange: (range: [Date?, Date?]) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  minDate?: Date;
  maxDate?: Date;
  label?: string;
  required?: boolean;
}

export function DateRangePicker({
  value = [undefined, undefined],
  onChange,
  placeholder = '選擇日期範圍',
  disabled = false,
  className,
  minDate,
  maxDate,
  label,
  required = false
}: DateRangePickerProps) {
  const [startDate, endDate] = value;
  
  const formatRange = () => {
    if (startDate && endDate) {
      return `${startDate.toLocaleDateString('zh-TW')} - ${endDate.toLocaleDateString('zh-TW')}`;
    }
    if (startDate) {
      return `${startDate.toLocaleDateString('zh-TW')} - ?`;
    }
    return placeholder;
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Display */}
      <div className="input flex items-center justify-between">
        <span className={startDate || endDate ? 'text-gray-900' : 'text-gray-500'}>
          {formatRange()}
        </span>
        <Calendar className="w-4 h-4 text-gray-400" />
      </div>

      {/* Date Pickers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DatePicker
          value={startDate}
          onChange={(date) => onChange([date, endDate])}
          placeholder="開始日期"
          disabled={disabled}
          minDate={minDate}
          maxDate={endDate || maxDate}
          label="開始日期"
        />
        
        <DatePicker
          value={endDate}
          onChange={(date) => onChange([startDate, date])}
          placeholder="結束日期"
          disabled={disabled}
          minDate={startDate || minDate}
          maxDate={maxDate}
          label="結束日期"
        />
      </div>
    </div>
  );
}