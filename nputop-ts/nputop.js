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
// Try different possible paths
const POSSIBLE_PATHS = [
    "/sys/devices/pci0000:00/0000:00:0b.0/power/runtime_active_time",
    "/sys/devices/pci0000:00/0000:00:0c.0/power/runtime_active_time",
    "/sys/devices/pci0000:00/0000:00:a.0/power/runtime_active_time"
];
function findNpuPath() {
    return __awaiter(this, void 0, void 0, function* () {
        for (const devicePath of POSSIBLE_PATHS) {
            try {
                yield fs_1.promises.access(devicePath);
                return devicePath;
            }
            catch (_a) {
                continue;
            }
        }
        return null;
    });
}
function readRuntime(devicePath) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = yield fs_1.promises.readFile(devicePath, 'utf8');
            return parseFloat(data.trim());
        }
        catch (e) {
            return 0.0;
        }
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const devicePath = yield findNpuPath();
        if (!devicePath) {
            console.error("No NPU device found");
            return;
        }
    });
}
main();
