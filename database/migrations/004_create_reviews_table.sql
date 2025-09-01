-- 004_create_reviews_table.sql
-- 創建評價表

CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- 關聯訂單和用戶
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES users(id),
  reviewee_id UUID NOT NULL REFERENCES users(id),
  service_id UUID NOT NULL REFERENCES services(id),
  
  -- 評價內容
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(200),
  comment TEXT,
  
  -- 評價維度 (針對地陪)
  communication_rating INTEGER CHECK (communication_rating >= 1 AND communication_rating <= 5),
  punctuality_rating INTEGER CHECK (punctuality_rating >= 1 AND punctuality_rating <= 5),
  knowledge_rating INTEGER CHECK (knowledge_rating >= 1 AND knowledge_rating <= 5),
  friendliness_rating INTEGER CHECK (friendliness_rating >= 1 AND friendliness_rating <= 5),
  value_rating INTEGER CHECK (value_rating >= 1 AND value_rating <= 5),
  
  -- 媒體附件
  photos TEXT[], -- 評價照片URLs
  
  -- 評價狀態
  status review_status_enum DEFAULT 'published',
  is_featured BOOLEAN DEFAULT false,
  
  -- 有用性投票
  helpful_count INTEGER DEFAULT 0,
  unhelpful_count INTEGER DEFAULT 0,
  
  -- 地陪回應
  provider_response TEXT,
  provider_responded_at TIMESTAMP,
  
  -- 管理欄位
  admin_notes TEXT,
  flagged_reason TEXT,
  flagged_at TIMESTAMP,
  flagged_by_user_id UUID REFERENCES users(id),
  
  -- 系統欄位
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP
);

-- 創建枚舉類型
CREATE TYPE review_status_enum AS ENUM ('pending', 'published', 'hidden', 'flagged', 'deleted');

-- 創建索引
CREATE INDEX idx_reviews_order_id ON reviews(order_id);
CREATE INDEX idx_reviews_reviewer_id ON reviews(reviewer_id);
CREATE INDEX idx_reviews_reviewee_id ON reviews(reviewee_id);
CREATE INDEX idx_reviews_service_id ON reviews(service_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);
CREATE INDEX idx_reviews_status ON reviews(status);
CREATE INDEX idx_reviews_is_featured ON reviews(is_featured);
CREATE INDEX idx_reviews_created_at ON reviews(created_at);

-- 複合索引
CREATE INDEX idx_reviews_service_status ON reviews(service_id, status);
CREATE INDEX idx_reviews_reviewee_status ON reviews(reviewee_id, status);

-- 確保每個訂單只能有一個評價
CREATE UNIQUE INDEX idx_reviews_order_reviewer ON reviews(order_id, reviewer_id);

-- 創建更新時間觸發器
CREATE TRIGGER update_reviews_updated_at 
    BEFORE UPDATE ON reviews 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 添加註解
COMMENT ON TABLE reviews IS '評價表 - 雙向評價系統';
COMMENT ON COLUMN reviews.rating IS '總體評分 1-5星';
COMMENT ON COLUMN reviews.communication_rating IS '溝通能力評分';
COMMENT ON COLUMN reviews.punctuality_rating IS '準時性評分';
COMMENT ON COLUMN reviews.knowledge_rating IS '專業知識評分';
COMMENT ON COLUMN reviews.friendliness_rating IS '友善度評分';
COMMENT ON COLUMN reviews.value_rating IS '性價比評分';