// Cancellation and Refund System Components
// 取消和退款系統組件

export { CancellationPolicyEngine } from './cancellation-policy-engine';
export { CustomerCancellationInterface } from './customer-cancellation-interface';
export { AdminRefundDashboard } from './admin-refund-dashboard';
export { RefundTrackingInterface } from './refund-tracking-interface';
export { DisputeResolutionInterface } from './dispute-resolution-interface';
export { BookingCancellationIntegration } from './booking-cancellation-integration';
export { EmailNotificationSystem } from './email-notification-system';

// Re-export types for convenience
export type {
  CancellationPolicy,
  CancellationRule,
  CancellationRequest,
  CancellationReason,
  RefundRecord,
  RefundStatus,
  RefundMethod,
  RefundCalculation,
  RefundStatistics,
  DisputeCase,
  DisputeStatus,
  Evidence,
  Communication,
  EmailNotification,
  RefundBatch,
  CancellationSystemSettings
} from '@/types/cancellation';