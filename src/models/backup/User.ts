// src/models/User.ts
// 用戶模型 - 支援旅客、地陪、管理員

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, Index } from 'typeorm';
import { IsEmail, IsOptional, IsEnum, IsBoolean, IsString, IsArray, IsDecimal, IsDate } from 'class-validator';
import { Service } from './Service';
import { Order } from './Order';
import { Review } from './Review';
import { Message } from './Message';

export enum UserRole {
  TRAVELER = 'traveler',
  PROVIDER = 'provider',
  ADMIN = 'admin'
}

export enum GenderType {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
  PREFER_NOT_TO_SAY = 'prefer_not_to_say'
}

export enum KYCStatus {
  PENDING = 'pending',
  SUBMITTED = 'submitted',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  EXPIRED = 'expired'
}

@Entity('users')
@Index(['email'])
@Index(['phone'])
@Index(['role'])
@Index(['kycStatus'])
@Index(['isActive'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column({ unique: true, nullable: true })
  @IsOptional()
  phone?: string;

  @Column({ name: 'password_hash' })
  passwordHash: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.TRAVELER
  })
  @IsEnum(UserRole)
  role: UserRole;

  // 基本資料
  @Column({ name: 'first_name', nullable: true })
  @IsOptional()
  @IsString()
  firstName?: string;

  @Column({ name: 'last_name', nullable: true })
  @IsOptional()
  @IsString()
  lastName?: string;

  @Column({ name: 'avatar_url', nullable: true })
  @IsOptional()
  avatarUrl?: string;

  @Column({ name: 'date_of_birth', type: 'date', nullable: true })
  @IsOptional()
  @IsDate()
  dateOfBirth?: Date;

  @Column({
    type: 'enum',
    enum: GenderType,
    nullable: true
  })
  @IsOptional()
  @IsEnum(GenderType)
  gender?: GenderType;

  @Column({ length: 2, nullable: true })
  @IsOptional()
  nationality?: string; // ISO 3166-1 alpha-2

  // 身分驗證
  @Column({
    name: 'kyc_status',
    type: 'enum',
    enum: KYCStatus,
    default: KYCStatus.PENDING
  })
  @IsEnum(KYCStatus)
  kycStatus: KYCStatus;

  @Column({ name: 'kyc_documents', type: 'jsonb', nullable: true })
  kycDocuments?: any;

  @Column({ name: 'kyc_verified_at', nullable: true })
  @IsOptional()
  @IsDate()
  kycVerifiedAt?: Date;

  // 帳戶狀態
  @Column({ name: 'is_active', default: true })
  @IsBoolean()
  isActive: boolean;

  @Column({ name: 'is_verified', default: false })
  @IsBoolean()
  isVerified: boolean;

  @Column({ name: 'email_verified_at', nullable: true })
  @IsOptional()
  @IsDate()
  emailVerifiedAt?: Date;

  @Column({ name: 'phone_verified_at', nullable: true })
  @IsOptional()
  @IsDate()
  phoneVerifiedAt?: Date;

  // 偏好設定
  @Column({ name: 'preferred_language', default: 'zh-TW' })
  preferredLanguage: string;

  @Column({ name: 'preferred_currency', default: 'TWD' })
  preferredCurrency: string;

  @Column({ default: 'Asia/Taipei' })
  timezone: string;

  // 地陪特定欄位
  @Column({ name: 'provider_rating', type: 'decimal', precision: 3, scale: 2, nullable: true })
  @IsOptional()
  @IsDecimal()
  providerRating?: number;

  @Column({ name: 'provider_review_count', default: 0 })
  providerReviewCount: number;

  @Column({ name: 'provider_services_completed', default: 0 })
  providerServicesCompleted: number;

  @Column({ name: 'provider_bio', type: 'text', nullable: true })
  @IsOptional()
  providerBio?: string;

  @Column({ name: 'provider_specialties', type: 'text', array: true, nullable: true })
  @IsOptional()
  @IsArray()
  providerSpecialties?: string[];

  @Column({ name: 'provider_languages', type: 'varchar', array: true, nullable: true })
  @IsOptional()
  @IsArray()
  providerLanguages?: string[];

  @Column({ name: 'provider_coverage_areas', type: 'text', array: true, nullable: true })
  @IsOptional()
  @IsArray()
  providerCoverageAreas?: string[];

  // 系統欄位
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'last_login_at', nullable: true })
  @IsOptional()
  @IsDate()
  lastLoginAt?: Date;

  @Column({ name: 'deleted_at', nullable: true })
  @IsOptional()
  @IsDate()
  deletedAt?: Date;

  // 關聯關係
  @OneToMany(() => Service, service => service.provider)
  services: Service[];

  @OneToMany(() => Order, order => order.traveler)
  travelerOrders: Order[];

  @OneToMany(() => Order, order => order.provider)
  providerOrders: Order[];

  @OneToMany(() => Review, review => review.reviewer)
  givenReviews: Review[];

  @OneToMany(() => Review, review => review.reviewee)
  receivedReviews: Review[];

  @OneToMany(() => Message, message => message.sender)
  sentMessages: Message[];

  @OneToMany(() => Message, message => message.receiver)
  receivedMessages: Message[];

  // 虛擬欄位
  get fullName(): string {
    return [this.firstName, this.lastName].filter(Boolean).join(' ');
  }

  get isProvider(): boolean {
    return this.role === UserRole.PROVIDER;
  }

  get isTraveler(): boolean {
    return this.role === UserRole.TRAVELER;
  }

  get isAdmin(): boolean {
    return this.role === UserRole.ADMIN;
  }

  get isKYCApproved(): boolean {
    return this.kycStatus === KYCStatus.APPROVED;
  }

  // 業務方法
  updateLastLogin(): void {
    this.lastLoginAt = new Date();
  }

  softDelete(): void {
    this.deletedAt = new Date();
    this.isActive = false;
  }

  updateProviderRating(newRating: number, reviewCount: number): void {
    if (this.isProvider) {
      this.providerRating = newRating;
      this.providerReviewCount = reviewCount;
    }
  }
}