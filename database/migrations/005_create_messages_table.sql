-- 005_create_messages_table.sql
-- 創建訊息表

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- 關聯方
  sender_id UUID NOT NULL REFERENCES users(id),
  receiver_id UUID NOT NULL REFERENCES users(id),
  order_id UUID REFERENCES orders(id), -- 可選，與特定訂單相關的訊息
  
  -- 訊息內容
  content TEXT NOT NULL,
  message_type message_type_enum DEFAULT 'text',
  
  -- 附件
  attachments JSONB, -- [{type, url, name, size}]
  
  -- 訊息狀態
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMP,
  
  -- 系統訊息
  is_system_message BOOLEAN DEFAULT false,
  system_event_type VARCHAR(50), -- order_confirmed, payment_received, etc.
  
  -- 內容安全
  is_flagged BOOLEAN DEFAULT false,
  flagged_reason TEXT,
  flagged_at TIMESTAMP,
  
  -- 系統欄位
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP
);

-- 創建枚舉類型
CREATE TYPE message_type_enum AS ENUM ('text', 'image', 'system', 'location');

-- 創建會話視圖表 (優化查詢)
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- 對話雙方
  user1_id UUID NOT NULL REFERENCES users(id),
  user2_id UUID NOT NULL REFERENCES users(id),
  order_id UUID REFERENCES orders(id),
  
  -- 最後訊息
  last_message_id UUID REFERENCES messages(id),
  last_message_at TIMESTAMP,
  
  -- 未讀數量
  user1_unread_count INTEGER DEFAULT 0,
  user2_unread_count INTEGER DEFAULT 0,
  
  -- 狀態
  is_active BOOLEAN DEFAULT true,
  
  -- 系統欄位
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- 確保不重複對話
  CONSTRAINT unique_conversation UNIQUE(user1_id, user2_id, order_id)
);

-- 創建索引
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_receiver_id ON messages(receiver_id);
CREATE INDEX idx_messages_order_id ON messages(order_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);
CREATE INDEX idx_messages_is_read ON messages(is_read);

-- 對話索引
CREATE INDEX idx_conversations_user1_id ON conversations(user1_id);
CREATE INDEX idx_conversations_user2_id ON conversations(user2_id);
CREATE INDEX idx_conversations_order_id ON conversations(order_id);
CREATE INDEX idx_conversations_last_message_at ON conversations(last_message_at);

-- 複合索引
CREATE INDEX idx_messages_conversation ON messages(sender_id, receiver_id, created_at);

-- 創建更新時間觸發器
CREATE TRIGGER update_messages_updated_at 
    BEFORE UPDATE ON messages 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_conversations_updated_at 
    BEFORE UPDATE ON conversations 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 自動維護對話記錄的函數
CREATE OR REPLACE FUNCTION maintain_conversation()
RETURNS TRIGGER AS $$
DECLARE
    conv_id UUID;
    user1 UUID;
    user2 UUID;
BEGIN
    -- 確保 user1_id < user2_id (統一排序)
    IF NEW.sender_id < NEW.receiver_id THEN
        user1 := NEW.sender_id;
        user2 := NEW.receiver_id;
    ELSE
        user1 := NEW.receiver_id;
        user2 := NEW.sender_id;
    END IF;
    
    -- 查找或創建對話記錄
    INSERT INTO conversations (user1_id, user2_id, order_id, last_message_id, last_message_at)
    VALUES (user1, user2, NEW.order_id, NEW.id, NEW.created_at)
    ON CONFLICT (user1_id, user2_id, order_id)
    DO UPDATE SET 
        last_message_id = NEW.id,
        last_message_at = NEW.created_at,
        updated_at = NOW();
    
    -- 更新未讀數量
    IF NEW.receiver_id = user1 THEN
        UPDATE conversations 
        SET user1_unread_count = user1_unread_count + 1
        WHERE user1_id = user1 AND user2_id = user2 AND COALESCE(order_id, 'null') = COALESCE(NEW.order_id, 'null');
    ELSE
        UPDATE conversations 
        SET user2_unread_count = user2_unread_count + 1
        WHERE user1_id = user1 AND user2_id = user2 AND COALESCE(order_id, 'null') = COALESCE(NEW.order_id, 'null');
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 新增訊息時自動維護對話
CREATE TRIGGER maintain_conversation_on_message
    AFTER INSERT ON messages
    FOR EACH ROW
    EXECUTE FUNCTION maintain_conversation();

-- 添加註解
COMMENT ON TABLE messages IS '訊息表 - 用戶間的即時通訊';
COMMENT ON TABLE conversations IS '對話表 - 優化查詢的對話記錄';
COMMENT ON COLUMN messages.attachments IS '附件JSON數組';
COMMENT ON COLUMN conversations.user1_id IS '對話參與者1 (ID較小者)';
COMMENT ON COLUMN conversations.user2_id IS '對話參與者2 (ID較大者)';