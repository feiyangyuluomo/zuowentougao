import { Header } from "./header";
import { Footer } from "./footer";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-cream-50">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}