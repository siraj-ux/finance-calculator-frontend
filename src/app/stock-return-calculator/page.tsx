"use client";

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { CalculatorChart } from "@/components/CalculatorChart";

export default function StockReturnCalculator() {
  const [buyPrice, setBuyPrice] = useState(100);
  const [sellPrice, setSellPrice] = useState(150);
  const [quantity, setQuantity] = useState(50);
  
  const [result, setResult] = useState<{totalInvestment: number, totalReturn: number, profitLoss: number, profitLossPercentage: number} | null>(null);
  const [loading, setLoading] = useState(false);

  const calculate = async () => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${apiUrl}/api/calculators/stock-return`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ buyPrice, sellPrice, quantity })
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

  const chartData = result && result.profitLoss > 0 ? [
    { name: 'Total Investment', value: result.totalInvestment },
    { name: 'Profit', value: result.profitLoss }
  ] : result && result.profitLoss <= 0 ? [
    { name: 'Remaining Value', value: result.totalReturn },
    { name: 'Loss', value: Math.abs(result.profitLoss) }
  ] : [];

  const chartColors = result && result.profitLoss > 0 ? ['#e2e8f0', '#00b852'] : ['#e2e8f0', '#ef4444'];
  const isLoss = result ? result.profitLoss < 0 : false;

  return (
    <div className="container mx-auto px-4 py-8 md:px-8 max-w-5xl">
      <h1 className="text-3xl font-bold mb-8">Stock Return Calculator</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Trade Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Input 
              label="Buy Price (₹)" 
              type="number" 
              value={buyPrice} 
              onChange={e => setBuyPrice(Number(e.target.value))} 
            />
            <Input 
              label="Sell Price (₹)" 
              type="number" 
              value={sellPrice} 
              onChange={e => setSellPrice(Number(e.target.value))} 
            />
            <Input 
              label="Quantity" 
              type="number" 
              value={quantity} 
              onChange={e => setQuantity(Number(e.target.value))} 
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
                  <span className="text-muted-foreground">Total Investment</span>
                  <span className="font-semibold text-lg">₹ {result.totalInvestment.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-border">
                  <span className="text-muted-foreground">Total Return</span>
                  <span className="font-semibold text-lg">₹ {result.totalReturn.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-border">
                  <span className="text-muted-foreground font-medium">Profit/Loss</span>
                  <div className="text-right">
                    <span className={`font-bold text-2xl block ${isLoss ? 'text-red-500' : 'text-brand-500'}`}>
                      {isLoss ? '-' : ''}₹ {Math.abs(result.profitLoss).toLocaleString('en-IN')}
                    </span>
                    <span className={`text-sm ${isLoss ? 'text-red-500' : 'text-brand-500'}`}>
                      {result.profitLossPercentage}%
                    </span>
                  </div>
                </div>
                <CalculatorChart data={chartData} colors={chartColors} />
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
