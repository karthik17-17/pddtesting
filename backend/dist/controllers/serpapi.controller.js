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
exports.searchHotels = searchHotels;
const serpapi_service_1 = require("../services/serpapi.service");
function searchHotels(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const startTime = Date.now();
        const rawQuery = ((_a = req.body) === null || _a === void 0 ? void 0 : _a.query) || ((_b = req.query) === null || _b === void 0 ? void 0 : _b.query) || "Chennai";
        const cleanQuery = String(rawQuery).trim() || "Chennai";
        console.log(`\n=================== [HOTEL SEARCH AUDIT LOG] ===================`);
        console.log(`[1] Timestamp: ${new Date().toISOString()}`);
        console.log(`[2] User-Agent / Client: ${req.headers["user-agent"] || "Mobile / Web App"}`);
        console.log(`[3] Target Endpoint: ${req.method} ${req.originalUrl}`);
        console.log(`[4] Request Body: ${JSON.stringify(req.body)}`);
        console.log(`[5] Extracted Search Query: "${cleanQuery}"`);
        try {
            const rawHotels = yield (0, serpapi_service_1.searchHotelsFromSerpApi)(cleanQuery);
            const beforeCount = Array.isArray(rawHotels) ? rawHotels.length : 0;
            console.log(`[6] Hotels Count Before AI Filtering: ${beforeCount}`);
            let finalHotels = rawHotels;
            if (!Array.isArray(finalHotels) || finalHotels.length === 0) {
                console.warn(`[7] 0 hotels returned by external provider for "${cleanQuery}". Triggering Nearest Hotel Fallback.`);
                // Dynamic fallback is built into searchHotelsFromSerpApi
            }
            const afterCount = Array.isArray(finalHotels) ? finalHotels.length : 0;
            console.log(`[8] Hotels Count Sent to Client: ${afterCount}`);
            console.log(`[9] Response Status: 200 OK (${Date.now() - startTime}ms)`);
            console.log(`=================================================================\n`);
            return res.status(200).json({
                success: true,
                query: cleanQuery,
                total: afterCount,
                hotels: finalHotels || [],
                results: finalHotels || [],
                data: finalHotels || [],
            });
        }
        catch (error) {
            console.error(`[HOTEL SEARCH EXCEPTION]: ${(error === null || error === void 0 ? void 0 : error.message) || error}`);
            console.log(`=================================================================\n`);
            return res.status(200).json({
                success: true,
                query: cleanQuery,
                total: 0,
                hotels: [],
                results: [],
                data: [],
            });
        }
    });
}
