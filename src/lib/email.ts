import { Resend } from 'resend';

// Cliente de Resend para envío de emails
export const resend = new Resend(process.env.RESEND_API_KEY);

// Dominio de envío (usar el de Resend para desarrollo)
export const EMAIL_FROM = 'Takopi <onboarding@resend.dev>';

// En producción con dominio verificado:
// export const EMAIL_FROM = 'Takopi <noreply@takopi.com>';
