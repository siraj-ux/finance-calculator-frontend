"use client";

import React, { useState, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { CalculatorChart } from "@/components/CalculatorChart";
import { TrendingUp, Wallet, Loader2, Calendar, Clock, ChevronDown, ArrowRight, User, Mail, Phone, Briefcase, ShieldCheck } from "lucide-react";

interface CalculationResult {
  totalInvested: number;
  estimatedReturns: number;
  futureValue: number;
}

export default function SipCalculator() {
  const [monthlyInvestment, setMonthlyInvestment] = useState(100000);
  const [timePeriodYears, setTimePeriodYears] = useState(10);
  const [fdResult, setFdResult] = useState<CalculationResult | null>(null);
  const [stockResult, setStockResult] = useState<CalculationResult | null>(null);
  const [loading, setLoading] = useState(false);

  const nameInputRef = useRef<HTMLInputElement>(null);

  const FD_RATE = 6.5;
  const STOCK_RATE = 12;

  const scrollToRegister = () => {
    const element = document.getElementById('registration-section');
    element?.scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => {
      nameInputRef.current?.focus();
    }, 800);
  };

  const calculateResults = () => {
    setLoading(true);
    
    // SIP Formula: FV = P × ({[1 + r]^n - 1} / r) × (1 + r)
    // P = Monthly investment, r = monthly return rate, n = number of months
    const performMath = (rate: number) => {
      const monthlyRate = rate / 100 / 12;
      const months = timePeriodYears * 12;
      const totalInvested = monthlyInvestment * months;
      const futureValue = monthlyInvestment * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
      const estimatedReturns = futureValue - totalInvested;

      return {
        totalInvested: Math.round(totalInvested),
        estimatedReturns: Math.round(estimatedReturns),
        futureValue: Math.round(futureValue)
      };
    };

    // Simulate a brief loading state for UX
    setTimeout(() => {
      setFdResult(performMath(FD_RATE));
      setStockResult(performMath(STOCK_RATE));
      setLoading(false);
    }, 800);
  };

  const difference = stockResult && fdResult ? stockResult.futureValue - fdResult.futureValue : 0;

  return (
    <div className="w-full">

      {/* --- 1ST SECTION: HEADLINE & SUB-HEADLINE --- */}
      <section className="bg-zinc-950 py-8 px-6 text-center border-b border-white/5">
        <div className="max-w-4xl mx-auto">
          <p className="text-[#C0944A] font-bold tracking-[0.2em] text-[10px] md:text-xs mb-3 uppercase">
            2-Day Masterclass
          </p>
          <h1 className="text-2xl md:text-4xl font-serif text-white leading-snug mb-4 font-medium">
            Build Your Personal <span className="text-[#C0944A]">Financial Roadmap</span>
          </h1>
          <div className="text-zinc-400 text-sm md:text-base font-light">
            <p>A step-by-step masterclass on wealth planning. Learn how to make your savings work smarter.</p>
          </div>
          <p className="text-zinc-600 text-[9px] mt-4 italic opacity-80">
            *Educational content only. Not financial or investment advice.
          </p>
        </div>
      </section>

      {/* --- 2ND SECTION: CALCULATOR --- */}
      <section className="container mx-auto px-4 py-16 md:px-8 max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-4 border-b border-zinc-100 pb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Wealth Comparison</h2>
            <p className="text-muted-foreground">Fixed Deposit vs. Stock Market (SIP)</p>
          </div>
          <div className="bg-brand-50 p-4 rounded-lg border border-brand-200 max-w-md">
            <p className="text-sm font-medium text-brand-800 italic">
              "Don't just save your money, put it to work. Every ₹100 wasted today is a fortune lost tomorrow."
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-1 h-fit shadow-sm">
            <CardHeader><CardTitle>Investment Details</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <Input label="Monthly Investment (₹)" type="number" value={monthlyInvestment} onChange={e => setMonthlyInvestment(Number(e.target.value))} />
              <Input label="Time Period (Years)" type="number" value={timePeriodYears} onChange={e => setTimePeriodYears(Number(e.target.value))} />
              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-sm"><span>Fixed Deposit Rate:</span><span className="font-bold text-red-600">{FD_RATE}%</span></div>
                <div className="flex justify-between text-sm"><span>Stock Market Rate:</span><span className="font-bold text-green-600">{STOCK_RATE}%</span></div>
              </div>
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold" onClick={calculateResults} disabled={loading}>
                {loading ? 'Processing Analysis...' : 'Calculate SIP'}
              </Button>
            </CardContent>
          </Card>

          <div className="lg:col-span-2 space-y-6">
            {loading && !stockResult ? (
              <Card className="h-full min-h-[500px] flex flex-col items-center justify-center space-y-4 border-dashed animate-pulse">
                <Loader2 className="w-12 h-12 text-zinc-300 animate-spin" /><p className="text-lg font-medium text-zinc-500">Crunching Compounding Data...</p>
              </Card>
            ) : stockResult && fdResult ? (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="border-l-4 border-l-red-500 bg-red-50/5">
                    <CardContent className="pt-6 flex flex-col items-center">
                      <div className="w-full text-left mb-4">
                        <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wider">Fixed Deposit (6.5%)</p>
                        <h3 className="text-2xl font-bold mt-1 text-red-600">₹ {fdResult.futureValue.toLocaleString('en-IN')}</h3>
                      </div>
                      <div className="h-48 w-full flex items-center justify-center">
                        <CalculatorChart colors={['#94a3b8', '#dc2626']} data={[{ name: 'Invested', value: fdResult.totalInvested }, { name: 'Returns', value: fdResult.estimatedReturns }]} />
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-l-4 border-l-green-500 bg-green-50/10">
                    <CardContent className="pt-6 flex flex-col items-center">
                      <div className="w-full text-left mb-4">
                        <p className="text-sm text-green-700 font-semibold uppercase tracking-wider">Stock Market (12%)</p>
                        <h3 className="text-2xl font-bold text-green-600 mt-1">₹ {stockResult.futureValue.toLocaleString('en-IN')}</h3>
                      </div>
                      <div className="h-48 w-full flex items-center justify-center">
                        <CalculatorChart colors={['#94a3b8', '#22c55e']} data={[{ name: 'Invested', value: stockResult.totalInvested }, { name: 'Returns', value: stockResult.estimatedReturns }]} />
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <Card className="bg-zinc-900 text-white overflow-hidden shadow-xl">
                  <CardContent className="p-6 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                      <p className="text-zinc-400 text-sm uppercase tracking-wider font-semibold">Opportunity Profit</p>
                      <h2 className="text-3xl md:text-4xl font-black text-green-400 mt-1">+ ₹ {difference.toLocaleString('en-IN')}</h2>
                    </div>
                    <TrendingUp size={48} className="text-green-500 hidden md:block" />
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card className="h-full min-h-[400px] flex items-center justify-center border-dashed">
                <div className="text-center"><TrendingUp className="text-zinc-400 mx-auto mb-4" /><p className="text-muted-foreground font-medium">Enter details and click Calculate to see comparison.</p></div>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* --- 3RD SECTION: REGISTRATION --- */}
      <section id="registration-section" className="py-20 bg-gradient-to-b from-zinc-900 to-black border-t border-zinc-800">
        <div className="container mx-auto px-4 md:px-8 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

            <div className="relative bg-zinc-900 p-8 rounded-[2.5rem] lg:sticky lg:top-8 border border-white/5 shadow-2xl">
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-6">
                <div className="bg-zinc-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 border border-white/10 text-sm font-medium">
                  <Calendar size={16} className="text-green-500" /> 30th Apr & 1st May 2026
                </div>
                <div className="bg-zinc-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 border border-white/10 text-sm font-medium">
                  <Clock size={16} className="text-green-500" /> 8 PM & 10 AM IST
                </div>
              </div>

              <div className="overflow-hidden bg-zinc-800 border border-white/5 shadow-2xl">
                <img src="/img.webp" alt="Webinar Host" className="w-full h-auto object-cover opacity-95" />
              </div>
            </div>

            <Card className="shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/5 bg-zinc-950 overflow-hidden">
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-8 text-white">
                <CardTitle className="text-2xl md:text-3xl font-serif">Register now — <span className="italic font-normal text-white/90">@₹99</span></CardTitle>
                <p className="text-white/80 text-sm mt-1">Limited seats available for this cohort.</p>
              </div>
              <CardContent className="p-8 space-y-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Full Name *</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                    <input ref={nameInputRef} type="text" placeholder="Enter your full name" className="w-full pl-12 pr-4 py-4 bg-zinc-900 border border-zinc-800 text-white outline-none focus:ring-2 focus:ring-green-500/20" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Email Address *</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                    <input type="email" placeholder="Enter your email" className="w-full pl-12 pr-4 py-4 bg-zinc-900 border border-zinc-800 text-white outline-none focus:ring-2 focus:ring-green-500/20" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Phone *</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                      <input type="tel" placeholder="9876543210" className="w-full pl-12 pr-4 py-4 bg-zinc-900 border border-zinc-800 text-white outline-none focus:ring-2 focus:ring-green-500/20" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Profession *</label>
                    <div className="relative">
                      <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                      <select className="w-full pl-12 pr-10 py-4 bg-zinc-900 border border-zinc-800 text-white appearance-none outline-none focus:ring-2 focus:ring-green-500/20 cursor-pointer">
                        <option>Select</option>
                        <option>Business Owner</option>
                        <option>Professional</option>
                        <option>Student</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                    </div>
                  </div>
                </div>
                <div className="pt-4">
                  <Button className="w-full py-8 bg-green-600 hover:bg-green-700 text-white text-xl font-bold transition-all active:scale-[0.98]">
                    Join the Webinar @₹99
                  </Button>
                  <div className="flex items-center justify-center gap-2 mt-4 text-zinc-600">
                    <ShieldCheck size={14} className="text-green-500" />
                    <span className="text-[11px] font-medium uppercase tracking-wider">Secured 256-bit Payment</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* --- 4TH SECTION: FINAL CTA --- */}
      <section className="bg-zinc-950 py-20 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-serif text-white mb-4">
            Join thousands of others taking control of their financial future.
          </h2>
          <p className="text-zinc-400 text-sm md:text-base mb-8 max-w-2xl mx-auto font-light">
            Our expert-led session covers everything from SIPs to advanced portfolio management.
          </p>
          <Button 
            onClick={scrollToRegister}
            className="bg-green-600 hover:bg-green-700 text-white px-10 py-7 text-lg font-bold transition-all flex items-center gap-2 mx-auto"
          >
            Join the Webinar @₹99
            <ArrowRight size={20} />
          </Button>
        </div>
      </section>
    </div>
  );
}