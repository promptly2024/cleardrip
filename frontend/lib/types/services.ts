export interface BookServiceForm {
  type: 'AMC' | 'URGENT';
  scheduledDate: string;
  beforeImageUrl?: string;
  afterImageUrl?: string;
}

interface ServiceDefinition {
  id: string;
  name: string;
  description: string;
  type: string;
  image: string;
  imageUrl: string | null;
  price: number;
  duration: number;
  isActive: boolean;
  adminId: string;
  createdAt: string;
  updatedAt: string;
}
interface Services {
  id: string;
  userId: string;
  serviceId: string;
  slotId: string;
  status: string;
  beforeImageUrl: string | null;
  afterImageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
    addressId: string;
    password: string;
    fcmToken: string | null;
    whatsappNumber: string | null;
    isEmailVerified: boolean;
    isPhoneVerified: boolean;
    loyaltyStatus: string;
    createdAt: string;
    updatedAt: string;
  };
  slot: {
    id: string;
    startTime: string;
    endTime: string;
    createdAt: string;
    updatedAt: string;
  };
  service: ServiceDefinition;
}
interface Pagination {
  take: number;
  skip: number;
  total: number;
  hasNext: boolean;
}
interface ServicesResponse {
  services: Services[];
  pagination: Pagination;
  message: string;
}
export type { ServiceDefinition, Services, Pagination, ServicesResponse };