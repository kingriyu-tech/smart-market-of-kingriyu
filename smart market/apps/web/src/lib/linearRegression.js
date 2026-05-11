/**
 * Linear Regression Utility for Price Prediction
 * Calculates trend line and predicts future prices
 */

/**
 * Calculate mean (average) of an array of numbers
 */
function calculateMean(values) {
  if (values.length === 0) return 0;
  const sum = values.reduce((acc, val) => acc + val, 0);
  return sum / values.length;
}

/**
 * Calculate variance of an array of numbers
 */
function calculateVariance(values, mean) {
  if (values.length === 0) return 0;
  const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
  return squaredDiffs.reduce((acc, val) => acc + val, 0) / values.length;
}

/**
 * Calculate covariance between two arrays
 */
function calculateCovariance(xValues, yValues, xMean, yMean) {
  if (xValues.length !== yValues.length || xValues.length === 0) return 0;
  
  let covariance = 0;
  for (let i = 0; i < xValues.length; i++) {
    covariance += (xValues[i] - xMean) * (yValues[i] - yMean);
  }
  
  return covariance / xValues.length;
}

/**
 * Perform linear regression and predict future prices
 * @param {Array} priceData - Array of {date: string, price: number} objects
 * @param {number} daysToPredict - Number of days to predict (default: 7)
 * @returns {Object} - {predictions: Array, slope: number, intercept: number, confidence: number}
 */
export function linearRegression(priceData, daysToPredict = 7) {
  // Need at least 2 data points for linear regression
  if (!priceData || priceData.length < 2) {
    return {
      predictions: [],
      slope: 0,
      intercept: 0,
      confidence: 0,
      error: 'Insufficient data for prediction (minimum 2 data points required)'
    };
  }

  // Sort data by date
  const sortedData = [...priceData].sort((a, b) => new Date(a.date) - new Date(b.date));

  // Convert dates to numeric values (days since first date)
  const firstDate = new Date(sortedData[0].date);
  const xValues = sortedData.map(item => {
    const date = new Date(item.date);
    return Math.floor((date - firstDate) / (1000 * 60 * 60 * 24));
  });
  const yValues = sortedData.map(item => item.price);

  // Calculate means
  const xMean = calculateMean(xValues);
  const yMean = calculateMean(yValues);

  // Calculate slope (m) and intercept (b) for y = mx + b
  const covariance = calculateCovariance(xValues, yValues, xMean, yMean);
  const xVariance = calculateVariance(xValues, xMean);
  
  const slope = xVariance !== 0 ? covariance / xVariance : 0;
  const intercept = yMean - (slope * xMean);

  // Calculate R-squared (coefficient of determination) for confidence
  const predictions = xValues.map(x => slope * x + intercept);
  const totalSumSquares = yValues.reduce((sum, y) => sum + Math.pow(y - yMean, 2), 0);
  const residualSumSquares = yValues.reduce((sum, y, i) => sum + Math.pow(y - predictions[i], 2), 0);
  const rSquared = totalSumSquares !== 0 ? 1 - (residualSumSquares / totalSumSquares) : 0;
  const confidence = Math.max(0, Math.min(100, rSquared * 100)); // Convert to percentage, clamp 0-100

  // Generate predictions for next N days
  const lastDate = new Date(sortedData[sortedData.length - 1].date);
  const futurePredictions = [];

  for (let i = 1; i <= daysToPredict; i++) {
    const futureDate = new Date(lastDate);
    futureDate.setDate(futureDate.getDate() + i);
    
    const daysSinceFirst = Math.floor((futureDate - firstDate) / (1000 * 60 * 60 * 24));
    const predictedPrice = slope * daysSinceFirst + intercept;

    futurePredictions.push({
      date: futureDate.toISOString().split('T')[0],
      price: Math.max(0, predictedPrice), // Ensure non-negative prices
      isPrediction: true
    });
  }

  return {
    predictions: futurePredictions,
    slope,
    intercept,
    confidence: Math.round(confidence * 10) / 10, // Round to 1 decimal place
    historicalFit: predictions.map((price, i) => ({
      date: sortedData[i].date,
      price: Math.max(0, price),
      actual: yValues[i]
    }))
  };
}

/**
 * Get prediction summary statistics
 */
export function getPredictionStats(priceData, predictions) {
  if (!priceData || priceData.length === 0) {
    return {
      currentPrice: 0,
      averagePrice: 0,
      predictedChange: 0,
      trend: 'stable'
    };
  }

  const sortedData = [...priceData].sort((a, b) => new Date(b.date) - new Date(a.date));
  const currentPrice = sortedData[0]?.price || 0;
  const averagePrice = calculateMean(priceData.map(d => d.price));
  
  const predictedPrice = predictions.length > 0 ? predictions[predictions.length - 1].price : currentPrice;
  const predictedChange = ((predictedPrice - currentPrice) / currentPrice) * 100;
  
  let trend = 'stable';
  if (predictedChange > 2) trend = 'increasing';
  else if (predictedChange < -2) trend = 'decreasing';

  return {
    currentPrice: Math.round(currentPrice * 100) / 100,
    averagePrice: Math.round(averagePrice * 100) / 100,
    predictedChange: Math.round(predictedChange * 10) / 10,
    trend
  };
}