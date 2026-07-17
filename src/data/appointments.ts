import type { Professional, Service, Appointment, Client } from '../types';

export const SALON = {
  name: 'Salón Camila',
  address: 'Carrera 13 #85-24, Chapinero, Bogotá',
  phone: '3101234567',
  schedule: 'Lun – Sáb, 8:00 am – 7:00 pm',
};

export const PROFESSIONALS: Professional[] = [
  {
    id: 'p1',
    name: 'Camila Vargas',
    role: 'Estilista · Dueña',
    color: '#E8194B',
    initials: 'CV',
    commissionRate: 0.45,
  },
  {
    id: 'p2',
    name: 'Valentina Ruiz',
    role: 'Colorista',
    color: '#7C3AED',
    initials: 'VR',
    commissionRate: 0.40,
  },
  {
    id: 'p3',
    name: 'Andrés Mora',
    role: 'Manicura y Pedicura',
    color: '#2563EB',
    initials: 'AM',
    commissionRate: 0.35,
  },
];

export const SERVICES: Service[] = [
  { id: 's1', name: 'Corte de dama', duration: 60, price: 45000, requiresDeposit: false },
  { id: 's2', name: 'Corte caballero', duration: 45, price: 30000, requiresDeposit: false },
  { id: 's3', name: 'Balayage', duration: 180, price: 220000, requiresDeposit: true },
  { id: 's4', name: 'Tinte raíz', duration: 90, price: 95000, requiresDeposit: false },
  { id: 's5', name: 'Manicure', duration: 45, price: 38000, requiresDeposit: false },
];

// Today: 2026-07-16 (Thursday). Wed 15 and Fri 17 also have appointments for a live week strip.
export const APPOINTMENTS: Appointment[] = [
  {
    id: 'a1',
    professionalId: 'p1',
    serviceId: 's1',
    clientName: 'Laura Jiménez',
    clientPhone: '3001234567',
    clientCedula: '1023456789',
    date: '2026-07-16',
    startTime: '09:00',
    status: 'completada',
    paymentStatus: 'pagado',
    paymentMethod: 'datafono',
    tip: 5000,
  },
  {
    id: 'a2',
    professionalId: 'p2',
    serviceId: 's3',
    clientName: 'María Torres',
    clientPhone: '3109876543',
    clientCedula: '52345678',
    date: '2026-07-16',
    startTime: '09:30',
    status: 'confirmada',
    paymentStatus: 'pagado-anticipado',
    paymentMethod: 'anticipado',
  },
  {
    id: 'a3',
    professionalId: 'p3',
    serviceId: 's5',
    clientName: 'Sofía Gómez',
    clientPhone: '3201122334',
    clientCedula: '1098765432',
    date: '2026-07-16',
    startTime: '10:00',
    status: 'completada',
    paymentStatus: 'pagado',
    paymentMethod: 'qr',
    tip: 0,
  },
  {
    id: 'a4',
    professionalId: 'p1',
    serviceId: 's4',
    clientName: 'Andrea López',
    clientPhone: '3154567890',
    clientCedula: '39876543',
    date: '2026-07-16',
    startTime: '11:00',
    status: 'confirmada',
    paymentStatus: 'pendiente',
  },
  {
    id: 'a5',
    professionalId: 'p2',
    serviceId: 's1',
    clientName: 'Daniela Reyes',
    clientPhone: '3007654321',
    clientCedula: '1056789012',
    date: '2026-07-16',
    startTime: '11:30',
    status: 'no-show',
    paymentStatus: 'pendiente',
  },
  {
    id: 'a6',
    professionalId: 'p1',
    serviceId: 's2',
    clientName: 'Carlos Martínez',
    clientPhone: '3182345678',
    clientCedula: '80123456',
    date: '2026-07-16',
    startTime: '14:00',
    status: 'confirmada',
    paymentStatus: 'pendiente',
    notes: 'Prefiere corte clásico, poco de los lados',
  },
  {
    id: 'a7',
    professionalId: 'p3',
    serviceId: 's5',
    clientName: 'Paula Herrera',
    clientPhone: '3213456789',
    clientCedula: '1023467890',
    date: '2026-07-16',
    startTime: '15:00',
    status: 'confirmada',
    paymentStatus: 'pendiente',
  },
  {
    id: 'a8',
    professionalId: 'p2',
    serviceId: 's4',
    clientName: 'Catalina Vega',
    clientPhone: '3124567890',
    clientCedula: '52987654',
    date: '2026-07-16',
    startTime: '15:30',
    status: 'confirmada',
    paymentStatus: 'pendiente',
  },
  {
    id: 'a9',
    professionalId: 'p1',
    serviceId: 's3',
    clientName: 'Valentina Ospina',
    clientPhone: '3145678901',
    clientCedula: '43876543',
    date: '2026-07-16',
    startTime: '16:00',
    status: 'confirmada',
    paymentStatus: 'pagado-anticipado',
    paymentMethod: 'anticipado',
  },

  // Wednesday 2026-07-15 (yesterday)
  {
    id: 'a10',
    professionalId: 'p1',
    serviceId: 's1',
    clientName: 'Laura Jiménez',
    clientPhone: '3001234567',
    clientCedula: '1023456789',
    date: '2026-07-15',
    startTime: '10:00',
    status: 'completada',
    paymentStatus: 'pagado',
    paymentMethod: 'datafono',
    tip: 3000,
  },
  {
    id: 'a11',
    professionalId: 'p3',
    serviceId: 's5',
    clientName: 'Sofía Gómez',
    clientPhone: '3201122334',
    clientCedula: '1098765432',
    date: '2026-07-15',
    startTime: '14:30',
    status: 'completada',
    paymentStatus: 'pagado',
    paymentMethod: 'qr',
    tip: 5000,
  },

  // Friday 2026-07-17 (tomorrow)
  {
    id: 'a12',
    professionalId: 'p2',
    serviceId: 's4',
    clientName: 'María Torres',
    clientPhone: '3109876543',
    clientCedula: '52345678',
    date: '2026-07-17',
    startTime: '11:00',
    status: 'confirmada',
    paymentStatus: 'pendiente',
  },
  {
    id: 'a13',
    professionalId: 'p1',
    serviceId: 's2',
    clientName: 'Carlos Martínez',
    clientPhone: '3182345678',
    clientCedula: '80123456',
    date: '2026-07-17',
    startTime: '15:00',
    status: 'confirmada',
    paymentStatus: 'pendiente',
    notes: 'Prefiere corte clásico, poco de los lados',
  },
];

export const CLIENTS: Client[] = [
  {
    id: 'c1',
    name: 'Laura Jiménez',
    phone: '3001234567',
    cedula: '1023456789',
    email: 'laura.jimenez@gmail.com',
    totalSpent: 315000,
    visitCount: 7,
    lastVisit: '2026-07-16',
    preferredProfessionalId: 'p1',
    notes: 'Alergia a tinte amoniacal. Prefiere siempre a Camila.',
  },
  {
    id: 'c2',
    name: 'María Torres',
    phone: '3109876543',
    cedula: '52345678',
    totalSpent: 880000,
    visitCount: 4,
    lastVisit: '2026-07-16',
    preferredProfessionalId: 'p2',
    notes: 'Le gustan los tonos rubios con reflexos caramelo.',
  },
  {
    id: 'c3',
    name: 'Andrea López',
    phone: '3154567890',
    cedula: '39876543',
    totalSpent: 190000,
    visitCount: 3,
    lastVisit: '2026-06-18',
  },
  {
    id: 'c4',
    name: 'Carlos Martínez',
    phone: '3182345678',
    cedula: '80123456',
    totalSpent: 90000,
    visitCount: 3,
    lastVisit: '2026-06-30',
    notes: 'Prefiere corte clásico, poco de los lados.',
  },
  {
    id: 'c5',
    name: 'Sofía Gómez',
    phone: '3201122334',
    cedula: '1098765432',
    totalSpent: 152000,
    visitCount: 4,
    lastVisit: '2026-07-16',
    preferredProfessionalId: 'p3',
  },
  {
    id: 'c6',
    name: 'Daniela Reyes',
    phone: '3007654321',
    cedula: '1056789012',
    totalSpent: 135000,
    visitCount: 3,
    lastVisit: '2026-06-25',
  },
];

// Sales history for Ventas slice
export const SALES_HISTORY = [
  { id: 'v1', appointmentId: 'a1', professionalId: 'p1', serviceId: 's1', date: '2026-07-16', amount: 45000, tip: 5000, paymentMethod: 'datafono' as const },
  { id: 'v2', appointmentId: 'a3', professionalId: 'p3', serviceId: 's5', date: '2026-07-16', amount: 38000, tip: 0, paymentMethod: 'qr' as const },
  { id: 'v3', appointmentId: 'a2', professionalId: 'p2', serviceId: 's3', date: '2026-07-16', amount: 220000, tip: 0, paymentMethod: 'anticipado' as const },
  { id: 'v4', appointmentId: null, professionalId: 'p1', serviceId: 's1', date: '2026-07-15', amount: 45000, tip: 3000, paymentMethod: 'datafono' as const },
  { id: 'v5', appointmentId: null, professionalId: 'p2', serviceId: 's4', date: '2026-07-15', amount: 95000, tip: 0, paymentMethod: 'link' as const },
  { id: 'v6', appointmentId: null, professionalId: 'p3', serviceId: 's5', date: '2026-07-15', amount: 38000, tip: 5000, paymentMethod: 'qr' as const },
  { id: 'v7', appointmentId: null, professionalId: 'p1', serviceId: 's4', date: '2026-07-14', amount: 95000, tip: 0, paymentMethod: 'datafono' as const },
  { id: 'v8', appointmentId: null, professionalId: 'p2', serviceId: 's1', date: '2026-07-14', amount: 45000, tip: 7000, paymentMethod: 'datafono' as const },
  { id: 'v9', appointmentId: null, professionalId: 'p1', serviceId: 's3', date: '2026-07-13', amount: 220000, tip: 20000, paymentMethod: 'anticipado' as const },
  { id: 'v10', appointmentId: null, professionalId: 'p3', serviceId: 's5', date: '2026-07-12', amount: 38000, tip: 0, paymentMethod: 'qr' as const },
  { id: 'v11', appointmentId: null, professionalId: 'p2', serviceId: 's3', date: '2026-07-11', amount: 220000, tip: 0, paymentMethod: 'anticipado' as const },
  { id: 'v12', appointmentId: null, professionalId: 'p1', serviceId: 's2', date: '2026-07-10', amount: 30000, tip: 0, paymentMethod: 'datafono' as const },
];

export function getProfessional(id: string) {
  return PROFESSIONALS.find(p => p.id === id);
}

export function getService(id: string) {
  return SERVICES.find(s => s.id === id);
}

export function formatCOP(amount: number): string {
  return `$${amount.toLocaleString('es-CO')}`;
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}min` : `${h}h`;
}
