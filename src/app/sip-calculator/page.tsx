"use client";

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { CalculatorChart } from "@/components/CalculatorChart";

export default function SipCalculator() {
  const [monthlyInvestment, setMonthlyInvestment] = useState(5000);
  const [annualReturnRate, setAnnualReturnRate] = useState(12);
  const [timePeriodYears, setTimePeriodYears] = useState(10);
  
  const [result, setResult] = useState<{totalInvested: number, estimatedReturns: number, futureValue: number} | null>(null);
  const [loading, setLoading] = useState(false);

  const calculate = async () => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${apiUrl}/api/calculators/sip`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ monthlyInvestment, annualReturnRate, timePeriodYears })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResult(data);
    } catch (err) {
      console.error(err);
      alert('Failed to calculate. Ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const chartData = result ? [
    { name: 'Total Invested', value: result.totalInvested },
    { name: 'Estimated Returns', value: result.estimatedReturns }
  ] : [];

  return (
    <div className="container mx-auto px-4 py-8 md:px-8 max-w-5xl">
      <h1 className="text-3xl font-bold mb-8">SIP Calculator</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
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
              label="Expected Return Rate (p.a %)" 
              type="number" 
              value={annualReturnRate} 
              onChange={e => setAnnualReturnRate(Number(e.target.value))} 
            />
            <Input 
              label="Time Period (Years)" 
              type="number" 
              value={timePeriodYears} 
              onChange={e => setTimePeriodYears(Number(e.target.value))} 
            />
            <Button className="w-full" onClick={calculate} disabled={loading}>
              {loading ? 'Calculating...' : 'Calculate'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Result</CardTitle>
          </CardHeader>
          <CardContent>
            {result ? (
              <div className="animate-in fade-in duration-500">
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-border">
                  <span className="text-muted-foreground">Invested Amount</span>
                  <span className="font-semibold text-lg">₹ {result.totalInvested.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-border">
                  <span className="text-muted-foreground">Estimated Returns</span>
                  <span className="font-semibold text-lg text-brand-500">₹ {result.estimatedReturns.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-border">
                  <span className="text-muted-foreground font-medium">Total Value</span>
                  <span className="font-bold text-2xl">₹ {result.futureValue.toLocaleString('en-IN')}</span>
                </div>
                <CalculatorChart data={chartData} />
              </div>
            ) : (
              <div className="h-full flex items-center justify-center min-h-[300px] text-muted-foreground text-sm">
                Enter details and calculate to see results.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
