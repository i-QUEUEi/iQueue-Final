import {
  fetchHistoricalAnalytics,
  fetchModelPerformance,
  fetchPredictiveAnalytics,
} from '@/lib/api';

export interface AnalyticsData {
  performanceMetrics: Array<{
    model: string;
    mae: number;
    maeUnit: string;
    accuracy: string;
    status: string;
    color: string;
  }>;
  comparisonData: Array<{
    model: string;
    mae: string;
    rmse: string;
    r2: string;
  }>;
}

export interface HistoricalAnalyticsData {
  insights: Array<{
    title: string;
    desc: string;
    value: string;
  }>;
  dailyData: Array<{
    day: string;
    avgWait: number;
  }>;
}

export interface PredictiveAnalyticsData {
  morning: {
    waitTime: string;
    confidence: number;
    congestion: string;
    recommendation: string;
    color: string;
  };
  afternoon: {
    waitTime: string;
    confidence: number;
    congestion: string;
    recommendation: string;
    color: string;
  };
  evening: {
    waitTime: string;
    confidence: number;
    congestion: string;
    recommendation: string;
    color: string;
  };
}

export const analyticsService = {
  getModelPerformance: async (): Promise<AnalyticsData> => {
    return fetchModelPerformance();
  },

  getHistoricalAnalytics: async (): Promise<HistoricalAnalyticsData> => {
    const data = await fetchHistoricalAnalytics();
    return {
      insights: data.insights,
      dailyData: data.dailyData,
    };
  },

  getPredictiveAnalytics: async (): Promise<PredictiveAnalyticsData> => {
    const data = await fetchPredictiveAnalytics();
    return {
      morning: data.predictions.morning,
      afternoon: data.predictions.afternoon,
      evening: data.predictions.evening,
    };
  }
};

export const mockDataService = {
  getAnalyticsData: (): AnalyticsData => {
    return {
      performanceMetrics: [
        {
          model: 'LSTM Model',
          mae: 2.4,
          maeUnit: 'min',
          accuracy: '94.2%',
          status: 'Excellent',
          color: 'from-blue-500 to-blue-600'
        }
      ],
      comparisonData: [
        { model: 'LSTM', mae: '2.4', rmse: '3.2', r2: '0.94' }
      ]
    };
  },

  getHistoricalAnalyticsData: (): HistoricalAnalyticsData => {
    return {
      insights: [
        { title: 'Peak Days', desc: 'Fridays see higher traffic', value: '1,450 avg' }
      ],
      dailyData: [
        { day: 'Mon', avgWait: 15 }
      ]
    };
  },

  getPredictiveAnalyticsData: (): PredictiveAnalyticsData => {
    return {
      morning: {
        waitTime: '12-18',
        confidence: 89,
        congestion: 'Low',
        recommendation: 'Best time to visit',
        color: 'from-green-400 to-green-500'
      },
      afternoon: {
        waitTime: '22-31',
        confidence: 92,
        congestion: 'High',
        recommendation: 'Expect longer wait',
        color: 'from-red-400 to-red-500'
      },
      evening: {
        waitTime: '18-24',
        confidence: 85,
        congestion: 'Medium',
        recommendation: 'Moderate wait times',
        color: 'from-yellow-400 to-yellow-500'
      }
    };
  }
};
