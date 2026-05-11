import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

const VegetableDetailChart = ({ data, predictions, timeRange, setTimeRange }) => {
  const timeRangeOptions = [
    { value: 1, label: 'Daily' },
    { value: 7, label: 'Week' },
    { value: 30, label: 'Month' },
    { value: 365, label: 'Year' }
  ];

  const getChartData = () => {
    const historical = data.map(d => ({
      date: format(new Date(d.date), 'MMM dd'),
      actual: d.price,
      predicted: null
    }));

    const predicted = predictions.map(d => ({
      date: format(new Date(d.date), 'MMM dd'),
      actual: null,
      predicted: d.price
    }));

    return [...historical, ...predicted];
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium mb-1">{payload[0].payload.date}</p>
          {payload.map((entry, index) => (
            entry.value && (
              <p key={index} className="text-sm font-medium" style={{ color: entry.color }}>
                {entry.name}: ₱{entry.value.toFixed(2)}
              </p>
            )
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-card/50 backdrop-blur border-border/50 shadow-xl overflow-hidden animate-fade-in">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-8">
        <div>
          <CardTitle className="text-2xl font-bold">Price History & Projection</CardTitle>
          <CardDescription className="text-base mt-1">
            Track historical trends and view AI-powered forecasts
          </CardDescription>
        </div>
        <div className="inline-flex bg-background/50 backdrop-blur-md p-1.5 rounded-xl border border-border/50 shadow-sm">
          {timeRangeOptions.map((option) => (
            <Button
              key={option.value}
              variant={timeRange === option.value ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setTimeRange(option.value)}
              className="rounded-lg px-4 font-medium transition-all"
            >
              {option.label}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={getChartData()} margin={{ top: 10, right: 20, bottom: 20, left: 0 }}>
              <CartesianGrid strokeDasharray="4 4" className="stroke-border/60" vertical={false} />
              <XAxis 
                dataKey="date" 
                className="text-sm font-medium" 
                tickMargin={16}
                stroke="hsl(var(--muted-foreground))"
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                className="text-sm font-medium" 
                tickMargin={16}
                stroke="hsl(var(--muted-foreground))"
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => `₱${value}`}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1, strokeDasharray: '4 4' }} />
              <Legend wrapperStyle={{ paddingTop: '24px' }} iconType="circle" />
              <Line
                type="monotone"
                dataKey="actual"
                stroke="hsl(var(--primary))"
                strokeWidth={4}
                dot={{ fill: 'hsl(var(--background))', stroke: 'hsl(var(--primary))', strokeWidth: 2, r: 5 }}
                activeDot={{ r: 8, strokeWidth: 0, fill: 'hsl(var(--primary))' }}
                name="Actual Prices"
              />
              <Line
                type="monotone"
                dataKey="predicted"
                stroke="hsl(24 95% 58%)"
                strokeWidth={3}
                strokeDasharray="6 6"
                dot={{ fill: 'hsl(var(--background))', stroke: 'hsl(24 95% 58%)', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 7, strokeWidth: 0, fill: 'hsl(24 95% 58%)' }}
                name="Predicted Prices"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default VegetableDetailChart;