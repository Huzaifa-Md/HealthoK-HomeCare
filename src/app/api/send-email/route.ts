import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, notes } = body;

    // Log the callback request for admin visibility
    console.log('=== NEW CALLBACK REQUEST ===');
    console.log(`Name: ${name}`);
    console.log(`Phone: ${phone}`);
    console.log(`Notes: ${notes}`);
    console.log('============================');

    const adminEmail = process.env.ADMIN_EMAIL || 'huzaifahussain10@gmail.com';

    if (process.env.RESEND_API_KEY) {
      try {
        const { data, error } = await resend.emails.send({
          from: 'HealthoK HomeCare <onboarding@resend.dev>',
          to: [adminEmail],
          subject: 'New Callback Request - HealthoK HomeCare',
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
            { error: 'Email sending failed', details: error },
            { status: 500 }
          );
        }

        console.log('Admin email sent successfully via Resend:', data);
      } catch (emailErr) {
        console.error('Unexpected Resend error:', emailErr);
        return NextResponse.json(
          { error: 'Unexpected Email Error', details: emailErr },
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
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
