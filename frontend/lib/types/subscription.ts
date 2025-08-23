export type Subscription = {
  id: string;
  userId: string;
  plan: string;
  startDate: string;
  endDate: string | null;
  status: string;
  [key: string]: any;
};

export type SubscriptionResponse = {
  message: string;
  success: boolean;
  data: Subscription;
};