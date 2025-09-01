// src/models/Order.ts
// 訂單模型 - 記錄旅客預訂地陪服務的交易

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn, Index, BeforeInsert } from 'typeorm';
import { IsString, IsNumber, IsEnum, IsOptional, IsDate, IsDecimal, Min } from 'class-validator';
import { User } from './User';
import { Service } from './Service';
import { Review } from './Review';

export enum OrderStatus {
  PENDING_CONFIRMATION = 'pending_confirmation',
  CONFIRMED = 'confirmed',
  PAID = 'paid',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
  DISPUTED = 'disputed'
}

export enum ProviderResponse {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  DECLINED = 'declined'
}

export interface MeetingPoint {
  name: string;
  address: string;
  lat: number;
  lng: number;
}

@Entity('orders')
@Index(['orderNumber'])
@Index(['travelerId'])
@Index(['providerId'])
@Index(['serviceId'])
@Index(['status'])
@Index(['serviceDate'])
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'order_number', unique: true, length: 20 })
  @IsString()
  orderNumber: string;

  // 關聯方
  @Column({ name: 'traveler_id' })
  travelerId: string;

  @Column({ name: 'provider_id' })
  providerId: string;

  @Column({ name: 'service_id' })
  serviceId: string;

  // 服務詳情
  @Column({ name: 'service_date', type: 'date' })
  @IsDate()
  serviceDate: Date;

  @Column({ name: 'service_time', type: 'time' })
  serviceTime: string;

  @Column({ name: 'duration_hours' })
  @IsNumber()
  @Min(1)
  durationHours: number;

  @Column({ name: 'participants_count', default: 1 })
  @IsNumber()
  @Min(1)
  participantsCount: number;

  // 會面資訊
  @Column({ name: 'meeting_point', type: 'jsonb' })
  meetingPoint: MeetingPoint;

  @Column({ name: 'special_requirements', type: 'text', nullable: true })
  @IsOptional()
  @IsString()
  specialRequirements?: string;

  // 金額計算
  @Column({ name: 'service_amount', type: 'decimal', precision: 10, scale: 2 })
  @IsDecimal()
  serviceAmount: number; // 服務費用

  @Column({ name: 'platform_fee', type: 'decimal', precision: 10, scale: 2 })
  @IsDecimal()
  platformFee: number; // 平台服務費 (5%)

  @Column({ name: 'provider_commission', type: 'decimal', precision: 10, scale: 2 })
  @IsDecimal()
  providerCommission: number; // 平台抽成 (15%)

  @Column({ name: 'total_amount', type: 'decimal', precision: 10, scale: 2 })
  @IsDecimal()
  totalAmount: number; // 旅客總付款

  @Column({ name: 'provider_earning', type: 'decimal', precision: 10, scale: 2 })
  @IsDecimal()
  providerEarning: number; // 地陪實收

  @Column({ default: 'TWD' })
  currency: string;

  // 訂單狀態
  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING_CONFIRMATION
  })
  @IsEnum(OrderStatus)
  status: OrderStatus;

  // 付款資訊
  @Column({ name: 'payment_method', nullable: true })
  @IsOptional()
  @IsString()
  paymentMethod?: string;

  @Column({ name: 'payment_provider', nullable: true })
  @IsOptional()
  @IsString()
  paymentProvider?: string; // stripe, newebpay

  @Column({ name: 'payment_transaction_id', nullable: true })
  @IsOptional()
  @IsString()
  paymentTransactionId?: string;

  @Column({ name: 'paid_at', nullable: true })
  @IsOptional()
  @IsDate()
  paidAt?: Date;

  // 服務完成
  @Column({ name: 'service_started_at', nullable: true })
  @IsOptional()
  @IsDate()
  serviceStartedAt?: Date;

  @Column({ name: 'service_completed_at', nullable: true })
  @IsOptional()
  @IsDate()
  serviceCompletedAt?: Date;

  // 取消相關
  @Column({ name: 'cancelled_at', nullable: true })
  @IsOptional()
  @IsDate()
  cancelledAt?: Date;

  @Column({ name: 'cancelled_by_user_id', nullable: true })
  @IsOptional()
  cancelledByUserId?: string;

  @Column({ name: 'cancellation_reason', type: 'text', nullable: true })
  @IsOptional()
  @IsString()
  cancellationReason?: string;

  @Column({ name: 'refund_amount', type: 'decimal', precision: 10, scale: 2, nullable: true })
  @IsOptional()
  @IsDecimal()
  refundAmount?: number;

  @Column({ name: 'refund_processed_at', nullable: true })
  @IsOptional()
  @IsDate()
  refundProcessedAt?: Date;

  // 地陪回應
  @Column({
    name: 'provider_response',
    type: 'enum',
    enum: ProviderResponse,
    default: ProviderResponse.PENDING
  })
  @IsEnum(ProviderResponse)
  providerResponse: ProviderResponse;

  @Column({ name: 'provider_responded_at', nullable: true })
  @IsOptional()
  @IsDate()
  providerRespondedAt?: Date;

  @Column({ name: 'provider_decline_reason', type: 'text', nullable: true })
  @IsOptional()
  @IsString()
  providerDeclineReason?: string;

  // 系統欄位
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'deleted_at', nullable: true })
  @IsOptional()
  @IsDate()
  deletedAt?: Date;

  // 關聯關係
  @ManyToOne(() => User, user => user.travelerOrders)
  @JoinColumn({ name: 'traveler_id' })
  traveler: User;

  @ManyToOne(() => User, user => user.providerOrders)
  @JoinColumn({ name: 'provider_id' })
  provider: User;

  @ManyToOne(() => Service, service => service.orders)
  @JoinColumn({ name: 'service_id' })
  service: Service;

  @OneToMany(() => Review, review => review.order)
  reviews: Review[];

  // 生成訂單號
  @BeforeInsert()
  generateOrderNumber() {
    if (!this.orderNumber) {
      const today = new Date();
      const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
      const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      this.orderNumber = `GD-${dateStr}-${randomNum}`;
    }
  }

  // 虛擬欄位
  get isPending(): boolean {
    return this.status === OrderStatus.PENDING_CONFIRMATION;
  }

  get isConfirmed(): boolean {
    return this.status === OrderStatus.CONFIRMED;
  }

  get isPaid(): boolean {
    return this.status === OrderStatus.PAID;
  }

  get isCompleted(): boolean {
    return this.status === OrderStatus.COMPLETED;
  }

  get isCancelled(): boolean {
    return this.status === OrderStatus.CANCELLED;
  }

  get isRefunded(): boolean {
    return this.status === OrderStatus.REFUNDED;
  }

  get isDisputed(): boolean {
    return this.status === OrderStatus.DISPUTED;
  }

  get canBeCancelled(): boolean {
    return [OrderStatus.PENDING_CONFIRMATION, OrderStatus.CONFIRMED, OrderStatus.PAID].includes(this.status);
  }

  get serviceDateTime(): Date {
    const [hours, minutes] = this.serviceTime.split(':').map(Number);
    const dateTime = new Date(this.serviceDate);
    dateTime.setHours(hours, minutes, 0, 0);
    return dateTime;
  }

  // 業務方法
  static calculateAmounts(serviceAmount: number, durationHours: number) {
    const totalServiceAmount = serviceAmount * durationHours;
    const platformFee = totalServiceAmount * 0.05; // 5% 平台服務費
    const totalAmount = totalServiceAmount + platformFee;
    const providerCommission = totalServiceAmount * 0.15; // 15% 平台抽成
    const providerEarning = totalServiceAmount - providerCommission;

    return {
      serviceAmount: totalServiceAmount,
      platformFee,
      totalAmount,
      providerCommission,
      providerEarning
    };
  }

  confirm(): void {
    this.status = OrderStatus.CONFIRMED;
    this.providerResponse = ProviderResponse.ACCEPTED;
    this.providerRespondedAt = new Date();
  }

  decline(reason?: string): void {
    this.status = OrderStatus.CANCELLED;
    this.providerResponse = ProviderResponse.DECLINED;
    this.providerRespondedAt = new Date();
    this.providerDeclineReason = reason;
    this.cancelledAt = new Date();
  }

  markAsPaid(transactionId: string, paymentMethod: string, paymentProvider: string): void {
    this.status = OrderStatus.PAID;
    this.paymentTransactionId = transactionId;
    this.paymentMethod = paymentMethod;
    this.paymentProvider = paymentProvider;
    this.paidAt = new Date();
  }

  startService(): void {
    this.status = OrderStatus.IN_PROGRESS;
    this.serviceStartedAt = new Date();
  }

  completeService(): void {
    this.status = OrderStatus.COMPLETED;
    this.serviceCompletedAt = new Date();
  }

  cancel(cancelledByUserId: string, reason?: string): void {
    this.status = OrderStatus.CANCELLED;
    this.cancelledAt = new Date();
    this.cancelledByUserId = cancelledByUserId;
    this.cancellationReason = reason;
  }

  processRefund(amount: number): void {
    this.status = OrderStatus.REFUNDED;
    this.refundAmount = amount;
    this.refundProcessedAt = new Date();
  }

  dispute(): void {
    this.status = OrderStatus.DISPUTED;
  }

  calculateRefundAmount(): number {
    const now = new Date();
    const serviceDateTime = this.serviceDateTime;
    const hoursUntilService = (serviceDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);

    // 根據取消政策計算退款金額
    if (hoursUntilService >= 168) { // 7天前
      return Number(this.totalAmount); // 全額退款
    } else if (hoursUntilService >= 48) { // 48小時前
      return Number(this.totalAmount) * 0.5; // 50% 退款
    } else {
      return 0; // 不退款
    }
  }
}