import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    // In a production setup, this would trigger an OpenClaw event
    // For this build, we return an acknowledgment and log the command
    console.log(`[ORION INBOUND]: ${message}`);

    const responses = [
      "Directive received. Analysis in progress.",
      "Acknowledged, Bryan. Executing tactical review.",
      "Command confirmed. Hunter sub-agents standing by.",
      "Signal locked. Updating Mission Control parameters."
    ];
    
    const randomReply = responses[Math.floor(Math.random() * responses.length)];

    return NextResponse.json({ 
      reply: randomReply,
      status: 'dispatched' 
    });
  } catch (error) {
    return NextResponse.json({ error: 'Comms Link Failure' }, { status: 500 });
  }
}
