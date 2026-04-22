import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { Calculator } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center px-4 md:px-8">
        <Link href="/" className="flex items-center space-x-2">
          <Calculator className="h-6 w-6 text-brand-500" />
          <span className="font-bold text-xl tracking-tight hidden sm:inline-block">
            FinCalc
          </span>
        </Link>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-4 text-sm font-medium">
            <Link href="/sip-calculator" className="transition-colors hover:text-brand-500">SIP</Link>
            <Link href="/lumpsum-calculator" className="transition-colors hover:text-brand-500">Lumpsum</Link>
            <div className="hidden sm:flex space-x-4">
              <Link href="/cagr-calculator" className="transition-colors hover:text-brand-500">CAGR</Link>
              <Link href="/mutual-fund-calculator" className="transition-colors hover:text-brand-500">Mutual Fund</Link>
              <Link href="/stock-return-calculator" className="transition-colors hover:text-brand-500">Stocks</Link>
              <Link href="/dividend-calculator" className="transition-colors hover:text-brand-500">Dividend</Link>
            </div>
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
