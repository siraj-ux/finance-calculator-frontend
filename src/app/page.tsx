import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { PiggyBank, Briefcase, TrendingUp, Landmark, LineChart, HandCoins } from "lucide-react";

export default function Home() {
  const tools = [
    { name: "SIP Calculator", href: "/sip-calculator", icon: PiggyBank, desc: "Calculate your Systematic Investment Plan returns over time." },
    { name: "Lumpsum Calculator", href: "/lumpsum-calculator", icon: Briefcase, desc: "Find the future value of your one-time investments." },
    { name: "CAGR Calculator", href: "/cagr-calculator", icon: TrendingUp, desc: "Determine the Compound Annual Growth Rate of your investments." },
    { name: "Mutual Fund", href: "/mutual-fund-calculator", icon: Landmark, desc: "Combine SIP and lumpsum to estimate mutual fund growth." },
    { name: "Stock Return", href: "/stock-return-calculator", icon: LineChart, desc: "Evaluate your profit or loss on stock trades." },
    { name: "Dividend", href: "/dividend-calculator", icon: HandCoins, desc: "Calculate total dividend earnings from your stock holdings." },
  ];

  return (
    <div className="container mx-auto px-4 py-12 md:px-8 max-w-5xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
          Premium Financial Tools
        </h1>
        <p className="text-lg text-muted-foreground w-full md:w-2/3 mx-auto">
          Take control of your investments. Calculate SIPs, Lumpsums, and Growth Rates with accuracy and beautiful visualization.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Link key={tool.name} href={tool.href} className="group">
              <Card className="h-full transition-all hover:border-brand-500 hover:shadow-md cursor-pointer">
                <CardHeader>
                  <Icon className="w-8 h-8 text-brand-500 mb-2 transition-transform group-hover:scale-110" />
                  <CardTitle>{tool.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{tool.desc}</p>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  );
}
