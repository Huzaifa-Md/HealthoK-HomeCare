import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, address, service, date, time, notes, urgent } = body;

    // Log the callback request for admin visibility
    console.log('=== NEW CALLBACK REQUEST ===');
    console.log(`Name: ${name}`);
    console.log(`Phone: ${phone}`);
    console.log(`Address: ${address}`);
    console.log(`Service: ${service}`);
    console.log(`Date: ${date}`);
    console.log(`Time: ${time}`);
    console.log(`Notes: ${notes}`);
    console.log(`Urgent: ${urgent ? 'YES' : 'No'}`);
    console.log('============================');

    // Email sending via SMTP (if credentials are configured)
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const adminEmail = process.env.ADMIN_EMAIL || 'hiah.sadiq@gmail.com';

    if (smtpHost && smtpUser && smtpPass) {
      // Use nodemailer if available
      try {
        const nodemailer = await import('nodemailer');
        const transporter = nodemailer.default.createTransport({
          host: smtpHost,
          port: parseInt(smtpPort || '587'),
          secure: smtpPort === '465',
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
        });

        await transporter.sendMail({
          from: smtpUser,
          to: adminEmail,
          subject: `${urgent ? '⚠️ URGENT: ' : ''}New Callback Request - ${name}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: linear-gradient(135deg, #0066cc, #00b894); padding: 20px; border-radius: 12px 12px 0 0;">
                <h1 style="color: white; margin: 0; font-size: 20px;">New Callback Request</h1>
              </div>
              <div style="background: #f8fafc; padding: 20px; border: 1px solid #e2e8f0; border-radius: 0 0 12px 12px;">
                ${urgent ? '<div style="background: #fee2e2; border: 1px solid #fecaca; padding: 10px; border-radius: 8px; margin-bottom: 16px; color: #dc2626; font-weight: bold;">⚠️ URGENT REQUEST</div>' : ''}
                <table style="width: 100%; border-collapse: collapse;">
                  <tr><td style="padding: 8px 0; color: #64748b; font-size: 14px;">Name</td><td style="padding: 8px 0; font-weight: 600;">${name}</td></tr>
                  <tr><td style="padding: 8px 0; color: #64748b; font-size: 14px;">Phone</td><td style="padding: 8px 0; font-weight: 600;">${phone}</td></tr>
                  <tr><td style="padding: 8px 0; color: #64748b; font-size: 14px;">Address</td><td style="padding: 8px 0; font-weight: 600;">${address}</td></tr>
                  <tr><td style="padding: 8px 0; color: #64748b; font-size: 14px;">Service</td><td style="padding: 8px 0; font-weight: 600;">${service}</td></tr>
                  <tr><td style="padding: 8px 0; color: #64748b; font-size: 14px;">Date</td><td style="padding: 8px 0; font-weight: 600;">${date}</td></tr>
                  <tr><td style="padding: 8px 0; color: #64748b; font-size: 14px;">Time</td><td style="padding: 8px 0; font-weight: 600;">${time}</td></tr>
                  <tr><td style="padding: 8px 0; color: #64748b; font-size: 14px;">Notes</td><td style="padding: 8px 0; font-weight: 600;">${notes}</td></tr>
                </table>
              </div>
            </div>
          `,
        });
        console.log('Admin email sent successfully.');
      } catch (emailErr) {
        console.error('Email sending failed:', emailErr);
      }
    } else {
      console.log('SMTP not configured — skipping email notification.');
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
