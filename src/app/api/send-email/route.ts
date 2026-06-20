import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';
import rateLimit from '@/lib/rate-limit';

const resend = new Resend(process.env.RESEND_API_KEY);

const limiter = rateLimit({
  interval: 900000, // 15 minutes
  uniqueTokenPerInterval: 500,
});

const RequestSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name is too long"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Invalid Indian mobile number"),
  email: z.string().email("Invalid email format").optional().or(z.literal('')),
  notes: z.string().min(10, "Notes must be at least 10 characters").max(1000, "Notes cannot exceed 1000 characters"),
});

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    
    try {
      await limiter.check(5, ip); // 5 requests per 15 minutes
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

    const { name, phone, email, notes } = parseResult.data;

    console.log('=== NEW CALLBACK REQUEST ===');
    console.log(`Name: ${name}`);
    console.log(`Phone: ${phone}`);
    console.log(`Email: ${email || 'N/A'}`);
    console.log(`IP: ${ip}`);
    console.log('============================');

    const adminEmail = process.env.ADMIN_EMAIL;

    if (!adminEmail) {
      console.error('CRITICAL: ADMIN_EMAIL is not configured.');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    if (process.env.RESEND_API_KEY) {
      try {
        // 1. Send Admin Email
        const adminHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; line-height: 1.6;">
            <p style="margin-bottom: 20px;">Patient Care Home Services</p>
            <p style="margin-bottom: 20px;">A new callback request has been received.</p>
            
            <p style="margin: 10px 0;"><strong>Patient Name:</strong><br/>${name}</p>
            <p style="margin: 10px 0;"><strong>Phone Number:</strong><br/>${phone}</p>
            ${email ? `<p style="margin: 10px 0;"><strong>Email:</strong><br/>${email}</p>` : ''}
            <p style="margin: 10px 0;"><strong>Notes:</strong><br/>${notes}</p>
            <p style="margin: 10px 0;"><strong>Submission Time:</strong><br/>${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
            <br/>
            <p style="margin: 10px 0;">Please contact the patient as soon as possible.</p>
            <p style="margin: 10px 0 0 0;">Patient Care Home Services</p>
            <p style="margin: 0; color: #64748b; font-size: 14px;">Care At Home</p>
          </div>
        `;

        await resend.emails.send({
          from: 'Patient Care <onboarding@resend.dev>',
          to: [adminEmail],
          subject: 'New Callback Request - Patient Care Home Services',
          html: adminHtml,
        });
        console.log('Admin email sent successfully.');

        // 2. Send Customer Confirmation Email (If email provided)
        if (email) {
          const customerHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
              <h2 style="color: #047857;">Thank You For Contacting Patient Care Home Services</h2>
              <p style="color: #334155; line-height: 1.6;">Dear ${name},</p>
              <p style="color: #334155; line-height: 1.6;">Thank you for reaching out to us. We have received your callback request successfully.</p>
              <p style="color: #334155; line-height: 1.6;">Our healthcare coordination team will review your requirements and reach out to you shortly at <strong>${phone}</strong>.</p>
              <br/>
              <p style="color: #334155; line-height: 1.6; margin-bottom: 0;">Warm regards,</p>
              <p style="color: #047857; font-weight: bold; margin-top: 5px; margin-bottom: 0;">Patient Care Home Services</p>
              <p style="color: #64748b; font-size: 14px; margin-top: 2px;">Care At Home</p>
            </div>
          `;

          await resend.emails.send({
            from: 'Patient Care <onboarding@resend.dev>',
            to: [email],
            subject: 'Thank You For Contacting Patient Care Home Services',
            html: customerHtml,
          });
          console.log('Customer confirmation email sent successfully.');
        }

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
