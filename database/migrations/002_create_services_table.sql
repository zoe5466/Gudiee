-- 002_create_services_table.sql
-- 創建服務表

CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- 基本資訊
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  short_description VARCHAR(500),
  
  -- 服務詳情
  service_type service_type_enum DEFAULT 'tour_guide',
  duration_hours INTEGER, -- 建議服務時數
  max_participants INTEGER DEFAULT 1,
  min_advance_booking INTEGER DEFAULT 24, -- 最少提前預訂時數
  
  -- 地理位置
  city VARCHAR(100) NOT NULL,
  country VARCHAR(2) NOT NULL, -- ISO 3166-1 alpha-2
  coverage_areas TEXT[], -- 服務範圍
  meeting_points JSONB, -- 會面地點 [{name, address, lat, lng}]
  
  -- 價格設定
  price_per_hour DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'TWD',
  pricing_model pricing_model_enum DEFAULT 'hourly',
  
  -- 取消政策
  cancellation_policy cancellation_policy_enum DEFAULT 'standard',
  
  -- 服務語言
  languages VARCHAR(5)[] NOT NULL,
  
  -- 媒體資源
  images TEXT[], -- 圖片URLs
  video_url TEXT,
  
  -- 可用性
  availability JSONB, -- 可預訂時段 {days: [], times: []}
  
  -- 服務狀態
  status service_status_enum DEFAULT 'draft',
  is_featured BOOLEAN DEFAULT false,
  
  -- 統計數據
  rating DECIMAL(3,2),
  review_count INTEGER DEFAULT 0,
  booking_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  
  -- 管理欄位
  admin_notes TEXT,
  featured_until TIMESTAMP,
  
  -- 系統欄位
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  published_at TIMESTAMP,
  deleted_at TIMESTAMP
);

-- 創建枚舉類型
CREATE TYPE service_type_enum AS ENUM (
  'tour_guide', 'translator', 'photographer', 'driver', 
  'food_guide', 'shopping_guide', 'cultural_experience', 'other'
);

CREATE TYPE pricing_model_enum AS ENUM ('hourly', 'half_day', 'full_day', 'custom');

CREATE TYPE cancellation_policy_enum AS ENUM ('flexible', 'standard', 'strict');

CREATE TYPE service_status_enum AS ENUM ('draft', 'pending_review', 'published', 'suspended', 'archived');

-- 創建索引
CREATE INDEX idx_services_provider_id ON services(provider_id);
CREATE INDEX idx_services_city ON services(city);
CREATE INDEX idx_services_country ON services(country);
CREATE INDEX idx_services_service_type ON services(service_type);
CREATE INDEX idx_services_status ON services(status);
CREATE INDEX idx_services_is_featured ON services(is_featured);
CREATE INDEX idx_services_rating ON services(rating);
CREATE INDEX idx_services_price_per_hour ON services(price_per_hour);
CREATE INDEX idx_services_created_at ON services(created_at);
CREATE INDEX idx_services_languages ON services USING GIN(languages);

-- 全文搜索索引
CREATE INDEX idx_services_search ON services USING GIN(
  to_tsvector('chinese', COALESCE(title, '') || ' ' || COALESCE(description, ''))
);

-- 創建更新時間觸發器
CREATE TRIGGER update_services_updated_at 
    BEFORE UPDATE ON services 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 添加註解
COMMENT ON TABLE services IS '服務表 - 地陪提供的各種服務';
COMMENT ON COLUMN services.service_type IS '服務類型';
COMMENT ON COLUMN services.pricing_model IS '計價模式';
COMMENT ON COLUMN services.cancellation_policy IS '取消政策';
COMMENT ON COLUMN services.meeting_points IS '會面地點JSON數組';
COMMENT ON COLUMN services.availability IS '可預訂時段JSON格式';