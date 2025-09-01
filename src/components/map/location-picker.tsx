'use client';

import { useState, useCallback } from 'react';
import { MapPin, X, Check, Search } from 'lucide-react';
import { InteractiveMap } from './interactive-map';

interface LocationPickerProps {
  initialLocation?: { lat: number; lng: number };
  onLocationSelect: (location: { lat: number; lng: number; address?: string }) => void;
  onClose?: () => void;
  title?: string;
  className?: string;
}

export function LocationPicker({
  initialLocation = { lat: 25.0330, lng: 121.5654 },
  onLocationSelect,
  onClose,
  title = '選擇位置',
  className = ''
}: LocationPickerProps) {
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Handle map click to select location
  const handleLocationCreate = useCallback((coordinates: { lat: number; lng: number }) => {
    setSelectedLocation(coordinates);
  }, []);

  // Handle search for address
  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      // In production, this would use a geocoding API like Google Maps Geocoding
      // For demo purposes, we'll simulate the search
      console.log('Searching for:', searchQuery);
      
      // Mock search results for Taiwan locations
      const mockResults = [
        { lat: 25.0330, lng: 121.5654, address: '台北101' },
        { lat: 25.0478, lng: 121.5318, address: '西門町' },
        { lat: 25.0319, lng: 121.5654, address: '信義區' },
        { lat: 25.0855, lng: 121.5606, address: '士林夜市' }
      ];
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Pick a random result for demo
      const result = mockResults[Math.floor(Math.random() * mockResults.length)];
      if (result) {
        setSelectedLocation({ lat: result.lat, lng: result.lng });
      }
      
    } catch (error) {
      console.error('Address search failed:', error);
    } finally {
      setIsSearching(false);
    }
  }, [searchQuery]);

  // Handle confirm selection
  const handleConfirm = useCallback(() => {
    if (selectedLocation) {
      // In production, this would reverse geocode to get the address
      const mockAddress = `台北市信義區 (${selectedLocation.lat.toFixed(4)}, ${selectedLocation.lng.toFixed(4)})`;
      
      onLocationSelect({
        ...selectedLocation,
        address: mockAddress
      });
    }
  }, [selectedLocation, onLocationSelect]);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }} className={className}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '0.5rem',
        width: '100%',
        maxWidth: '800px',
        height: '90vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1rem',
          borderBottom: '1px solid #e5e7eb'
        }}>
          <h3 style={{
            fontSize: '1.125rem',
            fontWeight: '600',
            color: '#111827',
            margin: 0
          }}>
            {title}
          </h3>
          {onClose && (
            <button
              onClick={onClose}
              style={{
                padding: '0.5rem',
                backgroundColor: 'transparent',
                border: 'none',
                borderRadius: '0.25rem',
                cursor: 'pointer'
              }}
              className="hover:bg-gray-100"
            >
              <X style={{ width: '1.25rem', height: '1.25rem', color: '#6b7280' }} />
            </button>
          )}
        </div>

        {/* Search Bar */}
        <div style={{
          padding: '1rem',
          borderBottom: '1px solid #e5e7eb'
        }}>
          <div style={{
            display: 'flex',
            gap: '0.5rem'
          }}>
            <div style={{
              position: 'relative',
              flex: 1
            }}>
              <Search style={{
                position: 'absolute',
                left: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '1rem',
                height: '1rem',
                color: '#9ca3af'
              }} />
              <input
                type="text"
                placeholder="搜尋地址或地標..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch();
                  }
                }}
                style={{
                  width: '100%',
                  padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  outline: 'none'
                }}
                className="focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={!searchQuery.trim() || isSearching}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: searchQuery.trim() && !isSearching ? 'pointer' : 'not-allowed',
                opacity: searchQuery.trim() && !isSearching ? 1 : 0.6
              }}
              className="hover:bg-blue-600"
            >
              {isSearching ? '搜尋中...' : '搜尋'}
            </button>
          </div>
          
          <p style={{
            fontSize: '0.75rem',
            color: '#6b7280',
            margin: '0.5rem 0 0'
          }}>
            點擊地圖上的任意位置來選擇位置，或使用搜尋功能找到特定地址
          </p>
        </div>

        {/* Map */}
        <div style={{ flex: 1, position: 'relative' }}>
          <InteractiveMap
            center={selectedLocation || initialLocation}
            zoom={15}
            locations={selectedLocation ? [{
              id: 'selected-location',
              name: '選擇的位置',
              latitude: selectedLocation.lat,
              longitude: selectedLocation.lng,
              type: 'user'
            }] : []}
            onLocationCreate={handleLocationCreate}
            showUserLocation={true}
            showControls={true}
            style={{ height: '100%' }}
          />
          
          {/* Selected location info */}
          {selectedLocation && (
            <div style={{
              position: 'absolute',
              top: '1rem',
              left: '1rem',
              right: '1rem',
              backgroundColor: 'white',
              borderRadius: '0.5rem',
              padding: '1rem',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}>
                <div style={{
                  width: '2rem',
                  height: '2rem',
                  backgroundColor: '#3b82f6',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <MapPin style={{ width: '1rem', height: '1rem', color: 'white' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#111827',
                    marginBottom: '0.25rem'
                  }}>
                    已選擇位置
                  </div>
                  <div style={{
                    fontSize: '0.75rem',
                    color: '#6b7280'
                  }}>
                    緯度: {selectedLocation.lat.toFixed(6)}, 經度: {selectedLocation.lng.toFixed(6)}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1rem',
          borderTop: '1px solid #e5e7eb',
          backgroundColor: '#f8fafc'
        }}>
          <div style={{
            fontSize: '0.875rem',
            color: '#6b7280'
          }}>
            {selectedLocation ? '已選擇位置，點擊確認完成選擇' : '請在地圖上點擊選擇位置'}
          </div>
          
          <div style={{
            display: 'flex',
            gap: '0.5rem'
          }}>
            {onClose && (
              <button
                onClick={onClose}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: 'transparent',
                  color: '#6b7280',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
                className="hover:bg-gray-50"
              >
                取消
              </button>
            )}
            
            <button
              onClick={handleConfirm}
              disabled={!selectedLocation}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: selectedLocation ? '#10b981' : '#e5e7eb',
                color: selectedLocation ? 'white' : '#9ca3af',
                border: 'none',
                borderRadius: '0.375rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: selectedLocation ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
              className="hover:bg-green-600"
            >
              <Check style={{ width: '1rem', height: '1rem' }} />
              確認選擇
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}