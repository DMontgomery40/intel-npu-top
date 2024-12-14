#!/usr/bin/env ts-node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const fs_1 = require("fs");
const promises_1 = require("timers/promises");
const readline = __importStar(require("readline"));
// Constants
const NPU_DEVICE_PATH = "/sys/devices/pci0000:00/0000:00:0b.0/power/runtime_active_time";
const UPDATE_INTERVAL = 1000; // 1 second
// NPU Monitor Class
class NPUMonitor extends events_1.EventEmitter {
    constructor() {
        super(...arguments);
        this.previousRuntime = 0;
        this.previousTime = Date.now();
        this.running = false;
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            this.running = true;
            console.log('Starting NPU monitor...');
            console.log(`Using device path: ${NPU_DEVICE_PATH}`);
            while (this.running) {
                try {
                    const data = yield this.getCurrentUsage();
                    this.emit('data', data);
                }
                catch (error) {
                    console.error(`Cannot read NPU data: ${error}`);
                    this.emit('error', error);
                }
                yield (0, promises_1.setTimeout)(UPDATE_INTERVAL);
            }
        });
    }
    stop() {
        this.running = false;
        this.emit('stop');
    }
    getCurrentUsage() {
        return __awaiter(this, void 0, void 0, function* () {
            const currentRuntime = yield this.readRuntime();
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
        });
    }
    readRuntime() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield fs_1.promises.readFile(NPU_DEVICE_PATH, 'utf8');
                return parseFloat(data.trim());
            }
            catch (error) {
                console.error(`Error reading file: ${error}`);
                return 0.0;
            }
        });
    }
}
// Display Class
class NPUDisplay {
    constructor() {
        this.history = [];
        this.maxHistory = 60; // Keep 1 minute of history
    }
    update(data) {
        this.history.push(data);
        if (this.history.length > this.maxHistory) {
            this.history.shift();
        }
        this.render();
    }
    render() {
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
function main() {
    return __awaiter(this, void 0, void 0, function* () {
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
        monitor.on('data', (data) => {
            display.update(data);
        });
        monitor.on('error', (error) => {
            console.error('Monitor error:', error);
        });
        // Start monitoring
        yield monitor.start();
    });
}
// Run the program
main().catch(console.error);
