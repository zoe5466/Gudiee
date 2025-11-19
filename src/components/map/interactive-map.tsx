'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { MapPin, Navigation, Plus, Minus, Locate, Layers } from 'lucide-react';

interface Location {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  type: 'service' | 'guide' | 'poi' | 'user';
  description?: string;
  image?: string;
  price?: number;
  rating?: number;
  category?: string;
}

interface MapProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  locations?: Location[];
  selectedLocation?: string;
  onLocationSelect?: (location: Location) => void;
  onLocationCreate?: (coordinates: { lat: number; lng: number }) => void;
  showUserLocation?: boolean;
  showControls?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

// 簡化的地圖組件（實際專案中會使用 Google Maps 或 Mapbox）
export function InteractiveMap({
  center = { lat: 25.0330, lng: 121.5654 }, // 台北101
  zoom = 13,
  locations = [],
  selectedLocation,
  onLocationSelect,
  onLocationCreate,
  showUserLocation = true,
  showControls = true,
  style,
  className = ''
}: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [currentCenter, setCurrentCenter] = useState(center);
  const [currentZoom, setCurrentZoom] = useState(zoom);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [mapType, setMapType] = useState<'road' | 'satellite' | 'hybrid'>('road');
  const [isLoading, setIsLoading] = useState(true);

  // 模擬地圖載入
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // 獲取用戶位置
  useEffect(() => {
    if (!showUserLocation) return;

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(userPos);
        },
        (error) => {
          console.warn('無法獲取用戶位置:', error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5分鐘
        }
      );
    }
  }, [showUserLocation]);

  // 處理地圖點擊
  const handleMapClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (!onLocationCreate) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // 簡化的座標計算（實際應該使用地圖 API）
    const lat = currentCenter.lat + (rect.height / 2 - y) * 0.001;
    const lng = currentCenter.lng + (x - rect.width / 2) * 0.001;
    
    onLocationCreate({ lat, lng });
  }, [currentCenter, onLocationCreate]);

  // 縮放控制
  const handleZoomIn = useCallback(() => {
    setCurrentZoom(prev => Math.min(prev + 1, 20));
  }, []);

  const handleZoomOut = useCallback(() => {
    setCurrentZoom(prev => Math.max(prev - 1, 1));
  }, []);

  // 定位到用戶位置
  const handleLocateUser = useCallback(() => {
    if (userLocation) {
      setCurrentCenter(userLocation);
      setCurrentZoom(15);
    }
  }, [userLocation]);

  // 計算標記位置（簡化版）
  const getMarkerPosition = useCallback((location: Location) => {
    const latOffset = (location.latitude - currentCenter.lat) * 1000;
    const lngOffset = (location.longitude - currentCenter.lng) * 1000;
    
    return {
      top: `${50 - latOffset}%`,
      left: `${50 + lngOffset}%`
    };
  }, [currentCenter]);

  // 獲取標記顏色
  const getMarkerColor = (type: Location['type']) => {
    switch (type) {
      case 'service': return '#2563eb';
      case 'guide': return '#10b981';
      case 'poi': return '#f59e0b';
      case 'user': return '#ef4444';
      default: return '#6b7280';
    }
  };

  // 獲取地圖背景樣式
  const getMapBackground = () => {
    switch (mapType) {
      case 'satellite':
        return `url("data:image/svg+xml,${encodeURIComponent(`
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
            <rect width="100" height="100" fill="#1a5f3f"/>
            <circle cx="20" cy="30" r="15" fill="#2d7a4f" opacity="0.7"/>
            <circle cx="70" cy="60" r="20" fill="#34865b" opacity="0.6"/>
            <circle cx="40" cy="80" r="12" fill="#3d9c6b" opacity="0.8"/>
          </svg>
        `)}")`;
      case 'hybrid':
        return `linear-gradient(45deg, #f0f9ff 25%, #e0f2fe 25%, #e0f2fe 50%, #f0f9ff 50%, #f0f9ff 75%, #e0f2fe 75%)`;
      default:
        return `linear-gradient(45deg, #f8fafc 25%, #f1f5f9 25%, #f1f5f9 50%, #f8fafc 50%, #f8fafc 75%, #f1f5f9 75%)`;
    }
  };

  if (isLoading) {
    return (
      <div 
        style={{
          width: '100%',
          height: '400px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f3f4f6',
          borderRadius: '0.5rem',
          ...style
        }}
        className={className}
      >
        <div style={{ textAlign: 'center', color: '#6b7280' }}>
          <div style={{
            width: '2rem',
            height: '2rem',
            border: '2px solid #e5e7eb',
            borderTop: '2px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 0.5rem'
          }} />
          載入地圖中...
        </div>
      </div>
    );
  }

  return (
    <div 
      style={{
        position: 'relative',
        width: '100%',
        height: '400px',
        borderRadius: '0.5rem',
        overflow: 'hidden',
        backgroundColor: '#f3f4f6',
        ...style
      }}
      className={className}
    >
      {/* 地圖主體 */}
      <div
        ref={mapRef}
        onClick={handleMapClick}
        style={{
          width: '100%',
          height: '100%',
          background: getMapBackground(),
          backgroundSize: '20px 20px',
          cursor: onLocationCreate ? 'crosshair' : 'grab',
          position: 'relative'
        }}
      >
        {/* 地點標記 */}
        {locations.map((location) => {
          const position = getMarkerPosition(location);
          const isSelected = selectedLocation === location.id;
          
          return (
            <div
              key={location.id}
              onClick={(e) => {
                e.stopPropagation();
                onLocationSelect?.(location);
              }}
              style={{
                position: 'absolute',
                transform: 'translate(-50%, -100%)',
                cursor: 'pointer',
                zIndex: isSelected ? 20 : 10,
                ...position
              }}
            >
              {/* 標記圖示 */}
              <div style={{
                width: isSelected ? '2rem' : '1.5rem',
                height: isSelected ? '2rem' : '1.5rem',
                backgroundColor: getMarkerColor(location.type),
                borderRadius: '50% 50% 50% 0',
                transform: 'rotate(-45deg)',
                border: '2px solid white',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <MapPin 
                  style={{ 
                    width: '0.75rem', 
                    height: '0.75rem', 
                    color: 'white',
                    transform: 'rotate(45deg)'
                  }} 
                />
              </div>
              
              {/* 資訊彈窗 */}
              {isSelected && (
                <div style={{
                  position: 'absolute',
                  bottom: '100%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: 'white',
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  border: '1px solid #e5e7eb',
                  minWidth: '12rem',
                  marginBottom: '0.5rem',
                  zIndex: 30
                }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#111827', marginBottom: '0.25rem' }}>
                    {location.name}
                  </div>
                  {location.description && (
                    <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                      {location.description}
                    </div>
                  )}
                  {location.price && (
                    <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#2563eb' }}>
                      NT$ {location.price.toLocaleString()}
                    </div>
                  )}
                  {location.rating && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem' }}>
                      <span style={{ color: '#f59e0b' }}>★</span>
                      <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{location.rating}</span>
                    </div>
                  )}
                  
                  {/* 箭頭 */}
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 0,
                    height: 0,
                    borderLeft: '6px solid transparent',
                    borderRight: '6px solid transparent',
                    borderTop: '6px solid white'
                  }} />
                </div>
              )}
            </div>
          );
        })}

        {/* 用戶位置標記 */}
        {userLocation && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 15
            }}
          >
            <div style={{
              width: '1rem',
              height: '1rem',
              backgroundColor: '#3b82f6',
              border: '3px solid white',
              borderRadius: '50%',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }} />
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '3rem',
              height: '3rem',
              transform: 'translate(-50%, -50%)',
              border: '2px solid #3b82f6',
              borderRadius: '50%',
              opacity: 0.3,
              animation: 'pulse 2s infinite'
            }} />
          </div>
        )}
      </div>

      {/* 控制面板 */}
      {showControls && (
        <>
          {/* 縮放控制 */}
          <div style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.25rem',
            zIndex: 20
          }}>
            <button
              onClick={handleZoomIn}
              style={{
                width: '2.5rem',
                height: '2.5rem',
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '0.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
              className="hover:bg-[#cfdbe9]"
            >
              <Plus style={{ width: '1rem', height: '1rem', color: '#374151' }} />
            </button>
            <button
              onClick={handleZoomOut}
              style={{
                width: '2.5rem',
                height: '2.5rem',
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '0.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
              className="hover:bg-[#cfdbe9]"
            >
              <Minus style={{ width: '1rem', height: '1rem', color: '#374151' }} />
            </button>
          </div>

          {/* 定位按鈕 */}
          {userLocation && (
            <button
              onClick={handleLocateUser}
              style={{
                position: 'absolute',
                top: '1rem',
                left: '1rem',
                width: '2.5rem',
                height: '2.5rem',
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '0.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                zIndex: 20
              }}
              className="hover:bg-[#cfdbe9]"
            >
              <Locate style={{ width: '1rem', height: '1rem', color: '#374151' }} />
            </button>
          )}

          {/* 地圖類型切換 */}
          <div style={{
            position: 'absolute',
            bottom: '1rem',
            right: '1rem',
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '0.25rem',
            overflow: 'hidden',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            zIndex: 20
          }}>
            <select
              value={mapType}
              onChange={(e) => setMapType(e.target.value as any)}
              style={{
                padding: '0.5rem',
                border: 'none',
                backgroundColor: 'transparent',
                fontSize: '0.875rem',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              <option value="road">道路</option>
              <option value="satellite">衛星</option>
              <option value="hybrid">混合</option>
            </select>
          </div>
        </>
      )}

      {/* 比例尺 */}
      <div style={{
        position: 'absolute',
        bottom: '1rem',
        left: '1rem',
        backgroundColor: 'white',
        padding: '0.25rem 0.5rem',
        borderRadius: '0.25rem',
        fontSize: '0.75rem',
        color: '#6b7280',
        border: '1px solid #e5e7eb',
        zIndex: 20
      }}>
        縮放級別: {currentZoom}
      </div>
    </div>
  );
}