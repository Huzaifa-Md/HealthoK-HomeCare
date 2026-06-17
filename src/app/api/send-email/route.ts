import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';
import rateLimit from '@/lib/rate-limit';

const resend = new Resend(process.env.RESEND_API_KEY);

const limiter = rateLimit({
  interval: 60000,
  uniqueTokenPerInterval: 500,
});

const RequestSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name is too long"),
  phone: z.string().regex(/^[0-9+\s-]{10,15}$/, "Invalid phone number format"),
  notes: z.string().max(1000, "Notes cannot exceed 1000 characters").optional().default(""),
});

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    
    try {
      await limiter.check(60, ip);
    } catch (limitError: any) {
      console.warn(`Rate limit exceeded for IP: ${ip}`);
      return NextResponse.json(
        { error: 'Too Many Requests' },
        { 
          status: 429, 
          headers: limitError.headers 
        }
      );
    }

    const body = await request.json();
    
    const parseResult = RequestSchema.safeParse(body);
    if (!parseResult.success) {
      console.warn(`Validation failed:`, parseResult.error.flatten());
      return NextResponse.json(
        { error: 'Invalid input data', details: parseResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, phone, notes } = parseResult.data;

    console.log('=== NEW CALLBACK REQUEST ===');
    console.log(`Name: ${name}`);
    console.log(`Phone: ${phone}`);
    console.log(`Notes: ${notes}`);
    console.log(`IP: ${ip}`);
    console.log('============================');

    const adminEmail = process.env.ADMIN_EMAIL;

    if (!adminEmail) {
      console.error('CRITICAL: ADMIN_EMAIL is not configured.');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    if (process.env.RESEND_API_KEY) {
      try {
        const { data, error } = await resend.emails.send({
          from: 'PrickCare <onboarding@resend.dev>',
          to: [adminEmail],
          subject: 'New Callback Request - PrickCare',
          text: `Patient Name:\n${name}\n\nMobile Number:\n${phone}\n\nRequirements:\n${notes}\n\nSubmitted At:\n${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <p><strong>Patient Name:</strong><br/>${name}</p>
              <p><strong>Mobile Number:</strong><br/>${phone}</p>
              <p><strong>Requirements:</strong><br/>${notes}</p>
              <p><strong>Submitted At:</strong><br/>${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
            </div>
          `,
        });

        if (error) {
          console.error('Resend email sending failed:', error);
          return NextResponse.json(
            { error: 'Something went wrong' },
            { status: 500 }
          );
        }

        console.log('Admin email sent successfully via Resend:', data);
      } catch (emailErr) {
        console.error('Unexpected Resend error:', emailErr);
        return NextResponse.json(
          { error: 'Something went wrong' },
          { status: 500 }
        );
      }
    } else {
      console.log('RESEND_API_KEY not configured — skipping email notification.');
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('send-email route error:', err);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}
