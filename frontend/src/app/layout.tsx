/** @format */

import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

export const metadata: Metadata = {
    title: "App con Autenticación",
    description: "Aplicación con Google OAuth",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="es">
            <body>
                <AuthProvider>{children}</AuthProvider>
            </body>
        </html>
    );
}
