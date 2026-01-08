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
Object.defineProperty(exports, "__esModule", { value: true });
exports.migrations = void 0;
const migration_20260105_114119 = __importStar(require("./20260105_114119"));
const migration_20260105_151200_fix_users_sessions = __importStar(require("./20260105_151200_fix_users_sessions"));
const migration_20260105_212900_fix_payload_preferences_rels = __importStar(require("./20260105_212900_fix_payload_preferences_rels"));
const migration_20260106_113818 = __importStar(require("./20260106_113818"));
exports.migrations = [
    {
        up: migration_20260105_114119.up,
        down: migration_20260105_114119.down,
        name: '20260105_114119',
    },
    {
        up: migration_20260105_151200_fix_users_sessions.up,
        down: migration_20260105_151200_fix_users_sessions.down,
        name: '20260105_151200_fix_users_sessions',
    },
    {
        up: migration_20260105_212900_fix_payload_preferences_rels.up,
        down: migration_20260105_212900_fix_payload_preferences_rels.down,
        name: '20260105_212900_fix_payload_preferences_rels',
    },
    {
        up: migration_20260106_113818.up,
        down: migration_20260106_113818.down,
        name: '20260106_113818'
    },
];
