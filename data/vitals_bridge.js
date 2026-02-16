import fs from 'fs';
import { execSync } from 'child_process';
import http from 'https';

const AUTH_KEY = "galaxy_secure_alpha_2026";
const CLOUD_URL = "projectgalaxyai.com";

// Function to call local Ollama
async function getOllamaResponse(prompt) {
    try {
        console.log(`[THINKING]: Consulting Llama 3.1 8B...`);
        const cmd = `curl -s http://127.0.0.1:11434/api/generate -d '{"model": "llama3.1:8b", "prompt": "You are Orion, Director of AI Operations. Bryan (the Architect) sent this command: ${prompt.replace(/'/g, "")}. Reply with a brief, high-level tactical update.", "stream": false}'`;
        const result = execSync(cmd).toString();
        const json = JSON.parse(result);
        return json.response;
    } catch (e) {
        return "Tactical link degraded.";
    }
}

async function handleChat() {
    const options = { hostname: CLOUD_URL, port: 443, path: '/api/chat', method: 'GET' };
    const req = http.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', async () => {
            try {
                const { pending } = JSON.parse(data);
                if (pending && pending.length > 0) {
                    for (const msg of pending) {
                        console.log(`[INBOUND]: ${msg.content}`);
                        const realResponse = await getOllamaResponse(msg.content);
                        pushReply(realResponse);
                    }
                }
            } catch (e) {}
        });
    });
    req.end();
}

function pushReply(text) {
    const postData = JSON.stringify({ reply: text });
    const options = {
        hostname: CLOUD_URL, port: 443, path: '/api/chat', method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Content-Length': postData.length }
    };
    const req = http.request(options);
    req.write(postData);
    req.end();
    console.log(`[OUTBOUND]: Response Pushed.`);
}

function pushTelemetry() {
    try {
        const vmStat = execSync("vm_stat").toString();
        const activePages = parseInt(vmStat.match(/Pages active:\s+(\d+)/)[1]);
        const wiredPages = parseInt(vmStat.match(/Pages wired down:\s+(\d+)/)[1]);
        const memPercent = ((activePages + wiredPages) / 4000000) * 100;
        
        const payload = { key: AUTH_KEY, data: { resources: { memory: Math.round(memPercent), cpu: 12, gcp: 300, api_calls: 100 }, logs: [] } };
        const postData = JSON.stringify(payload);
        const options = {
            hostname: CLOUD_URL, port: 443, path: '/api/status', method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Content-Length': postData.length }
        };
        const req = http.request(options);
        req.write(postData);
        req.end();
    } catch (err) {}
}

console.log("M4 Neural Link: STANDBY. Bridging to projectgalaxyai.com...");
setInterval(pushTelemetry, 10000);
setInterval(handleChat, 3000);
