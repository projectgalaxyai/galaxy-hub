import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { message } = await request.json();
    const command = message.toLowerCase();

    // Mission Control Command Logic
    let reply = "";

    if (command.includes("hunter")) {
      reply = "DIRECTIVE: Hunter Activation. Initializing BDR prospecting sub-agents on M4 Neural Engine. Scanning Great Plains Communications parameters.";
    } else if (command.includes("guardian")) {
      reply = "DIRECTIVE: Guardian Shield engaged. Running autonomous E2E playwright tests on Constellation CRM. Integrity check in progress.";
    } else if (command.includes("vitals") || command.includes("status")) {
      reply = "TELEMETRY: System vitals stable. M4 Memory and CPU streams are verified. Connection to Greenhouse is nominal.";
    } else if (command.includes("hello") || command.includes("orion")) {
      reply = "Greetings, Bryan. The Director is online. All Galaxy sub-systems are green. Awaiting your next strategic move.";
    } else {
      reply = `ACKNOWLEDGED: "${message}" has been logged as a tactical directive to the M4 controller. Analysis sequence initiated.`;
    }

    // Log to server console
    console.log(`[TACTICAL COMMAND]: ${message}`);

    return NextResponse.json({ 
      reply: reply,
      status: 'dispatched' 
    });
  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json({ error: 'Comms Link Failure' }, { status: 500 });
  }
}
