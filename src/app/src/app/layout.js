import "./globals.css";

export const metadata = {
  title: "Prono Foot",
  description: "Analyse de matchs de football et pronostics",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
