import { Playfair_Display } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

export const metadata = {
  title: "Pastillas",
  description: "Recordatorio de pastillas de mañana y noche",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={`${playfair.className} antialiased`}>{children}</body>
    </html>
  );
}
