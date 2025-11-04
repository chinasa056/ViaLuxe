// src/common/pubsub.ts

import { PubSub } from 'graphql-subscriptions';

// Create your pubSub without generic types (they're not needed for basic usage)
export const pubSub = new PubSub();
export const PUB_SUB = 'PUB_SUB';

export const EVENTS = {
  /**
   * A generic event for all real-time notifications.
   * The payload will contain a `type` field to distinguish events.
   */
  NOTIFICATION_EVENT: 'NOTIFICATION_EVENT' as const,
};
