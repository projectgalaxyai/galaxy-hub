import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    // Log to server console
    console.log(`[ORION INBOUND]: ${message}`);

    const responses = [
      "Directive received. Analysis in progress.",
      "Acknowledged, Bryan. Executing tactical review.",
      "Command confirmed. Hunter sub-agents standing by.",
      "Signal locked. Updating Mission Control parameters.",
      "Processing directive through M4 Neural Engine...",
      "Strategic shift detected. Calibrating Hunter parameters."
    ];
    
    const randomReply = responses[Math.floor(Math.random() * responses.length)];

    return NextResponse.json({ 
      reply: randomReply,
      status: 'dispatched' 
    });
  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json({ error: 'Comms Link Failure' }, { status: 500 });
  }
}
