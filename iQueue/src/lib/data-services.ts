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
    waitTime: number;
    confidence: number;
    congestion: string;
    recommendation: string;
    color: string;
  };
  afternoon: {
    waitTime: number;
    confidence: number;
    congestion: string;
    recommendation: string;
    color: string;
  };
  evening: {
    waitTime: number;
    confidence: number;
    congestion: string;
    recommendation: string;
    color: string;
  };
}

export const analyticsService = {
  getModelPerformance: async (): Promise<AnalyticsData> => {
    return {
      performanceMetrics: [
        {
          model: 'LSTM Model',
          mae: 2.4,
          maeUnit: 'min',
          accuracy: '94.2%',
          status: 'Excellent',
          color: 'from-blue-500 to-blue-600'
        },
        {
          model: 'XGBoost Model',
          mae: 2.1,
          maeUnit: 'min',
          accuracy: '95.8%',
          status: 'Excellent',
          color: 'from-purple-500 to-purple-600'
        },
        {
          model: 'Ensemble Model',
          mae: 1.9,
          maeUnit: 'min',
          accuracy: '96.5%',
          status: 'Outstanding',
          color: 'from-green-500 to-green-600'
        }
      ],
      comparisonData: [
        { model: 'LSTM', mae: '2.4', rmse: '3.2', r2: '0.94' },
        { model: 'XGBoost', mae: '2.1', rmse: '2.8', r2: '0.96' },
        { model: 'Ensemble', mae: '1.9', rmse: '2.5', r2: '0.97' }
      ]
    };
  },

  getHistoricalAnalytics: async (): Promise<HistoricalAnalyticsData> => {
    return {
      insights: [
        { title: 'Peak Days', desc: 'Fridays and Tuesdays see 22% higher traffic', value: '1,450 avg' },
        { title: 'Off-Peak Days', desc: 'Sundays and Mondays see minimal traffic', value: '650 avg' },
        { title: 'Peak Hours', desc: '9-11 AM and 2-3 PM account for 45% of daily traffic', value: 'Two peaks' }
      ],
      dailyData: [
        { day: 'Mon', avgWait: 15 },
        { day: 'Tue', avgWait: 18 },
        { day: 'Wed', avgWait: 16 },
        { day: 'Thu', avgWait: 17 },
        { day: 'Fri', avgWait: 22 },
        { day: 'Sat', avgWait: 12 },
        { day: 'Sun', avgWait: 10 }
      ]
    };
  },

  getPredictiveAnalytics: async (): Promise<PredictiveAnalyticsData> => {
    return {
      morning: {
        waitTime: 12,
        confidence: 89,
        congestion: 'Low',
        recommendation: 'Best time to visit',
        color: 'from-green-400 to-green-500'
      },
      afternoon: {
        waitTime: 22,
        confidence: 92,
        congestion: 'High',
        recommendation: 'Expect longer wait',
        color: 'from-red-400 to-red-500'
      },
      evening: {
        waitTime: 18,
        confidence: 85,
        congestion: 'Medium',
        recommendation: 'Moderate wait times',
        color: 'from-yellow-400 to-yellow-500'
      }
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
        waitTime: 12,
        confidence: 89,
        congestion: 'Low',
        recommendation: 'Best time to visit',
        color: 'from-green-400 to-green-500'
      },
      afternoon: {
        waitTime: 22,
        confidence: 92,
        congestion: 'High',
        recommendation: 'Expect longer wait',
        color: 'from-red-400 to-red-500'
      },
      evening: {
        waitTime: 18,
        confidence: 85,
        congestion: 'Medium',
        recommendation: 'Moderate wait times',
        color: 'from-yellow-400 to-yellow-500'
      }
    };
  }
};
