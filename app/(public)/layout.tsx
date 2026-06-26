import React from "react";
import Link from "next/link";
import { getSession } from "@/auth";
import { Button } from "@/components/ui/button";

const PublicLayout: React.FC<{ children: React.ReactNode }> = async ({ children }) => {
  const session = await getSession();

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="border-b bg-background/80 backdrop-blur">
        <nav className="container mx-auto flex items-center justify-between px-4 py-4">
          <Link href="/" className="font-bold tracking-tight text-primary">MotorMarket</Link>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/productos" className="hover:text-primary">Vehículos</Link>
            <Link href="/login" className="hover:text-primary">{session ? "Mi cuenta" : "Ingresar"}</Link>
            <Button asChild size="sm"><Link href="/productos">Buscar carro</Link></Button>
          </div>
        </nav>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t py-6 text-center text-sm text-muted-foreground">Marketplace de carros con publicaciones verificadas, leads y favoritos.</footer>
    </div>
  );
};

export default PublicLayout;
