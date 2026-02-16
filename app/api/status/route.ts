import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic'; // Always fetch fresh data

const LOG_FILE = path.join(process.cwd(), 'data', 'mission_log.json');

export async function GET() {
  try {
    const fileContents = fs.readFileSync(LOG_FILE, 'utf8');
    const data = JSON.parse(fileContents);
    
    // Calculate uptime or add dynamic fields if needed
    const response = {
      ...data,
      system: {
        uptime: process.uptime(),
        lastUpdate: new Date().toISOString()
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Failed to read mission log:', error);
    // Fallback data if file is missing/locked
    return NextResponse.json({
      logs: [{ id: 'err', source: 'SYSTEM', message: 'Log connection lost.', timestamp: '00:00:00', type: 'alert' }],
      agents: { hunter: { status: 'error' }, guardian: { status: 'error' }, navigator: { status: 'error' } },
      resources: { gcp: 0, api_calls: 0, storage: 0 }
    });
  }
}
