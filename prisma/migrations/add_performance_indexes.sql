-- 添加關鍵性能索引
-- 避免 N+1 查詢和改善大數據集的查詢性能

-- 預訂相關索引
CREATE INDEX IF NOT EXISTS "idx_booking_traveler_id" ON "public"."bookings"("traveler_id");
CREATE INDEX IF NOT EXISTS "idx_booking_guide_id" ON "public"."bookings"("guide_id");
CREATE INDEX IF NOT EXISTS "idx_booking_status" ON "public"."bookings"("status");
CREATE INDEX IF NOT EXISTS "idx_booking_service_id" ON "public"."bookings"("service_id");
CREATE INDEX IF NOT EXISTS "idx_booking_created_at" ON "public"."bookings"("created_at");

-- 服務相關索引
CREATE INDEX IF NOT EXISTS "idx_service_guide_id" ON "public"."services"("guide_id");
CREATE INDEX IF NOT EXISTS "idx_service_status" ON "public"."services"("status");
CREATE INDEX IF NOT EXISTS "idx_service_created_at" ON "public"."services"("created_at");
CREATE INDEX IF NOT EXISTS "idx_service_location" ON "public"."services"("location");

-- 評論相關索引
CREATE INDEX IF NOT EXISTS "idx_review_service_id" ON "public"."reviews"("service_id");
CREATE INDEX IF NOT EXISTS "idx_review_guide_id" ON "public"."reviews"("guide_id");
CREATE INDEX IF NOT EXISTS "idx_review_traveler_id" ON "public"."reviews"("traveler_id");
CREATE INDEX IF NOT EXISTS "idx_review_created_at" ON "public"."reviews"("created_at");

-- 訊息相關索引
CREATE INDEX IF NOT EXISTS "idx_message_conversation_id" ON "public"."messages"("conversation_id");
CREATE INDEX IF NOT EXISTS "idx_message_sender_id" ON "public"."messages"("sender_id");
CREATE INDEX IF NOT EXISTS "idx_message_is_read" ON "public"."messages"("is_read");
CREATE INDEX IF NOT EXISTS "idx_message_created_at" ON "public"."messages"("created_at");

-- 用戶相關索引
CREATE INDEX IF NOT EXISTS "idx_user_email" ON "public"."users"("email");
CREATE INDEX IF NOT EXISTS "idx_user_role" ON "public"."users"("role");

-- 支付相關索引
CREATE INDEX IF NOT EXISTS "idx_payment_booking_id" ON "public"."payments"("booking_id");
CREATE INDEX IF NOT EXISTS "idx_payment_status" ON "public"."payments"("status");
CREATE INDEX IF NOT EXISTS "idx_payment_created_at" ON "public"."payments"("created_at");

-- 通知相關索引
CREATE INDEX IF NOT EXISTS "idx_notification_user_id" ON "public"."notifications"("user_id");
CREATE INDEX IF NOT EXISTS "idx_notification_created_at" ON "public"."notifications"("created_at");

-- 複合索引用於常見查詢
CREATE INDEX IF NOT EXISTS "idx_booking_traveler_status" ON "public"."bookings"("traveler_id", "status");
CREATE INDEX IF NOT EXISTS "idx_booking_guide_status" ON "public"."bookings"("guide_id", "status");
CREATE INDEX IF NOT EXISTS "idx_service_guide_status" ON "public"."services"("guide_id", "status");
CREATE INDEX IF NOT EXISTS "idx_message_conversation_is_read" ON "public"."messages"("conversation_id", "is_read");
