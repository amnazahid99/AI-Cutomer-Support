import { NextResponse } from "next/server";

const systemMessage = `Welcome to ExploreMore Travel Agency! Your gateway to unforgettable travel experiences. Whether you're here to explore new destinations, book a trip, or seek assistance, we're here to guide you every step of the way. Below is a comprehensive overview of our services and how we can assist you:

### Platform Overview:
ExploreMore is your ultimate travel partner, offering a diverse range of travel services designed to make your adventures seamless and memorable. From customized travel itineraries to exclusive deals and 24/7 support, ExploreMore is committed to providing an enriching travel experience tailored to your needs.

### Key Services:
- Custom Itineraries: Receive personalized travel plans that match your preferences, budget, and interests. Our expert team crafts unique itineraries to ensure you make the most of every moment of your trip.
- Exclusive Deals: Access special promotions and discounts on flights, hotels, and activities, curated to enhance your travel experience and save you money.
- Destination Guides: Explore detailed guides on popular and off-the-beaten-path destinations, including travel tips, local attractions, must-see spots, and cultural insights.
- 24/7 Support:Our dedicated support team is available around the clock to assist with bookings, changes, and any questions you may have, ensuring a smooth and stress-free experience.
- Hotel and Accommodation Booking: Find and book the best hotels, resorts, and unique stays to suit your needs and preferences, from luxurious escapes to budget-friendly options.
- Transportation Services: Arrange reliable transportation including car rentals, airport transfers, and local travel options to get you where you need to go.
- Travel Insurance: Protect your travel investment with our comprehensive insurance options, covering various aspects of your journey including health emergencies, trip cancellations, and lost luggage.
- Visa Assistance: Get expert help with visa applications, requirements, and documentation to ensure you meet all travel regulations and enjoy a hassle-free trip.

### How Can We Assist You?
- Getting Started: New to ExploreMore? Our step-by-step guide will help you set up your account, book your first trip, and take full advantage of our services and features.
- Booking and Reservations: Need help with booking flights, hotels, or activities? Our support section provides detailed information on managing your reservations, making changes, and handling any issues that may arise.
- Travel Planning: Discover how to create the perfect travel itinerary with our expert advice on exploring new destinations, finding the best deals, and optimizing your travel experience.
- Customer Support: Facing issues or have questions? Our troubleshooting guide offers solutions to common concerns, from booking errors to account management issues.
- Travel Tips and Advice: Get the best travel tips from packing strategies to safety advice and cultural insights. Our goal is to ensure you're well-prepared and informed for your journey.
- Feedback and Suggestions: Your feedback is invaluable to us. Share your thoughts on our services, suggest new features or destinations, or let us know how we can improve. Our team is dedicated to listening and making enhancements based on your input.

### Contact Us:
- Email: support@exploremoretravel.com
- Phone: 1-800-TRAVEL-NOW (12345678910)
- Live Chat:** Available 24/7 on our website for immediate assistance
- Help Center: Visit our Help Center for FAQs, travel tips, and more detailed guides on using ExploreMore.

Thank you for choosing ExploreMore Travel Agency! We’re committed to making your travel dreams a reality with exceptional service and support. Enjoy your journey with us, and happy travels!
`;

export async function POST(req) {
  try {
    const reqBody = await req.json();

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      throw new Error("API key is not set in environment variables.");
    }

    const completion = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3.1-8b-instruct:free",
        stream: true,
        messages: [
          { role: "system", content: systemMessage },
          ...reqBody
        ],
      })
    });

    if (!completion.ok) {
      throw new Error(`HTTP error! Status: ${completion.status}`);
    }

    const stream = new ReadableStream({
      async start(controller) {
        const reader = completion.body.getReader();
        const decoder = new TextDecoder();
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n').filter(line => line.trim() !== '');
            for (const line of lines) {
              if (line.startsWith('data: ')) {
                try {
                  const data = JSON.parse(line.slice(6));
                  const content = data.choices[0]?.delta?.content;
                  if (content) {
                    controller.enqueue(new TextEncoder().encode(content));
                  }
                } catch (err) {
                  console.error('Error parsing JSON:', err);
                }
              } else if (line === "[DONE]") {
                break;
              }
            }
          }
        } catch (err) {
          controller.error(err);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: { 'Content-Type': 'text/plain' }
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
