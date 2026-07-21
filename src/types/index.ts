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
export type Role = 'admin' | 'staff';

export type AppointmentStatus = 'confirmada' | 'completada' | 'no-show' | 'reprogramada' | 'cancelada' | 'cancelada-tarde';
export type PaymentStatus = 'pendiente' | 'pagado' | 'pagado-anticipado' | 'reembolsado';
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
  active?: boolean;
}

export interface Branch {
  id: string;
  name: string;
  address: string;
  neighborhood: string;
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
  policySnapshot?: { cancellationWindowHours: number };
  originalPrice?: number;
  branchId?: string;
}

export interface AvailabilityBlock {
  id: string;
  professionalId: string;
  date: string;
  type: 'full-day' | 'range';
  startTime?: string;
  endTime?: string;
  reason?: string;
}

export interface BookingPolicy {
  cancellationWindowHours: number;
  publicBookingEnabled: boolean;
}

export interface BusinessProfile {
  name: string;
  address: string;
  phone: string;
  schedule: string;
  description: string;
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

export interface SaleRecord {
  id: string;
  appointmentId: string | null;
  clientName: string;
  serviceId: string;
  professionalId: string;
  serviceValue: number;
  tip: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  commission: number;
  completedAt: string; // ISO datetime
}
