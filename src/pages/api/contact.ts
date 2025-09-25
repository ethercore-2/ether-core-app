import { supabase } from '@/lib/supabase';
import type { NextApiRequest, NextApiResponse } from 'next';

interface ContactRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
  captchaValue?: string;
  preferred_contact_time?: string;
  preferred_contact_method?: string;
}

interface ContactResponse {
  message?: string;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ContactResponse>
) {
  if (req.method === 'POST') {
    const { name, email, subject, message, captchaValue, preferred_contact_time, preferred_contact_method } = req.body as ContactRequest;

    // Verify reCAPTCHA (only if captchaValue is provided and secret key exists)
    if (captchaValue && process.env.RECAPTCHA_SECRET_KEY) {
      const secretKey = process.env.RECAPTCHA_SECRET_KEY;
      const response = await fetch(
        `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captchaValue}`,
        {
          method: 'POST',
        }
      );
      const captchaData = await response.json();

      if (!captchaData.success) {
        return res.status(400).json({ error: 'reCAPTCHA verification failed' });
      }
    }

    // Ensure subject is set
    const finalSubject = subject || 'General/Other Enquiries';

    const { error: insertError } = await supabase.from('contacts').insert([
      {
        name,
        email,
        subject: finalSubject,
        message,
        preferred_contact_time: preferred_contact_time || null,
        preferred_contact_method: preferred_contact_method || null
      }
    ]);

    if (insertError) {
      return res.status(500).json({ error: insertError.message });
    }

    return res.status(200).json({ message: 'Message sent successfully!' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
} 