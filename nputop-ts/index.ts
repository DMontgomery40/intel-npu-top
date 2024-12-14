#!/usr/bin/env ts-node

import { EventEmitter } from 'events';
import { promises as fs } from 'fs';
import { setTimeout } from 'timers/promises';
import * as readline from 'readline';

// Constants
const NPU_DEVICE_PATH = "/sys/devices/pci0000:00/0000:00:0b.0/power/runtime_active_time";
const UPDATE_INTERVAL = 1000; // 1 second

// Types
interface NPUData {
    timestamp: number;
    usage: number;
    rawRuntime: number;
}

// NPU Monitor Class
class NPUMonitor extends EventEmitter {
    private previousRuntime: number = 0;
    private previousTime: number = Date.now();
    private running: boolean = false;

    async start() {
        this.running = true;
        console.log('Starting NPU monitor...');
        console.log(`Using device path: ${NPU_DEVICE_PATH}`);

        while (this.running) {
            try {
                const data = await this.getCurrentUsage();
                this.emit('data', data);
            } catch (error) {
                console.error(`Cannot read NPU data: ${error}`);
                this.emit('error', error);
            }
            await setTimeout(UPDATE_INTERVAL);
        }
    }

    stop() {
        this.running = false;
        this.emit('stop');
    }

    private async getCurrentUsage(): Promise<NPUData> {
        const currentRuntime = await this.readRuntime();
        console.log(`Current reading: ${currentRuntime}`);
        
        const runtimeDiff = currentRuntime - this.previousRuntime;
        this.previousRuntime = currentRuntime;

        const currentTime = Date.now();
        const timeDiff = currentTime - this.previousTime;
        this.previousTime = currentTime;

        const usage = timeDiff > 0 ? (runtimeDiff / timeDiff) * 100.0 : 0.0;

        return {
            timestamp: currentTime,
            usage,
            rawRuntime: currentRuntime
        };
    }

    private async readRuntime(): Promise<number> {
        try {
            const data = await fs.readFile(NPU_DEVICE_PATH, 'utf8');
            return parseFloat(data.trim());
        } catch (error) {
            console.error(`Error reading file: ${error}`);
            return 0.0;
        }
    }
}

// Display Class
class NPUDisplay {
    private history: NPUData[] = [];
    private readonly maxHistory = 60; // Keep 1 minute of history
    
    update(data: NPUData) {
        this.history.push(data);
        if (this.history.length > this.maxHistory) {
            this.history.shift();
        }
        this.render();
    }

    private render() {
        // Clear screen
        console.clear();
        
        // Show current usage
        const currentData = this.history[this.history.length - 1];
        console.log(`NPU Usage: ${currentData.usage.toFixed(2)}%`);
        console.log(`Raw Runtime: ${currentData.rawRuntime}`);
        
        // Show simple graph using ASCII
        const graphWidth = 50;
        const graph = this.history.map(d => {
            const bars = Math.round((d.usage / 100) * graphWidth);
            return `[${'#'.repeat(bars)}${' '.repeat(graphWidth - bars)}] ${d.usage.toFixed(2)}%`;
        }).join('\n');
        
        console.log('\nHistory:');
        console.log(graph);
    }
}

// Main
async function main() {
    const monitor = new NPUMonitor();
    const display = new NPUDisplay();

    // Handle keyboard input
    readline.emitKeypressEvents(process.stdin);
    if (process.stdin.isTTY) {
        process.stdin.setRawMode(true);
    }

    process.stdin.on('keypress', (str, key) => {
        if (key.ctrl && key.name === 'c' || key.name === 'q') {
            console.log('\nExiting...');
            monitor.stop();
            process.exit(0);
        }
    });

    // Connect monitor to display
    monitor.on('data', (data: NPUData) => {
        display.update(data);
    });

    monitor.on('error', (error) => {
        console.error('Monitor error:', error);
    });

    // Start monitoring
    await monitor.start();
}

// Run the program
main().catch(console.error);