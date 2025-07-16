export interface BookServiceForm {
  type: 'AMC' | 'URGENT';
  scheduledDate: string;
  beforeImageUrl?: string;
  afterImageUrl?: string;
}

export interface Service {
  id: string;
  type: 'AMC' | 'URGENT';
  scheduledDate: string;
  status: string;
  beforeImageUrl?: string;
  afterImageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ServicesResponse {
  message: string;
  services: Service[];
  pagination: {
    take: number;
    skip: number;
    total: number;
    hasNext: boolean;
  };
}