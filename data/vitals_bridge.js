import fs from 'fs';
import { execSync } from 'child_process';
import http from 'https';

const AUTH_KEY = "galaxy_secure_alpha_2026";
const CLOUD_URL = "projectgalaxyai.com"; // Your live domain
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
        const totalPages = usedPages + freePages + 200000; // Rough estimate for total capacity
        
        const memPercent = (usedPages / totalPages) * 100;
        
        return {
            cpu: parseFloat(cpuLoad) * 10,
            mem: Math.round(memPercent)
        };
    } catch (e) {
        return { cpu: 0, mem: 0 };
    }
}

function pushToCloud() {
    try {
        const stats = getSystemStats();
        // Read local state to get current logs/structure
        const localData = JSON.parse(fs.readFileSync(LOG_FILE, 'utf8'));
        
        const payload = {
            key: AUTH_KEY,
            data: {
                ...localData,
                resources: {
                    gcp: localData.resources.gcp || 300,
                    api_calls: (localData.resources.api_calls || 0) + 1,
                    memory: stats.mem,
                    cpu: Math.round(stats.cpu)
                }
            }
        };

        const postData = JSON.stringify(payload);

        const options = {
            hostname: CLOUD_URL,
            port: 443,
            path: '/api/status',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': postData.length
            }
        };

        const req = http.request(options, (res) => {
            console.log(`Cloud Push Status: ${res.statusCode}`);
        });

        req.on('error', (e) => {
            console.error(`Cloud Push Failed: ${e.message}`);
        });

        req.write(postData);
        req.end();

        // Also update local file for redundancy
        fs.writeFileSync(LOG_FILE, JSON.stringify(payload.data, null, 2));

    } catch (err) {
        console.error('Bridge processing error:', err);
    }
}

// Push every 5 seconds
console.log("M4 Cloud Bridge Active. Pushing to projectgalaxyai.com...");
setInterval(pushToCloud, 5000);
pushToCloud();
