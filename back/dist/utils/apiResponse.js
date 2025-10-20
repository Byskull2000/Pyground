"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiResponse = void 0;
class ApiResponse {
    constructor(success, data = null, error = null) {
        this.success = success;
        this.data = data;
        this.error = error;
    }
}
exports.ApiResponse = ApiResponse;
