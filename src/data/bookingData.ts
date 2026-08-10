export interface BookingProfessional {
  id: string;
  name: string;
  role: string;
  specialty: string;
  rating: number;
  reviewCount: number;
  yearsExp: number;
  initials: string;
  color: string;
  available: boolean;
}

export interface BookingReview {
  id: string;
  clientName: string;
  rating: number;
  comment: string;
  date: string;
  serviceName?: string;
}

export interface BookingBranch {
  id: string;
  name: string;
  shortName: string;
  category: string;
  address: string;
  neighborhood: string;
  city: string;
  phone: string;
  hours: string;
  heroFrom: string;
  heroTo: string;
  rating: number;
  reviewCount: number;
  description: string;
  professionals: BookingProfessional[];
  reviews: BookingReview[];
}

export const BOOKING_BRANCHES: BookingBranch[] = [
  {
    id: 'norte',
    name: 'Salón Camila Norte',
    shortName: 'Norte',
    category: 'Salón de belleza',
    address: 'Calle 127 #13-42',
    neighborhood: 'Bogotá Norte',
    city: 'Bogotá',
    phone: '3101234567',
    hours: 'Lun – Sáb · 8:00 am – 7:00 pm',
    heroFrom: '#FF2947',
    heroTo: '#7b0c25',
    rating: 4.8,
    reviewCount: 128,
    description:
      'Salón especializado en colorimetría, cortes personalizados y cuidado del cabello. Atención personalizada con productos L\'Oréal y Schwarzkopf. Equipo certificado y más de 7 años de experiencia.',
    professionals: [
      {
        id: 'np1', name: 'Camila Vargas', role: 'Estilista · Dueña',
        specialty: 'Cortes y colorimetría avanzada',
        rating: 4.9, reviewCount: 89, yearsExp: 7,
        initials: 'CV', color: '#FF2947', available: true,
      },
      {
        id: 'np2', name: 'Valentina Ruiz', role: 'Colorista Certificada',
        specialty: 'Técnicas de color y decoloración',
        rating: 4.7, reviewCount: 56, yearsExp: 5,
        initials: 'VR', color: '#7C3AED', available: true,
      },
      {
        id: 'np3', name: 'Andrés Mora', role: 'Especialista en Uñas',
        specialty: 'Manicure, pedicure y nail art',
        rating: 4.8, reviewCount: 43, yearsExp: 4,
        initials: 'AM', color: '#2563EB', available: true,
      },
    ],
    reviews: [
      {
        id: 'nr1', clientName: 'Laura G.', rating: 5,
        comment: 'Camila hizo un trabajo increíble con mi balayage. El resultado superó todas mis expectativas. Ya agendé la siguiente cita.',
        date: '28 jun 2026', serviceName: 'Balayage',
      },
      {
        id: 'nr2', clientName: 'Daniela R.', rating: 5,
        comment: 'Muy puntual y el ambiente es súper agradable. El tinte quedó perfecto y la duración ha sido buenísima. 10/10.',
        date: '1 jul 2026', serviceName: 'Tinte raíz',
      },
      {
        id: 'nr3', clientName: 'Andrea M.', rating: 4,
        comment: 'Valentina es muy detallista con el color. Excelente atención. Le doy 4 porque esperé unos 10 minutos extra al llegar.',
        date: '5 jul 2026', serviceName: 'Mechas californianas',
      },
      {
        id: 'nr4', clientName: 'Sofía J.', rating: 5,
        comment: 'El alisado de keratina fue transformador. Llevo 2 meses y el cabello sigue igual de liso. 100% recomendado.',
        date: '10 jul 2026', serviceName: 'Alisado kerátina',
      },
      {
        id: 'nr5', clientName: 'María V.', rating: 5,
        comment: 'El manicure semipermanente de Andrés dura muchísimo. La atención personalizada es definitivamente lo mejor del lugar.',
        date: '12 jul 2026', serviceName: 'Manicure semipermanente',
      },
    ],
  },
  {
    id: 'centro',
    name: 'Salón Camila Centro',
    shortName: 'Centro',
    category: 'Salón de belleza · Barbería',
    address: 'Carrera 13 #85-24',
    neighborhood: 'Chapinero · Bogotá',
    city: 'Bogotá',
    phone: '3112345678',
    hours: 'Lun – Sáb · 9:00 am – 7:00 pm',
    heroFrom: '#1a2a5c',
    heroTo: '#0D9488',
    rating: 4.6,
    reviewCount: 84,
    description:
      'Salón unisex en el corazón de Chapinero, especializado en cortes modernos y barbería de precisión. Ambiente urbano con técnica europea. Referente en la zona para cortes masculinos impecables.',
    professionals: [
      {
        id: 'cp1', name: 'Sebastián Torres', role: 'Barbero · Estilista',
        specialty: 'Cortes masculinos y barbería de precisión',
        rating: 4.7, reviewCount: 62, yearsExp: 6,
        initials: 'ST', color: '#0D9488', available: true,
      },
      {
        id: 'cp2', name: 'Luisa Hernández', role: 'Estilista Creativa',
        specialty: 'Cortes de dama y coloración',
        rating: 4.6, reviewCount: 38, yearsExp: 3,
        initials: 'LH', color: '#D97706', available: true,
      },
    ],
    reviews: [
      {
        id: 'cr1', clientName: 'Carlos V.', rating: 5,
        comment: 'Sebastián es, sin duda, el mejor barbero que he encontrado en Bogotá. El corte + barba siempre queda perfecto.',
        date: '30 jun 2026', serviceName: 'Corte + barba',
      },
      {
        id: 'cr2', clientName: 'Rodrigo C.', rating: 5,
        comment: 'El afeitado clásico es una experiencia premium. Navaja caliente, buenos productos y atención impecable.',
        date: '8 jul 2026', serviceName: 'Afeitado clásico',
      },
      {
        id: 'cr3', clientName: 'Luisa P.', rating: 4,
        comment: 'Vine por el corte de dama y quedé encantada. El local es pequeño pero muy bien ambientado y el resultado fue genial.',
        date: '11 jul 2026', serviceName: 'Corte de dama',
      },
      {
        id: 'cr4', clientName: 'Fernando D.', rating: 5,
        comment: 'Siempre salgo feliz de este salón. La calidad del servicio es constante y el ambiente muy agradable.',
        date: '14 jul 2026', serviceName: 'Arreglo de barba',
      },
    ],
  },
];
