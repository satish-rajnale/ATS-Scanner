import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-06-20",
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { returnUrl } = body;

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: "Stripe is not configured" },
        { status: 500 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                    (request.headers.get("origin") || "http://localhost:3000");

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "ATS Scanner - Full Report",
              description: "Unlock full ATS analysis with AI-powered explanations and all detected issues",
            },
            unit_amount: 399, // $3.99 in cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${baseUrl}${returnUrl || "/results?payment_success=true"}`,
      cancel_url: `${baseUrl}/results`,
      metadata: {
        product: "full_report",
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}

