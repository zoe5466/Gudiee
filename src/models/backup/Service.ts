// src/models/Service.ts
// 服務模型 - 地陪提供的各種服務

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn, Index } from 'typeorm';
import { IsString, IsNumber, IsEnum, IsArray, IsOptional, IsBoolean, IsDecimal, IsDate, Min, Max } from 'class-validator';
import { User } from './User';
import { Order } from './Order';
import { Review } from './Review';

export enum ServiceType {
  TOUR_GUIDE = 'tour_guide',
  TRANSLATOR = 'translator',
  PHOTOGRAPHER = 'photographer',
  DRIVER = 'driver',
  FOOD_GUIDE = 'food_guide',
  SHOPPING_GUIDE = 'shopping_guide',
  CULTURAL_EXPERIENCE = 'cultural_experience',
  OTHER = 'other'
}

export enum PricingModel {
  HOURLY = 'hourly',
  HALF_DAY = 'half_day',
  FULL_DAY = 'full_day',
  CUSTOM = 'custom'
}

export enum CancellationPolicy {
  FLEXIBLE = 'flexible',
  STANDARD = 'standard',
  STRICT = 'strict'
}

export enum ServiceStatus {
  DRAFT = 'draft',
  PENDING_REVIEW = 'pending_review',
  PUBLISHED = 'published',
  SUSPENDED = 'suspended',
  ARCHIVED = 'archived'
}

export interface MeetingPoint {
  name: string;
  address: string;
  lat: number;
  lng: number;
}

export interface Availability {
  days: string[]; // ['monday', 'tuesday', ...]
  times: { start: string; end: string }[];
}

@Entity('services')
@Index(['providerId'])
@Index(['city'])
@Index(['serviceType'])
@Index(['status'])
@Index(['rating'])
@Index(['pricePerHour'])
export class Service {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'provider_id' })
  providerId: string;

  // 基本資訊
  @Column({ length: 200 })
  @IsString()
  title: string;

  @Column('text')
  @IsString()
  description: string;

  @Column({ name: 'short_description', length: 500, nullable: true })
  @IsOptional()
  @IsString()
  shortDescription?: string;

  // 服務詳情
  @Column({
    name: 'service_type',
    type: 'enum',
    enum: ServiceType,
    default: ServiceType.TOUR_GUIDE
  })
  @IsEnum(ServiceType)
  serviceType: ServiceType;

  @Column({ name: 'duration_hours', nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(24)
  durationHours?: number;

  @Column({ name: 'max_participants', default: 1 })
  @IsNumber()
  @Min(1)
  maxParticipants: number;

  @Column({ name: 'min_advance_booking', default: 24 })
  @IsNumber()
  @Min(1)
  minAdvanceBooking: number; // 最少提前預訂時數

  // 地理位置
  @Column({ length: 100 })
  @IsString()
  city: string;

  @Column({ length: 2 })
  @IsString()
  country: string; // ISO 3166-1 alpha-2

  @Column({ name: 'coverage_areas', type: 'text', array: true, nullable: true })
  @IsOptional()
  @IsArray()
  coverageAreas?: string[];

  @Column({ name: 'meeting_points', type: 'jsonb', nullable: true })
  @IsOptional()
  meetingPoints?: MeetingPoint[];

  // 價格設定
  @Column({ name: 'price_per_hour', type: 'decimal', precision: 10, scale: 2 })
  @IsDecimal()
  pricePerHour: number;

  @Column({ default: 'TWD' })
  currency: string;

  @Column({
    name: 'pricing_model',
    type: 'enum',
    enum: PricingModel,
    default: PricingModel.HOURLY
  })
  @IsEnum(PricingModel)
  pricingModel: PricingModel;

  // 取消政策
  @Column({
    name: 'cancellation_policy',
    type: 'enum',
    enum: CancellationPolicy,
    default: CancellationPolicy.STANDARD
  })
  @IsEnum(CancellationPolicy)
  cancellationPolicy: CancellationPolicy;

  // 服務語言
  @Column({ type: 'varchar', array: true })
  @IsArray()
  languages: string[];

  // 媒體資源
  @Column({ type: 'text', array: true, nullable: true })
  @IsOptional()
  @IsArray()
  images?: string[];

  @Column({ name: 'video_url', nullable: true })
  @IsOptional()
  @IsString()
  videoUrl?: string;

  // 可用性
  @Column({ type: 'jsonb', nullable: true })
  @IsOptional()
  availability?: Availability;

  // 服務狀態
  @Column({
    type: 'enum',
    enum: ServiceStatus,
    default: ServiceStatus.DRAFT
  })
  @IsEnum(ServiceStatus)
  status: ServiceStatus;

  @Column({ name: 'is_featured', default: false })
  @IsBoolean()
  isFeatured: boolean;

  // 統計數據
  @Column({ type: 'decimal', precision: 3, scale: 2, nullable: true })
  @IsOptional()
  @IsDecimal()
  rating?: number;

  @Column({ name: 'review_count', default: 0 })
  @IsNumber()
  reviewCount: number;

  @Column({ name: 'booking_count', default: 0 })
  @IsNumber()
  bookingCount: number;

  @Column({ name: 'view_count', default: 0 })
  @IsNumber()
  viewCount: number;

  // 管理欄位
  @Column({ name: 'admin_notes', type: 'text', nullable: true })
  @IsOptional()
  adminNotes?: string;

  @Column({ name: 'featured_until', nullable: true })
  @IsOptional()
  @IsDate()
  featuredUntil?: Date;

  // 系統欄位
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'published_at', nullable: true })
  @IsOptional()
  @IsDate()
  publishedAt?: Date;

  @Column({ name: 'deleted_at', nullable: true })
  @IsOptional()
  @IsDate()
  deletedAt?: Date;

  // 關聯關係
  @ManyToOne(() => User, user => user.services)
  @JoinColumn({ name: 'provider_id' })
  provider: User;

  @OneToMany(() => Order, order => order.service)
  orders: Order[];

  @OneToMany(() => Review, review => review.service)
  reviews: Review[];

  // 虛擬欄位
  get isPublished(): boolean {
    return this.status === ServiceStatus.PUBLISHED;
  }

  get isDraft(): boolean {
    return this.status === ServiceStatus.DRAFT;
  }

  get averageRating(): number {
    return this.rating || 0;
  }

  get priceDisplay(): string {
    return `${this.currency} ${this.pricePerHour}/小時`;
  }

  // 業務方法
  publish(): void {
    this.status = ServiceStatus.PUBLISHED;
    this.publishedAt = new Date();
  }

  suspend(): void {
    this.status = ServiceStatus.SUSPENDED;
  }

  archive(): void {
    this.status = ServiceStatus.ARCHIVED;
  }

  softDelete(): void {
    this.deletedAt = new Date();
    this.status = ServiceStatus.ARCHIVED;
  }

  incrementViewCount(): void {
    this.viewCount += 1;
  }

  incrementBookingCount(): void {
    this.bookingCount += 1;
  }

  updateRating(newRating: number, reviewCount: number): void {
    this.rating = newRating;
    this.reviewCount = reviewCount;
  }

  isAvailableOn(date: Date): boolean {
    if (!this.availability) return true;
    
    const dayName = date.toLocaleDateString('en-US', { weekday: 'lowercase' });
    return this.availability.days.includes(dayName);
  }

  calculateTotalPrice(hours: number): number {
    return Number(this.pricePerHour) * hours;
  }
}