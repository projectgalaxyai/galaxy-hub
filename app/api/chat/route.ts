import { NextResponse } from 'next/server';

let messageQueue: any[] = [];
let lastResponse: string = "";

export async function GET() {
  // If the requester is the local M4 (asking for messages)
  const pending = [...messageQueue];
  messageQueue = []; 

  // Return both the pending queue and the last response so the UI can poll
  return NextResponse.json({ pending, lastResponse });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Case 1: From Architect (Web)
    if (body.message) {
      messageQueue.push({ id: Date.now().toString(), content: body.message });
      // Reset last response so the UI waits for the new one
      lastResponse = ""; 
      return NextResponse.json({ status: 'relayed' });
    }

    // Case 2: From Orion (M4)
    if (body.reply) {
      lastResponse = body.reply;
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid Payload' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Relay Failure' }, { status: 500 });
  }
}
