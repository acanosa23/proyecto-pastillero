import { Quicksand } from "next/font/google";
import "./globals.css";

const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "Pastillas",
  description: "Recordatorio de pastillas de mañana y noche",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={`${quicksand.className} antialiased`}>{children}</body>
    </html>
  );
}
