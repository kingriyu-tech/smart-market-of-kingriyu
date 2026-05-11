import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { format } from 'date-fns';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const PredictionTable = ({ predictions, currentPrice }) => {
  if (!predictions || predictions.length === 0) {
    return (
      <div className="text-center py-8 border border-dashed border-border rounded-lg">
        <p className="text-muted-foreground">No predictions available</p>
        <p className="text-sm text-muted-foreground mt-1">Select a vegetable to view predictions</p>
      </div>
    );
  }

  const getTrendIcon = (price) => {
    if (!currentPrice) return <Minus className="h-4 w-4 text-muted-foreground" />;
    const change = ((price - currentPrice) / currentPrice) * 100;
    
    if (change > 1) return <TrendingUp className="h-4 w-4 text-primary" />;
    if (change < -1) return <TrendingDown className="h-4 w-4 text-destructive" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  const getChangePercent = (price) => {
    if (!currentPrice) return '0.0';
    const change = ((price - currentPrice) / currentPrice) * 100;
    return change.toFixed(1);
  };

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Predicted Price</TableHead>
              <TableHead className="text-right">Change</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {predictions.map((pred, index) => (
              <TableRow key={index} className="hover:bg-muted/50 transition-colors">
                <TableCell className="font-medium">
                  {format(new Date(pred.date), 'EEE, MMM dd')}
                </TableCell>
                <TableCell className="font-mono text-primary">
                  ₱{pred.price.toFixed(2)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    {getTrendIcon(pred.price)}
                    <span className="text-sm font-medium">
                      {getChangePercent(pred.price)}%
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default PredictionTable;