#!/usr/bin/env ts-node
"use strict";
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
const fs_1 = require("fs");
const promises_1 = require("timers/promises");
const NPU_DEVICE_PATH = "/sys/devices/pci0000:00/0000:00:0b.0/power/runtime_active_time";
function readRuntime() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = yield fs_1.promises.readFile(NPU_DEVICE_PATH, 'utf8');
            return parseFloat(data.trim());
        }
        catch (e) {
            return 0.0;
        }
    });
}
(() => __awaiter(void 0, void 0, void 0, function* () {
    let previous_npu_runtime = 0.0;
    let previous_time = Date.now();
    while (true) {
        const current_runtime = yield readRuntime();
        const runtime_diff = current_runtime - previous_npu_runtime;
        previous_npu_runtime = current_runtime;
        const current_time = Date.now();
        const time_diff = current_time - previous_time; // ms
        previous_time = current_time;
        const usage = time_diff > 0 ? (runtime_diff / time_diff) * 100.0 : 0.0;
        console.log(`NPU Usage: ${usage.toFixed(2)}%`);
        yield (0, promises_1.setTimeout)(1000);
    }
}))();
