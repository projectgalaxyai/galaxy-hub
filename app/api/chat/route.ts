import { NextResponse } from 'next/server';

// Durable State (cached in serverless memory for polling)
let messageQueue: any[] = [];
let durableResponse: string = "";

export async function GET() {
  const pending = [...messageQueue];
  messageQueue = []; 

  return NextResponse.json({ 
    pending, 
    lastResponse: durableResponse 
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Case 1: From Architect (Web Terminal)
    if (body.message) {
      messageQueue.push({ id: Date.now().toString(), content: body.message });
      // Clear old durable response when a new command starts
      durableResponse = ""; 
      return NextResponse.json({ status: 'relayed' });
    }

    // Case 2: From Orion (M4 Relay)
    if (body.reply) {
      durableResponse = body.reply;
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid Payload' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Relay Failure' }, { status: 500 });
  }
}
