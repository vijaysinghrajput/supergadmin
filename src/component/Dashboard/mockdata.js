// Mock data for demonstration - replace with actual API data
  const mockData = {
    kpis: {
      totalRevenue: { current: 125000, previous: 110000, change: 13.6 },
      conversionRate: { current: 3.2, previous: 2.8, change: 14.3 },
      websiteTraffic: { current: 45000, previous: 42000, change: 7.1 },
      activeUsers: { current: 8500, previous: 7800, change: 9.0 },
      churnRate: { current: 2.1, previous: 2.5, change: -16.0 },
      nps: { current: 72, previous: 68, change: 5.9 },
    },
    trends: {
      revenue: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        data: [95000, 105000, 115000, 108000, 120000, 125000],
      },
      traffic: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        data: [38000, 40000, 42000, 41000, 43000, 45000],
      },
      users: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        data: [7200, 7500, 7800, 8000, 8200, 8500],
      },
    },
    comparison: {
      revenueByProduct: {
        labels: ['Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Books'],
        data: [45000, 32000, 28000, 15000, 5000],
      },
      channelPerformance: {
        labels: ['Organic', 'Paid Search', 'Social Media', 'Email', 'Direct'],
        data: [18000, 12000, 8000, 4500, 2500],
      },
    },
    composition: {
      trafficSources: {
        labels: ['Organic Search', 'Direct', 'Social Media', 'Paid Ads', 'Email', 'Referral'],
        data: [40, 25, 15, 10, 6, 4],
      },
      customerDemographics: {
        labels: ['18-24', '25-34', '35-44', '45-54', '55+'],
        data: [15, 35, 25, 15, 10],
      },
    },
  };