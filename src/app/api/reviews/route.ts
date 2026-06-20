import { NextResponse } from 'next/server';
import { z } from 'zod';
import rateLimit from '@/lib/rate-limit';
import { supabase } from '@/lib/supabase';
import xss from 'xss';

const limiter = rateLimit({
  interval: 900000, // 15 minutes
  uniqueTokenPerInterval: 500,
});

const ReviewSchema = z.object({
  patient_name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name is too long"),
  location: z.string().min(2, "Location must be at least 2 characters").max(100, "Location is too long"),
  service_received: z.string().min(2, "Service name must be at least 2 characters").max(100, "Service name is too long"),
  rating: z.number().min(1, "Minimum rating is 1").max(5, "Maximum rating is 5"),
  review_message: z.string().min(10, "Review must be at least 10 characters").max(1000, "Review cannot exceed 1000 characters"),
});

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    
    // Rate Limit: Max 3 reviews per 15 minutes per IP
    try {
      await limiter.check(3, ip);
    } catch (limitError: any) {
      console.warn(`Rate limit exceeded for reviews IP: ${ip}`);
      return NextResponse.json(
        { error: 'Too Many Requests' },
        { status: 429, headers: limitError.headers }
      );
    }

    const body = await request.json();
    
    // Validation
    const parseResult = ReviewSchema.safeParse(body);
    if (!parseResult.success) {
      console.warn('Review validation failed:', parseResult.error.format());
      return NextResponse.json(
        { error: 'Invalid input parameters', details: parseResult.error.issues },
        { status: 400 }
      );
    }

    const { patient_name, location, service_received, rating, review_message } = parseResult.data;

    // XSS sanitization
    const sanitizedName = xss(patient_name);
    const sanitizedLocation = xss(location);
    const sanitizedService = xss(service_received);
    const sanitizedMessage = xss(review_message);

    // Insert into Supabase — hardcode review_type to 'real' to prevent bypass
    const { error: dbError } = await supabase
      .from('reviews')
      .insert([
        {
          patient_name: sanitizedName,
          location: sanitizedLocation,
          service_received: sanitizedService,
          rating,
          review_message: sanitizedMessage,
          status: 'pending',
          review_type: 'real',
          is_featured: false,
        }
      ]);

    if (dbError) {
      console.error('Supabase Review Insert Error:', dbError);
      return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 });
    }

    return NextResponse.json(
      { message: 'Review submitted successfully and is pending approval.' },
      { status: 201 }
    );
    
  } catch (error) {
    console.error('Review API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
