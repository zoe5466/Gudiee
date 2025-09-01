-- 003_create_orders_table.sql
-- 創建訂單表

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number VARCHAR(20) UNIQUE NOT NULL, -- GD-20241201-001
  
  -- 關聯方
  traveler_id UUID NOT NULL REFERENCES users(id),
  provider_id UUID NOT NULL REFERENCES users(id),
  service_id UUID NOT NULL REFERENCES services(id),
  
  -- 服務詳情
  service_date DATE NOT NULL,
  service_time TIME NOT NULL,
  duration_hours INTEGER NOT NULL,
  participants_count INTEGER DEFAULT 1,
  
  -- 會面資訊
  meeting_point JSONB NOT NULL, -- {name, address, lat, lng}
  special_requirements TEXT,
  
  -- 金額計算
  service_amount DECIMAL(10,2) NOT NULL, -- 服務費用
  platform_fee DECIMAL(10,2) NOT NULL, -- 平台服務費 (5%)
  provider_commission DECIMAL(10,2) NOT NULL, -- 平台抽成 (15%)
  total_amount DECIMAL(10,2) NOT NULL, -- 旅客總付款
  provider_earning DECIMAL(10,2) NOT NULL, -- 地陪實收
  currency VARCHAR(3) DEFAULT 'TWD',
  
  -- 訂單狀態
  status order_status_enum DEFAULT 'pending_confirmation',
  
  -- 付款資訊
  payment_method VARCHAR(50),
  payment_provider VARCHAR(50), -- stripe, newebpay
  payment_transaction_id VARCHAR(100),
  paid_at TIMESTAMP,
  
  -- 服務完成
  service_started_at TIMESTAMP,
  service_completed_at TIMESTAMP,
  
  -- 取消相關
  cancelled_at TIMESTAMP,
  cancelled_by_user_id UUID REFERENCES users(id),
  cancellation_reason TEXT,
  refund_amount DECIMAL(10,2),
  refund_processed_at TIMESTAMP,
  
  -- 地陪回應
  provider_response provider_response_enum,
  provider_responded_at TIMESTAMP,
  provider_decline_reason TEXT,
  
  -- 系統欄位
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP
);

-- 創建枚舉類型
CREATE TYPE order_status_enum AS ENUM (
  'pending_confirmation', -- 等待地陪確認
  'confirmed',           -- 已確認
  'paid',               -- 已付款
  'in_progress',        -- 服務進行中
  'completed',          -- 已完成
  'cancelled',          -- 已取消
  'refunded',           -- 已退款
  'disputed'            -- 爭議中
);

CREATE TYPE provider_response_enum AS ENUM ('pending', 'accepted', 'declined');

-- 創建索引
CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_orders_traveler_id ON orders(traveler_id);
CREATE INDEX idx_orders_provider_id ON orders(provider_id);
CREATE INDEX idx_orders_service_id ON orders(service_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_service_date ON orders(service_date);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_orders_payment_transaction_id ON orders(payment_transaction_id);

-- 創建複合索引
CREATE INDEX idx_orders_provider_status ON orders(provider_id, status);
CREATE INDEX idx_orders_traveler_status ON orders(traveler_id, status);

-- 創建更新時間觸發器
CREATE TRIGGER update_orders_updated_at 
    BEFORE UPDATE ON orders 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 訂單號生成函數
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
    order_date TEXT;
    sequence_num INTEGER;
    order_num TEXT;
BEGIN
    order_date := to_char(NOW(), 'YYYYMMDD');
    
    -- 獲取當日訂單序號
    SELECT COALESCE(MAX(CAST(RIGHT(order_number, 3) AS INTEGER)), 0) + 1
    INTO sequence_num
    FROM orders 
    WHERE order_number LIKE 'GD-' || order_date || '-%';
    
    order_num := 'GD-' || order_date || '-' || LPAD(sequence_num::TEXT, 3, '0');
    
    RETURN order_num;
END;
$$ LANGUAGE plpgsql;

-- 自動生成訂單號觸發器
CREATE OR REPLACE FUNCTION set_order_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
        NEW.order_number := generate_order_number();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_orders_order_number
    BEFORE INSERT ON orders
    FOR EACH ROW
    EXECUTE FUNCTION set_order_number();

-- 添加註解
COMMENT ON TABLE orders IS '訂單表 - 記錄旅客預訂地陪服務的交易';
COMMENT ON COLUMN orders.order_number IS '訂單編號 格式: GD-YYYYMMDD-XXX';
COMMENT ON COLUMN orders.platform_fee IS '平台向旅客收取的服務費 (5%)';
COMMENT ON COLUMN orders.provider_commission IS '平台向地陪收取的抽成 (15%)';
COMMENT ON COLUMN orders.total_amount IS '旅客總付款金額';
COMMENT ON COLUMN orders.provider_earning IS '地陪實際收入';