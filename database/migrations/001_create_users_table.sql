-- 001_create_users_table.sql
-- 創建用戶表

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20) UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role user_role NOT NULL DEFAULT 'traveler',
  
  -- 基本資料
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  avatar_url TEXT,
  date_of_birth DATE,
  gender gender_type,
  nationality VARCHAR(2), -- ISO 3166-1 alpha-2
  
  -- 身分驗證
  kyc_status kyc_status_type DEFAULT 'pending',
  kyc_documents JSONB,
  kyc_verified_at TIMESTAMP,
  
  -- 帳戶狀態
  is_active BOOLEAN DEFAULT true,
  is_verified BOOLEAN DEFAULT false,
  email_verified_at TIMESTAMP,
  phone_verified_at TIMESTAMP,
  
  -- 偏好設定
  preferred_language VARCHAR(5) DEFAULT 'zh-TW',
  preferred_currency VARCHAR(3) DEFAULT 'TWD',
  timezone VARCHAR(50) DEFAULT 'Asia/Taipei',
  
  -- 地陪特定欄位
  provider_rating DECIMAL(3,2),
  provider_review_count INTEGER DEFAULT 0,
  provider_services_completed INTEGER DEFAULT 0,
  provider_bio TEXT,
  provider_specialties TEXT[],
  provider_languages VARCHAR(5)[],
  provider_coverage_areas TEXT[],
  
  -- 系統欄位
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_login_at TIMESTAMP,
  deleted_at TIMESTAMP
);

-- 創建枚舉類型
CREATE TYPE user_role AS ENUM ('traveler', 'provider', 'admin');
CREATE TYPE gender_type AS ENUM ('male', 'female', 'other', 'prefer_not_to_say');
CREATE TYPE kyc_status_type AS ENUM ('pending', 'submitted', 'approved', 'rejected', 'expired');

-- 創建索引
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_kyc_status ON users(kyc_status);
CREATE INDEX idx_users_is_active ON users(is_active);
CREATE INDEX idx_users_created_at ON users(created_at);

-- 創建更新時間觸發器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 添加註解
COMMENT ON TABLE users IS '用戶表 - 支援旅客、地陪、管理員三種角色';
COMMENT ON COLUMN users.role IS '用戶角色: traveler(旅客), provider(地陪), admin(管理員)';
COMMENT ON COLUMN users.kyc_status IS 'KYC驗證狀態';
COMMENT ON COLUMN users.provider_rating IS '地陪平均評分 (1-5分)';
COMMENT ON COLUMN users.provider_specialties IS '地陪專長領域';
COMMENT ON COLUMN users.provider_languages IS '地陪服務語言';
COMMENT ON COLUMN users.provider_coverage_areas IS '地陪服務區域';