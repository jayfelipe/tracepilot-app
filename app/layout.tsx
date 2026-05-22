import type { Metadata } from 'next'; // <--- LÍNEA NUEVA
import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import './globals.css'; // Asegúrate de que esta importación sea la correcta para tus estilos globales

// Configura las tres fuentes del sitio
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

// <--- BLOQUE NUEVO PARA EL NOMBRE Y DESCRIPCIÓN
export const metadata: Metadata = {
  title: 'TracePilot AI - Debug AI Agents',
  description: 'TracePilot lets engineering teams replay, fork, inspect and repair autonomous AI workflows in real time. Git-style branching meets runtime observability',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html 
      lang="es" 
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
    >
      <body className="bg-[#030303] text-[#f5f5f5] antialiased">
        {children}
      </body>
    </html>
  );
}
