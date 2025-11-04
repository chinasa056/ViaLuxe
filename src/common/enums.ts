// src/common/enums.ts
import { registerEnumType } from '@nestjs/graphql';

export enum ScanType {
  SKIN = 'SKIN',
  EYE = 'EYE',
}

export enum AppointmentMode {
  PHYSICAL = 'PHYSICAL',
  VIRTUAL = 'VIRTUAL',
}

export enum NotificationType {
  REMINDER = 'REMINDER',
  INSIGHT = 'INSIGHT',
  ACCOUNT_ACTIVITY = 'ACCOUNT_ACTIVITY',
}

export enum SubscriptionTier {
  FREEMIUM = 'FREEMIUM',
  PREMIUM = 'PREMIUM',
  PREMIUM_PLUS = 'PREMIUM_PLUS',
}

export enum GenderType {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

export enum BillingCycle {
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
}

export enum Interval {
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
}

export enum Status {
  ACTIVE = 'ACTIVE',
  PENDING = 'PENDING',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
  FAILED = 'FAILED',
}

registerEnumType(Interval, { name: 'Interval' });
registerEnumType(Status, { name: 'Status' });

registerEnumType(ScanType, { name: 'ScanType' });
registerEnumType(AppointmentMode, { name: 'AppointmentMode' });
registerEnumType(NotificationType, { name: 'NotificationType' });
registerEnumType(SubscriptionTier, { name: 'SubscriptionTier' });
registerEnumType(GenderType, { name: 'GenderType' });

