#!/usr/bin/env ts-node

import { promises as fs } from 'fs';
import { setTimeout } from 'timers/promises';

const NPU_DEVICE_PATH = "/sys/devices/pci0000:00/0000:00:0b.0/power/runtime_active_time";

async function readRuntime(): Promise<number> {
    try {
        const data = await fs.readFile(NPU_DEVICE_PATH, 'utf8');
        return parseFloat(data.trim());
    } catch (e) {
        return 0.0;
    }
}

(async () => {
    let previous_npu_runtime = 0.0;
    let previous_time = Date.now();

    while (true) {
        const current_runtime = await readRuntime();
        const runtime_diff = current_runtime - previous_npu_runtime;
        previous_npu_runtime = current_runtime;

        const current_time = Date.now();
        const time_diff = current_time - previous_time; // ms
        previous_time = current_time;

        const usage = time_diff > 0 ? (runtime_diff / time_diff) * 100.0 : 0.0;
        console.log(`NPU Usage: ${usage.toFixed(2)}%`);

        await setTimeout(1000);
    }
})();

