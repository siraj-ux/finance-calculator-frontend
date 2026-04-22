"use client";

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { CalculatorChart } from "@/components/CalculatorChart";

export default function CagrCalculator() {
  const [initialValue, setInitialValue] = useState(10000);
  const [finalValue, setFinalValue] = useState(25000);
  const [years, setYears] = useState(5);
  
  const [result, setResult] = useState<{cagr: number} | null>(null);
  const [loading, setLoading] = useState(false);

  const calculate = async () => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${apiUrl}/api/calculators/cagr`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initialValue, finalValue, years })
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

  const chartData = [
    { name: 'Initial Value', value: initialValue },
    { name: 'Growth', value: finalValue > initialValue ? finalValue - initialValue : 0 }
  ];

  return (
    <div className="container mx-auto px-4 py-8 md:px-8 max-w-5xl">
      <h1 className="text-3xl font-bold mb-8">CAGR Calculator</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Investment Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Input 
              label="Initial Investment Value (₹)" 
              type="number" 
              value={initialValue} 
              onChange={e => setInitialValue(Number(e.target.value))} 
            />
            <Input 
              label="Final Investment Value (₹)" 
              type="number" 
              value={finalValue} 
              onChange={e => setFinalValue(Number(e.target.value))} 
            />
            <Input 
              label="Duration (Years)" 
              type="number" 
              value={years} 
              onChange={e => setYears(Number(e.target.value))} 
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
                <div className="flex justify-center items-center py-8">
                  <div className="text-center">
                    <span className="block text-muted-foreground mb-2">Compound Annual Growth Rate</span>
                    <span className="font-bold text-5xl text-brand-500">{result.cagr}%</span>
                  </div>
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
