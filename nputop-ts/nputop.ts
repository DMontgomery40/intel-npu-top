#!/usr/bin/env ts-node

import { promises as fs } from 'fs';
import { setTimeout } from 'timers/promises';
import path from 'path';

// Try different possible paths
const POSSIBLE_PATHS = [
    "/sys/devices/pci0000:00/0000:00:0b.0/power/runtime_active_time",
    "/sys/devices/pci0000:00/0000:00:0c.0/power/runtime_active_time",
    "/sys/devices/pci0000:00/0000:00:a.0/power/runtime_active_time"
];

async function findNpuPath(): Promise<string | null> {
    for (const devicePath of POSSIBLE_PATHS) {
        try {
            await fs.access(devicePath);
            return devicePath;
        } catch {
            continue;
        }
    }
    return null;
}

async function readRuntime(devicePath: string): Promise<number> {
    try {
        const data = await fs.readFile(devicePath, 'utf8');
        return parseFloat(data.trim