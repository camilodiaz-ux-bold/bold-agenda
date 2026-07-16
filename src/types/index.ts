export interface Product {
  id: string;
  name: string;
  price: string;
  hasPhoto?: boolean;
  photoType?: "water-bottle";
  isExample?: boolean;
}

export interface CheckoutItem {
  id: string;
  name: string;
  qty: number;
  unitPrice: number;
  hasPhoto?: boolean;
  photoType?: "water-bottle";
}

export type AppScreen =
  | "home-payments"
  | "home-productos"
  | "tus-productos"
  | "create-product"
  | "product-detail"
  | "cobro"
  | "cobro-productos"
  | "cobro-detalle"
  | "cobro-medios"
  | "cobro-captura"
  | "cobro-exitoso";

// ── Bold Agenda types ──────────────────────────────────────────────────────

export type OperatorSection = 'agenda' | 'ventas' | 'clientes' | 'ajustes';

export type AppointmentStatus = 'confirmada' | 'completada' | 'no-show' | 'reprogramada';
export type PaymentStatus = 'pendiente' | 'pagado' | 'pagado-anticipado';
export type PaymentMethod = 'datafono' | 'qr' | 'link' | 'anticipado';

export interface Professional {
  id: string;
  name: string;
  role: string;
  color: string;
  initials: string;
  commissionRate: number;
}

export interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
  requiresDeposit: boolean;
}

export interface Appointment {
  id: string;
  professionalId: string;
  serviceId: string;
  clientName: string;
  clientPhone: string;
  clientCedula: string;
  date: string;
  startTime: string;
  status: AppointmentStatus;
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod;
  tip?: number;
  notes?: string;
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  cedula: string;
  email?: string;
  totalSpent: number;
  visitCount: number;
  lastVisit?: string;
  preferredProfessionalId?: string;
  notes?: string;
}
