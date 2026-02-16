import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const LOG_FILE = '/Users/projectgalaxy/Documents/galaxy-hub/data/mission_log.json';

function getSystemStats() {
    try {
        // CPU Load via top (1-minute average)
        const cpuLoad = execSync("sysctl -n vm.loadavg | awk '{print $2}'").toString().trim();
        
        // Memory via vm_stat (more accurate for macOS)
        const vmStat = execSync("vm_stat").toString();
        const pageSize = 4096; // Standard page size on macOS
        
        const freePages = parseInt(vmStat.match(/Pages free:\s+(\d+)/)[1]);
        const activePages = parseInt(vmStat.match(/Pages active:\s+(\d+)/)[1]);
        const inactivePages = parseInt(vmStat.match(/Pages inactive:\s+(\d+)/)[1]);
        const speculativePages = parseInt(vmStat.match(/Pages speculative:\s+(\d+)/)[1]);
        const wiredPages = parseInt(vmStat.match(/Pages wired down:\s+(\d+)/)[1]);
        const compressedPages = parseInt(vmStat.match(/Pages occupied by compressor:\s+(\d+)/)[1]);

        const usedPages = activePages + wiredPages + compressedPages;
        const totalPages = usedPages + freePages + inactivePages + speculativePages;
        
        const memPercent = (usedPages / totalPages) * 100;
        
        return {
            cpu: parseFloat(cpuLoad) * 10, // Scale for display
            mem: Math.round(memPercent)
        };
    } catch (e) {
        console.error("Stats query failed:", e);
        return { cpu: 0, mem: 0 };
    }
}

function updateLog() {
    if (!fs.existsSync(LOG_FILE)) return;

    try {
        const stats = getSystemStats();
        const data = JSON.parse(fs.readFileSync(LOG_FILE, 'utf8'));
        
        data.resources = {
            gcp: data.resources.gcp || 300,
            api_calls: (data.resources.api_calls || 0) + 1,
            memory: stats.mem,
            cpu: Math.round(stats.cpu)
        };

        if (data.resources.api_calls % 10 === 0) {
            data.logs.unshift({
                id: Date.now().toString(),
                source: 'ORION',
                message: `System Vitals: CPU ${data.resources.cpu}% | MEM ${data.resources.memory}%`,
                timestamp: new Date().toLocaleTimeString(),
                type: 'log'
            });
            data.logs = data.logs.slice(0, 20);
        }

        fs.writeFileSync(LOG_FILE, JSON.stringify(data, null, 2));
    } catch (err) {
        console.error('Vitals update failed:', err);
    }
}

setInterval(updateLog, 5000);
updateLog();
