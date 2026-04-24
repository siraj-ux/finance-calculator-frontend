"use client";

import React, { useState, useRef, useEffect } from 'react';
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

  useEffect(() => {
    calculateResults();
  }, []);

  const scrollToRegister = () => {
    const element = document.getElementById('registration-section');
    element?.scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => {
      nameInputRef.current?.focus();
    }, 800);
  };

  const calculateResults = async () => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

      const fetchCalc = (rate: number) =>
        fetch(`${apiUrl}/api/calculators/sip`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ monthlyInvestment, annualReturnRate: rate, timePeriodYears })
        }).then(res => res.json());

      const [fdData, stockData] = await Promise.all([
        fetchCalc(FD_RATE),
        fetchCalc(STOCK_RATE)
      ]);

      setTimeout(() => {
        setFdResult(fdData);
        setStockResult(stockData);
        setLoading(false);
      }, 1500);

    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const difference = stockResult && fdResult ? stockResult.futureValue - fdResult.futureValue : 0;

  return (
    <div className="container mx-auto px-4 py-8 md:px-8 max-w-6xl space-y-12">

      {/* --- SECTION 1: CALCULATOR --- */}
      <section>
        <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Wealth Comparison</h1>
            <p className="text-muted-foreground">Fixed Deposit vs. Stock Market (SIP)</p>
          </div>
          <div className="bg-brand-50 p-4 rounded-lg border border-brand-200">
            <p className="text-sm font-medium text-brand-800 italic">
              "Don't just save your money, put it to work. Every ₹100 wasted today is a fortune lost tomorrow."
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-1 h-fit shadow-sm">
            <CardHeader>
              <CardTitle>Investment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Input
                label="Monthly Investment (₹)"
                type="number"
                value={monthlyInvestment}
                onChange={e => setMonthlyInvestment(Number(e.target.value))}
              />
              <Input
                label="Time Period (Years)"
                type="number"
                value={timePeriodYears}
                onChange={e => setTimePeriodYears(Number(e.target.value))}
              />

              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-sm">
                  <span>Fixed Deposit Rate:</span>
                  <span className="font-bold text-red-600">{FD_RATE}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Stock Market Rate:</span>
                  <span className="font-bold text-green-600">{STOCK_RATE}%</span>
                </div>
              </div>

              {/* UPDATED: Default Green Color */}
              <Button
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold"
                onClick={calculateResults}
                disabled={loading}
              >
                {loading ? 'Processing Analysis...' : 'Compare Performance'}
              </Button>
            </CardContent>
          </Card>

          <div className="lg:col-span-2 space-y-6">
            {loading && !stockResult ? (
              <Card className="h-full min-h-[500px] flex flex-col items-center justify-center space-y-4 border-dashed animate-pulse">
                <Loader2 className="w-12 h-12 text-zinc-300 animate-spin" />
                <div className="text-center">
                  <p className="text-lg font-medium text-zinc-500">Crunching Compounding Data...</p>
                  <p className="text-sm text-zinc-400">Comparing historical market averages</p>
                </div>
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
                        <CalculatorChart
                          colors={['#94a3b8', '#dc2626']}
                          data={[
                            { name: 'Invested', value: fdResult.totalInvested },
                            { name: 'Returns', value: fdResult.estimatedReturns }
                          ]}
                        />
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-4 italic">Invested: ₹{fdResult.totalInvested.toLocaleString('en-IN')}</p>
                    </CardContent>
                  </Card>

                  <Card className="border-l-4 border-l-green-500 bg-green-50/10">
                    <CardContent className="pt-6 flex flex-col items-center">
                      <div className="w-full text-left mb-4">
                        <p className="text-sm text-green-700 font-semibold uppercase tracking-wider">Stock Market (12%)</p>
                        <h3 className="text-2xl font-bold text-green-600 mt-1">₹ {stockResult.futureValue.toLocaleString('en-IN')}</h3>
                      </div>
                      <div className="h-48 w-full flex items-center justify-center">
                        <CalculatorChart
                          colors={['#94a3b8', '#22c55e']}
                          data={[
                            { name: 'Invested', value: stockResult.totalInvested },
                            { name: 'Returns', value: stockResult.estimatedReturns }
                          ]}
                        />
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-4 italic">Invested: ₹{stockResult.totalInvested.toLocaleString('en-IN')}</p>
                    </CardContent>
                  </Card>
                </div>

                <Card className="bg-zinc-900 text-white overflow-hidden shadow-xl">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                      <div>
                        <p className="text-zinc-400 text-sm uppercase tracking-wider font-semibold">Opportunity Profit</p>
                        <h2 className="text-3xl md:text-4xl font-black text-green-400 mt-1">
                          + ₹ {difference.toLocaleString('en-IN')}
                        </h2>
                        <p className="text-zinc-400 text-xs mt-2">Extra wealth generated by choosing Stocks over FD</p>
                      </div>
                      <div className="hidden md:block">
                        <div className="bg-green-500/20 p-4 rounded-full">
                          <TrendingUp size={48} className="text-green-500" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="bg-blue-600 text-white p-6 rounded-xl shadow-lg flex items-center justify-between">
                  <div className="pr-4">
                    <h4 className="text-xl font-bold flex items-center gap-2">
                      <Wallet size={24} /> Stop Wasting, Start Investing
                    </h4>
                    <p className="opacity-90 mt-1 text-sm">Redirect that ₹{monthlyInvestment.toLocaleString('en-IN')} from liabilities to assets today.</p>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {/* --- SECTION 2: STRIP --- */}
      <section className="bg-zinc-900 rounded-3xl p-6 md:px-10 md:py-8 max-w-5xl mx-auto shadow-2xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 text-center md:text-left">
            <h2 className="text-xl md:text-2xl font-bold text-white leading-snug">
              Join thousands of others taking control of their financial future.
            </h2>
            <p className="text-sm md:text-base text-zinc-400 max-w-xl">
              Our expert-led session covers everything from SIPs to advanced portfolio management.
            </p>
          </div>

          <button
            onClick={scrollToRegister}
            className="group whitespace-nowrap flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold text-base transition-all active:scale-95 shadow-lg shadow-blue-900/30"
          >
            Join the Webinar @₹99
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* --- SECTION 3: WEBINAR DETAILS & FORM --- */}
      <section id="registration-section" className="pt-16 border-t border-zinc-100">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

          <div className="relative bg-zinc-900 p-8 rounded-[2.5rem] lg:sticky lg:top-8">
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-6">
              <div className="bg-zinc-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-xl border border-white/10">
                <Calendar size={16} className="text-blue-400" />
                <span className="text-sm font-medium">30th Apr & 1st May 2026</span>
              </div>
              <div className="bg-zinc-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-xl border border-white/10">
                <Clock size={16} className="text-blue-400" />
                <span className="text-sm font-medium">8 PM & 10 AM IST</span>
              </div>
            </div>

            <div className="rounded-3xl overflow-hidden bg-zinc-800 border border-white/5 relative">
              <img src="/img.webp" alt="Webinar Host" className="w-full h-auto object-cover opacity-90" />
            </div>

            <h3 className="mt-8 text-2xl font-serif text-white italic text-center lg:text-left leading-relaxed">
              Learn about investing by attending our exclusive webinar
            </h3>
          </div>

          <Card className="shadow-[0_20px_50px_rgba(0,0,0,0.1)] border-none bg-white overflow-hidden rounded-[2rem]">
            <div className="bg-blue-600 p-8 text-white">
              <CardTitle className="text-2xl md:text-3xl font-serif">
                Register now — <span className="italic font-normal text-white/90">@₹99</span>
              </CardTitle>
              <p className="text-white/80 text-sm mt-1">Limited seats available for this cohort.</p>
            </div>

            <CardContent className="p-8 space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Full Name *</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                  <input
                    ref={nameInputRef}
                    type="text"
                    placeholder="Enter your full name"
                    className="w-full pl-12 pr-4 py-4 rounded-xl bg-zinc-50 border border-zinc-200 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Email Address *</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full pl-12 pr-4 py-4 rounded-xl bg-zinc-50 border border-zinc-200 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Phone Number *</label>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                    <input
                      type="tel"
                      placeholder="9876543210"
                      className="w-full pl-12 pr-4 py-4 rounded-xl bg-zinc-50 border border-zinc-200 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Profession *</label>
                  <div className="relative group">
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                    <select className="w-full pl-12 pr-10 py-4 rounded-xl bg-zinc-50 border border-zinc-200 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer">
                      <option>Select</option>
                      <option>Business Owner</option>
                      <option>Working Professional</option>
                      <option>Student</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Button className="w-full py-8 bg-zinc-900 hover:bg-black text-white text-xl font-bold rounded-2xl shadow-xl transition-all active:scale-[0.98]">
                  Join the Webinar @₹99
                </Button>
                <div className="flex items-center justify-center gap-2 mt-4 text-zinc-400">
                  <ShieldCheck size={14} className="text-green-600" />
                  <span className="text-[11px] font-medium uppercase tracking-wider">Secured 256-bit Payment</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}