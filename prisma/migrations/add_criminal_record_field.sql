-- 新增良民證驗證欄位到用戶表
ALTER TABLE "public"."users" 
ADD COLUMN "is_criminal_record_verified" BOOLEAN DEFAULT false;

-- 為導遊用戶建立KYC資料表（如果需要儲存更詳細的KYC資訊）
CREATE TABLE "public"."kyc_submissions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "id_number" TEXT,
    "birth_date" DATE,
    "address" TEXT,
    "emergency_contact" TEXT,
    "id_front_image_url" TEXT,
    "id_back_image_url" TEXT,
    "selfie_image_url" TEXT,
    "criminal_record_url" TEXT, -- 良民證檔案URL
    "status" TEXT NOT NULL DEFAULT 'pending', -- pending, approved, rejected
    "reviewed_by" UUID,
    "reviewed_at" TIMESTAMP,
    "rejection_reason" TEXT,
    "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP NOT NULL DEFAULT NOW(),
    
    CONSTRAINT "kyc_submissions_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "kyc_submissions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE,
    CONSTRAINT "kyc_submissions_reviewed_by_fkey" FOREIGN KEY ("reviewed_by") REFERENCES "public"."users"("id") ON DELETE SET NULL
);

-- 建立索引
CREATE INDEX "kyc_submissions_user_id_idx" ON "public"."kyc_submissions"("user_id");
CREATE INDEX "kyc_submissions_status_idx" ON "public"."kyc_submissions"("status");