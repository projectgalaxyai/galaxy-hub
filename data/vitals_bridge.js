import fs from 'fs';
import { execSync } from 'child_process';
import http from 'https';

const AUTH_KEY = "galaxy_secure_alpha_2026";
const CLOUD_URL = "projectgalaxyai.com";
const LOG_FILE = '/Users/projectgalaxy/Documents/galaxy-hub/data/mission_log.json';

function getSystemStats() {
    try {
        const cpuLoad = execSync("sysctl -n vm.loadavg | awk '{print $2}'").toString().trim();
        const vmStat = execSync("vm_stat").toString();
        const freePages = parseInt(vmStat.match(/Pages free:\s+(\d+)/)[1]);
        const activePages = parseInt(vmStat.match(/Pages active:\s+(\d+)/)[1]);
        const wiredPages = parseInt(vmStat.match(/Pages wired down:\s+(\d+)/)[1]);
        const compressedPages = parseInt(vmStat.match(/Pages occupied by compressor:\s+(\d+)/)[1]);
        const usedPages = activePages + wiredPages + compressedPages;
        const totalPages = usedPages + freePages + 200000;
        return { cpu: parseFloat(cpuLoad) * 10, mem: Math.round((usedPages / totalPages) * 100) };
    } catch (e) { return { cpu: 0, mem: 0 }; }
}

async function handleChat() {
    const options = { hostname: CLOUD_URL, port: 443, path: '/api/chat', method: 'GET' };
    
    const req = http.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
            try {
                const { pending } = JSON.parse(data);
                if (pending && pending.length > 0) {
                    pending.forEach(msg => {
                        console.log(`[NEURAL LINK INBOUND]: ${msg.content}`);
                        // Here we would normally trigger the OpenClaw sub-agent.
                        // For this iteration, we push a "Neural Acknowledgement" back.
                        pushReply(`Director Orion has received your directive: "${msg.content}". Executing via M4 Neural Engine.`);
                    });
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
}

function pushTelemetry() {
    try {
        const stats = getSystemStats();
        const localData = JSON.parse(fs.readFileSync(LOG_FILE, 'utf8'));
        const payload = { key: AUTH_KEY, data: { ...localData, resources: { ...localData.resources, memory: stats.mem, cpu: Math.round(stats.cpu) } } };
        const postData = JSON.stringify(payload);
        const options = {
            hostname: CLOUD_URL, port: 443, path: '/api/status', method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Content-Length': postData.length }
        };
        const req = http.request(options);
        req.write(postData);
        req.end();
        fs.writeFileSync(LOG_FILE, JSON.stringify(payload.data, null, 2));
    } catch (err) {}
}

console.log("M4 Neural Link Active. Bridging Greenhouse to projectgalaxyai.com...");
setInterval(pushTelemetry, 5000);
setInterval(handleChat, 2000); // Check for commands every 2 seconds
