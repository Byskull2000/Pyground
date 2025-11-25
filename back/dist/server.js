"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/server.ts
require("module-alias/register");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("passport"));
const cors_1 = __importDefault(require("cors"));
//import authRoutes from './routes/auth';
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const api_routes_1 = __importDefault(require("./routes/api.routes"));
const protected_1 = __importDefault(require("./routes/protected"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL,
    credentials: true
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Servir archivos estáticos desde el directorio uploads
app.use('/uploads', express_1.default.static('uploads'));
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET || 'default-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000
    }
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
require("./config/passport");
app.use('/api', api_routes_1.default);
app.use('/api/auth', auth_routes_1.default);
app.use('/api/protected', protected_1.default);
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});
app.use((err, req, res, _next) => {
    console.error(err.stack ?? err);
    void _next;
    const message = err.message ?? 'Internal server error';
    res.status(500).json({
        error: 'Something went wrong!',
        message,
    });
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
    console.log(`API: http://localhost:${PORT}/api`);
});
exports.default = app;
