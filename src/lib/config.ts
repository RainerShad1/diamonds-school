export const school = {
  name: process.env.NEXT_PUBLIC_SCHOOL_NAME || 'Diamonds School',
  slogan:
    process.env.NEXT_PUBLIC_SCHOOL_SLOGAN ||
    'Formando el futuro, un estudiante a la vez',
  phone: process.env.NEXT_PUBLIC_SCHOOL_PHONE || '+1 809 000 0000',
  whatsapp: process.env.NEXT_PUBLIC_SCHOOL_WHATSAPP || '18090000000',
  email: process.env.NEXT_PUBLIC_SCHOOL_EMAIL || 'info@diamondsschool.edu.do',
  address:
    process.env.NEXT_PUBLIC_SCHOOL_ADDRESS || 'La Romana, República Dominicana',
};

export const niveles = ['Inicial', 'Pre-Primaria', 'Primaria', 'Secundaria'];
