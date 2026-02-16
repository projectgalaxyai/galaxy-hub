import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv'; // We'll use Vercel KV for global state if available, or a simple memory cache

// Fallback in-memory store for cloud state (resets on redeploy)
let cloudState = {
  logs: [{ id: 'init', source: 'SYSTEM', message: 'Cloud Bridge Initialized. Waiting for M4 signal...', timestamp: '00:00:00', type: 'alert' }],
  agents: { hunter: { status: 'offline' }, guardian: { status: 'offline' }, navigator: { status: 'offline' } },
  resources: { gcp: 300, api_calls: 0, memory: 0, cpu: 0 }
};

const AUTH_KEY = "galaxy_secure_alpha_2026"; // In a real app, this would be an env var

export async function GET() {
  return NextResponse.json(cloudState);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { key, data } = body;

    if (key !== AUTH_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Update the cloud state with the incoming M4 telemetry
    cloudState = {
      ...data,
      system: {
        lastUpdate: new Date().toISOString(),
        location: 'Greenhouse M4'
      }
    };

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Payload Error' }, { status: 400 });
  }
}
