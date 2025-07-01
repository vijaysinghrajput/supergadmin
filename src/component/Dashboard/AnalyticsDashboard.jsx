import React, { useState, useEffect, useContext } from "react";
import { Chart, Line, Bar, Pie, Doughnut } from "react-chartjs-2";
import Data from "../../context/MainContext";
import Cookies from "universal-cookie";
import { useQuery } from "react-query";
import URLDomain from "../../URL";
import {
  Chart as ChartJS,
  ArcElement,
  LineElement,
  BarElement,
  PointElement,
  BarController,
  BubbleController,
  DoughnutController,
  LineController,
  PieController,
  PolarAreaController,
  RadarController,
  ScatterController,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  RadialLinearScale,
  TimeScale,
  TimeSeriesScale,
  Decimation,
  Filler,
  Legend,
  Title,
  Tooltip,
} from "chart.js";
import { queries } from "@testing-library/react";

const cookies = new Cookies();
const adminStoreId = cookies.get("adminStoreId");

ChartJS.register(
  ArcElement,
  LineElement,
  BarElement,
  PointElement,
  BarController,
  BubbleController,
  DoughnutController,
  LineController,
  PieController,
  PolarAreaController,
  RadarController,
  ScatterController,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  RadialLinearScale,
  TimeScale,
  TimeSeriesScale,
  Decimation,
  Filler,
  Legend,
  Title,
  Tooltip
);

function getFormattedDate(date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
}

const currentDate = new Date();
const endDate = new Date();
currentDate.setDate(currentDate.getDate() - 60);

// Fetch analytics data
async function fetchAnalyticsData({ start_date, end_date }) {
  try {
    console.log("Fetching analytics data for store ID:", adminStoreId);
    console.log("Date range:", { start_date, end_date });

    const response = await fetch(
      URLDomain + "/APP-API/Billing/DashboardReports",
      {
        method: "post",
        headers: {
          Accept: "application/json",
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          store_id: adminStoreId,
          start_date,
          end_date,
        }),
      }
    );

    // Check if response is ok
    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Response Error:", {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
        errorText: errorText,
      });
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    // Check if response is JSON
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      console.error("Invalid content type:", contentType);
      throw new Error("Server returned non-JSON response");
    }

    const data = await response.json();
    console.log("Analytics data fetched successfully:", data);

    // Validate data structure
    if (!data || typeof data !== "object") {
      console.error("Invalid data structure received:", data);
      throw new Error("Invalid data structure received from server");
    }

    return data;
  } catch (error) {
    console.error("Error fetching analytics data:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
      storeId: adminStoreId,
      url: URLDomain + "/APP-API/Billing/DashboardReports",
    });

    // Re-throw the error so react-query can handle it
    throw error;
  }
}

const AnalyticsDashboard = () => {
  const { auth, user } = useContext(Data);
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [kpiComparison, setKpiComparison] = useState("previous");
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)),
    endDate: new Date()
  });
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);

  const {
    data: ANALYTICS_DATA,
    isError,
    error,
    isLoading: isLoadingAPI,
  } = useQuery({
    queryKey: ["ANALYTICS_DATA", getFormattedDate(dateRange.startDate), getFormattedDate(dateRange.endDate)],
    queryFn: (e) => fetchAnalyticsData({ 
      start_date: e.queryKey[1],
      end_date: e.queryKey[2]
    }),
    retry: 3, // Retry failed requests 3 times
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
    onError: (error) => {
      console.error("React Query Error:", {
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
        storeId: adminStoreId,
      });
    },
    onSuccess: (data) => {
      console.log(
        "Analytics data loaded successfully at:",
        new Date().toISOString()
      );
    },
  });

  // Process API data or use fallback mock data
  const processAnalyticsData = (apiData) => {
    // If API data is available and valid, use it; otherwise use mock data
    if (apiData && typeof apiData === "object") {
      console.log("Using API data for analytics dashboard");
      console.log("Raw API Data Structure:", apiData);
      console.log("API Data Keys:", Object.keys(apiData));

      // Enhanced debugging for trends data
      console.log("API Trends Data:", {
        trends: apiData.trends,
        revenue_labels: apiData.revenue_labels,
        revenue_data: apiData.revenue_data,
        traffic_labels: apiData.traffic_labels,
        traffic_data: apiData.traffic_data,
        users_labels: apiData.users_labels,
        users_data: apiData.users_data,
      });

      // Helper function to safely extract array data
      const safeExtractArray = (data, fallback) => {
        if (Array.isArray(data) && data.length > 0) {
          return data;
        }
        return fallback;
      };

      // Helper function to generate default labels based on data length
      const generateLabels = (dataArray, defaultLabels) => {
        if (Array.isArray(dataArray) && dataArray.length > 0) {
          return dataArray.map((_, index) => `Period ${index + 1}`);
        }
        return defaultLabels;
      };

      // Extract trends data with multiple fallback strategies
      let trendsData = {
        revenue: {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
          data: [95000, 105000, 115000, 108000, 120000, 125000],
        },
        traffic: {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
          data: [38000, 40000, 42000, 41000, 43000, 45000],
        },
        users: {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
          data: [7200, 7500, 7800, 8000, 8200, 8500],
        },
      };

      // Strategy 1: Check if trends object exists in API response
      if (apiData.trends && typeof apiData.trends === "object") {
        console.log("Found trends object in API response");

        // Extract shared labels from trends object
        const sharedLabels = safeExtractArray(
          apiData.trends.labels,
          trendsData.revenue.labels
        );

        // Map revenue data
        if (apiData.trends.revenue) {
          trendsData.revenue = {
            labels: sharedLabels,
            data: safeExtractArray(
              apiData.trends.revenue,
              trendsData.revenue.data
            ),
          };
        }

        // Map traffic data (using orders as traffic proxy)
        if (apiData.trends.orders) {
          trendsData.traffic = {
            labels: sharedLabels,
            data: safeExtractArray(
              apiData.trends.orders,
              trendsData.traffic.data
            ),
          };
        }

        // Map users data (using customers as users proxy)
        if (apiData.trends.customers) {
          trendsData.users = {
            labels: sharedLabels,
            data: safeExtractArray(
              apiData.trends.customers,
              trendsData.users.data
            ),
          };
        }

        console.log("Mapped trends data from API:", {
          revenue: trendsData.revenue,
          traffic: trendsData.traffic,
          users: trendsData.users,
        });
      } else {
        // Strategy 2: Check for individual trend properties
        console.log("No trends object found, checking individual properties");

        // Check for root-level arrays (revenue, orders, customers, labels)
        const rootLabels = safeExtractArray(apiData.labels, null);

        // Revenue trends - check both old format and new format
        if (apiData.revenue || apiData.revenue_data || apiData.revenue_labels) {
          const revenueData = safeExtractArray(
            apiData.revenue || apiData.revenue_data,
            trendsData.revenue.data
          );
          trendsData.revenue = {
            labels: safeExtractArray(
              rootLabels || apiData.revenue_labels,
              generateLabels(revenueData, trendsData.revenue.labels)
            ),
            data: revenueData,
          };
        }

        // Traffic trends - check orders array and old format
        if (apiData.orders || apiData.traffic_data || apiData.traffic_labels) {
          const trafficData = safeExtractArray(
            apiData.orders || apiData.traffic_data,
            trendsData.traffic.data
          );
          trendsData.traffic = {
            labels: safeExtractArray(
              rootLabels || apiData.traffic_labels,
              generateLabels(trafficData, trendsData.traffic.labels)
            ),
            data: trafficData,
          };
        }

        // Users trends - check customers array and old format
        if (apiData.customers || apiData.users_data || apiData.users_labels) {
          const usersData = safeExtractArray(
            apiData.customers || apiData.users_data,
            trendsData.users.data
          );
          trendsData.users = {
            labels: safeExtractArray(
              rootLabels || apiData.users_labels,
              generateLabels(usersData, trendsData.users.labels)
            ),
            data: usersData,
          };
        }

        console.log("Mapped individual properties:", {
          rootLabels,
          revenue: trendsData.revenue,
          traffic: trendsData.traffic,
          users: trendsData.users,
        });
      }

      console.log("Final processed trends data:", trendsData);

      return {
        kpis: apiData.kpis || {
          totalRevenue: {
            current: apiData.total_revenue || 0,
            previous: apiData.previous_revenue || 0,
            change: apiData.revenue_change || 0,
          },
          conversionRate: {
            current: apiData.conversion_rate || 0,
            previous: apiData.previous_conversion || 0,
            change: apiData.conversion_change || 0,
          },
          websiteTraffic: {
            current: apiData.website_traffic || 0,
            previous: apiData.previous_traffic || 0,
            change: apiData.traffic_change || 0,
          },
          leads: {
            current: apiData.leads || 0,
            previous: apiData.previous_leads || 0,
            change: apiData.leads_change || 0,
          },
          cpa: {
            current: apiData.cpa || 0,
            previous: apiData.previous_cpa || 0,
            change: apiData.cpa_change || 0,
          },
          activeUsers: {
            current: apiData.active_users || 0,
            previous: apiData.previous_users || 0,
            change: apiData.users_change || 0,
          },
          churnRate: {
            current: apiData.churn_rate || 0,
            previous: apiData.previous_churn || 0,
            change: apiData.churn_change || 0,
          },
          nps: {
            current: apiData.nps_score || 0,
            previous: apiData.previous_nps || 0,
            change: apiData.nps_change || 0,
          },
        },
        trends: trendsData,
        comparison: {
          revenueByProduct: {
            labels: apiData.comparisons?.revenueByCategory?.map(item => item.category_name) || [
              "Product 1",
              "Product 2",
              "Product 3",
            ],
            data: apiData.comparisons?.revenueByCategory?.map(item => parseFloat(item.revenue)) || [0, 0, 0],
          },
          channelPerformance: {
            labels: apiData.comparisons?.channelPerformance?.map(item => item.channel_name) || [
              "Channel 1",
              "Channel 2",
              "Channel 3",
            ],
            data: apiData.comparisons?.channelPerformance?.map(item => parseFloat(item.performance)) || [0, 0, 0],
          },
        },
        composition: {
          trafficSources: {
            labels: apiData.composition?.trafficSources?.map(item => item.source_name) || [
              "Direct",
              "Organic",
              "Social",
            ],
            data: apiData.composition?.trafficSources?.map(item => parseFloat(item.percentage)) || [0, 0, 0],
          },
          customerDemographics: {
            labels: apiData.composition?.demographics?.map(item => item.age_group) || ["18-24", "25-34", "35+"],
            data: apiData.composition?.demographics?.map(item => parseFloat(item.percentage)) || [0, 0, 0],
          },
        },
        recentActivities: apiData.recent_activities || {
          recentSales: [],
        },
      };
    }

    // Fallback mock data when API data is not available
    console.log("Using fallback mock data for analytics dashboard");
    return {
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
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
          data: [95000, 105000, 115000, 108000, 120000, 125000],
        },
        traffic: {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
          data: [38000, 40000, 42000, 41000, 43000, 45000],
        },
        users: {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
          data: [7200, 7500, 7800, 8000, 8200, 8500],
        },
      },
      comparison: {
        revenueByProduct: {
          labels: [
            "Electronics",
            "Clothing",
            "Home & Garden",
            "Sports",
            "Books",
          ],
          data: [45000, 32000, 28000, 15000, 5000],
        },
        channelPerformance: {
          labels: ["Organic", "Paid Search", "Social Media", "Email", "Direct"],
          data: [18000, 12000, 8000, 4500, 2500],
        },
      },
      composition: {
        trafficSources: {
          labels: [
            "Organic Search",
            "Direct",
            "Social Media",
            "Paid Ads",
            "Email",
            "Referral",
          ],
          data: [40, 25, 15, 10, 6, 4],
        },
        customerDemographics: {
          labels: ["18-24", "25-34", "35-44", "45-54", "55+"],
          data: [15, 35, 25, 15, 10],
        },
      },
    };
  };

  // Use processed data (API or fallback)
  const analyticsData = processAnalyticsData(ANALYTICS_DATA);

  // Date range helper functions
  const setDateRangePreset = (preset) => {
    const today = new Date();
    const endDate = new Date(); // Today
    let startDate;

    switch (preset) {
      case 'week':
        startDate = new Date();
        startDate.setDate(today.getDate() - 7);
        break;
      case 'month':
        startDate = new Date();
        startDate.setMonth(today.getMonth() - 1);
        break;
      case 'quarter':
        startDate = new Date();
        startDate.setMonth(today.getMonth() - 3);
        break;
      case 'year':
        startDate = new Date();
        startDate.setFullYear(today.getFullYear() - 1);
        break;
      case 'ytd': // Year to date
        startDate = new Date(today.getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date();
        startDate.setDate(today.getDate() - 30);
    }

    setDateRange({ startDate, endDate });
    setSelectedPeriod(preset);
    setShowCustomDatePicker(false);
  };

  const handleCustomDateChange = (field, value) => {
    setDateRange(prev => ({
      ...prev,
      [field]: new Date(value)
    }));
  };

  const applyCustomDateRange = () => {
    setSelectedPeriod('custom');
    setShowCustomDatePicker(false);
  };

  // Date Picker Component
  const DateRangePicker = () => {
    return (
      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <div className="d-flex flex-wrap align-items-center justify-content-between">
                <h5 className="card-title mb-0">Date Range Selection</h5>
                <div className="d-flex flex-wrap gap-2">
                  {/* Preset Buttons */}
                  <button
                    className={`btn btn-sm ${
                      selectedPeriod === 'week' ? 'btn-primary' : 'btn-outline-primary'
                    }`}
                    onClick={() => setDateRangePreset('week')}
                  >
                    Last Week
                  </button>
                  <button
                    className={`btn btn-sm ${
                      selectedPeriod === 'month' ? 'btn-primary' : 'btn-outline-primary'
                    }`}
                    onClick={() => setDateRangePreset('month')}
                  >
                    Last Month
                  </button>
                  <button
                    className={`btn btn-sm ${
                      selectedPeriod === 'quarter' ? 'btn-primary' : 'btn-outline-primary'
                    }`}
                    onClick={() => setDateRangePreset('quarter')}
                  >
                    Last Quarter
                  </button>
                  <button
                    className={`btn btn-sm ${
                      selectedPeriod === 'year' ? 'btn-primary' : 'btn-outline-primary'
                    }`}
                    onClick={() => setDateRangePreset('year')}
                  >
                    Last Year
                  </button>
                  <button
                    className={`btn btn-sm ${
                      selectedPeriod === 'ytd' ? 'btn-primary' : 'btn-outline-primary'
                    }`}
                    onClick={() => setDateRangePreset('ytd')}
                  >
                    Year to Date
                  </button>
                  <button
                    className={`btn btn-sm ${
                      selectedPeriod === 'custom' ? 'btn-success' : 'btn-outline-success'
                    }`}
                    onClick={() => setShowCustomDatePicker(!showCustomDatePicker)}
                  >
                    Custom Range
                  </button>
                </div>
              </div>

              {/* Custom Date Picker */}
              {showCustomDatePicker && (
                <div className="mt-3 p-3 border rounded bg-light">
                  <div className="row">
                    <div className="col-md-4">
                      <label className="form-label">Start Date</label>
                      <input
                        type="date"
                        className="form-control"
                        value={dateRange.startDate.toISOString().split('T')[0]}
                        onChange={(e) => handleCustomDateChange('startDate', e.target.value)}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">End Date</label>
                      <input
                        type="date"
                        className="form-control"
                        value={dateRange.endDate.toISOString().split('T')[0]}
                        onChange={(e) => handleCustomDateChange('endDate', e.target.value)}
                      />
                    </div>
                    <div className="col-md-4 d-flex align-items-end">
                      <button
                        className="btn btn-success me-2"
                        onClick={applyCustomDateRange}
                      >
                        Apply
                      </button>
                      <button
                        className="btn btn-secondary"
                        onClick={() => setShowCustomDatePicker(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Current Date Range Display */}
              <div className="mt-3">
                <small className="text-muted">
                  Current Range: {dateRange.startDate.toLocaleDateString()} - {dateRange.endDate.toLocaleDateString()}
                  {selectedPeriod !== 'custom' && ` (${selectedPeriod})`}
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Debug processed analytics data structure
  console.log("Processed Analytics Data:", analyticsData);
  console.log("Trends Data for Charts:", {
    revenue: analyticsData.trends?.revenue,
    traffic: analyticsData.trends?.traffic,
    users: analyticsData.trends?.users,
  });

  // Chart configurations
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: false,
      },
    },
  };

  const lineChartOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0,0,0,0.1)",
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  const barChartOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0,0,0,0.1)",
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
      },
    },
  };

  // Validate and ensure chart data is always available
  const validateChartData = (data, fallbackData) => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      console.warn("Invalid chart data detected, using fallback:", data);
      return fallbackData;
    }
    return data;
  };

  const validateLabels = (labels, fallbackLabels) => {
    if (!labels || !Array.isArray(labels) || labels.length === 0) {
      console.warn("Invalid chart labels detected, using fallback:", labels);
      return fallbackLabels;
    }
    return labels;
  };

  // Chart data configurations using processed analytics data with validation
  const revenueLineData = {
    labels: validateLabels(analyticsData.trends?.revenue?.labels, [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
    ]),
    datasets: [
      {
        label: "Revenue",
        data: validateChartData(
          analyticsData.trends?.revenue?.data,
          [95000, 105000, 115000, 108000, 120000, 125000]
        ),
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.4,
      },
    ],
  };

  // Debug chart data
  console.log("Revenue Chart Data:", {
    labels: revenueLineData.labels,
    data: revenueLineData.datasets[0].data,
    isValidData:
      Array.isArray(revenueLineData.datasets[0].data) &&
      revenueLineData.datasets[0].data.length > 0,
  });

  const trafficLineData = {
    labels: validateLabels(analyticsData.trends?.traffic?.labels, [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
    ]),
    datasets: [
      {
        label: "Website Traffic",
        data: validateChartData(
          analyticsData.trends?.traffic?.data,
          [38000, 40000, 42000, 41000, 43000, 45000]
        ),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        tension: 0.4,
      },
    ],
  };

  console.log("Traffic Chart Data:", {
    labels: trafficLineData.labels,
    data: trafficLineData.datasets[0].data,
    isValidData:
      Array.isArray(trafficLineData.datasets[0].data) &&
      trafficLineData.datasets[0].data.length > 0,
  });

  const usersLineData = {
    labels: validateLabels(analyticsData.trends?.users?.labels, [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
    ]),
    datasets: [
      {
        label: "Active Users",
        data: validateChartData(
          analyticsData.trends?.users?.data,
          [7200, 7500, 7800, 8000, 8200, 8500]
        ),
        borderColor: "rgb(54, 162, 235)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        tension: 0.4,
      },
    ],
  };

  console.log("Users Chart Data:", {
    labels: usersLineData.labels,
    data: usersLineData.datasets[0].data,
    isValidData:
      Array.isArray(usersLineData.datasets[0].data) &&
      usersLineData.datasets[0].data.length > 0,
  });

  const revenueByProductData = {
    labels: analyticsData.comparison?.revenueByProduct?.labels,
    datasets: [
      {
        label: "Revenue by Product",
        data: analyticsData.comparison?.revenueByProduct?.data,
        backgroundColor: [
          "rgba(255, 99, 132, 0.8)",
          "rgba(54, 162, 235, 0.8)",
          "rgba(255, 205, 86, 0.8)",
          "rgba(75, 192, 192, 0.8)",
          "rgba(153, 102, 255, 0.8)",
        ],
      },
    ],
  };

  const channelPerformanceData = {
    labels: analyticsData.comparison?.channelPerformance?.labels,
    datasets: [
      {
        label: "Channel Performance",
        data: analyticsData.comparison?.channelPerformance?.data,
        backgroundColor: [
          "rgba(255, 159, 64, 0.8)",
          "rgba(255, 99, 132, 0.8)",
          "rgba(54, 162, 235, 0.8)",
          "rgba(255, 205, 86, 0.8)",
          "rgba(75, 192, 192, 0.8)",
        ],
      },
    ],
  };

  const trafficSourcesData = {
    labels: analyticsData.composition?.trafficSources?.labels,
    datasets: [
      {
        data: analyticsData.composition?.trafficSources?.data,
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
      },
    ],
  };

  const customerDemographicsData = {
    labels: analyticsData.composition?.customerDemographics?.labels,
    datasets: [
      {
        data: analyticsData.composition?.customerDemographics?.data,
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
        ],
      },
    ],
  };

  // KPI Card Component
  const KPICard = ({
    title,
    value,
    previousValue,
    change,
    icon,
    format = "number",
  }) => {
    const isPositive = change > 0;
    const isNegative = change < 0;

    const formatValue = (val) => {
      switch (format) {
        case "currency":
          return `₹${val.toLocaleString()}`;
        case "percentage":
          return `${val}%`;
        default:
          return val.toLocaleString();
      }
    };

    return (
      <div className="col-xl-2 col-md-4 col-sm-6">
        <div className="card card-animate">
          <div className="card-body">
            <div className="d-flex align-items-center">
              <div className="flex-grow-1 overflow-hidden">
                <p className="text-uppercase fw-medium text-muted text-truncate mb-0">
                  {title}
                </p>
              </div>
              <div className="flex-shrink-0">
                <h5
                  className={`fs-14 mb-0 ${
                    isPositive
                      ? "text-success"
                      : isNegative
                      ? "text-danger"
                      : "text-muted"
                  }`}
                >
                  <i
                    className={`ri-arrow-${
                      isPositive ? "up" : "down"
                    }-line fs-13 align-middle`}
                  />
                  {Math.abs(change).toFixed(1)}%
                </h5>
              </div>
            </div>
            <div className="d-flex align-items-end justify-content-between mt-4">
              <div>
                <h4 className="fs-22 fw-semibold ff-secondary mb-4">
                  <span className="counter-value">{formatValue(value)}</span>
                </h4>
                <p className="text-muted mb-0">
                  vs {formatValue(previousValue)} last period
                </p>
              </div>
              <div className="avatar-sm flex-shrink-0">
                <span
                  className={`avatar-title bg-soft-${
                    isPositive ? "success" : isNegative ? "danger" : "primary"
                  } rounded fs-3`}
                >
                  <i
                    className={`${icon} text-${
                      isPositive ? "success" : isNegative ? "danger" : "primary"
                    }`}
                  />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Handle loading state
  if (isLoadingAPI) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "400px" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Handle error state
  if (isError) {
    console.error("Analytics Dashboard Error State:", isError);
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="page-title-box d-sm-flex align-items-center justify-content-between">
              <h4 className="mb-sm-0">Analytics Dashboard</h4>
              <div className="page-title-right">
                <ol className="breadcrumb m-0">
                  <li className="breadcrumb-item">
                    <a href="javascript: void(0);">Dashboard</a>
                  </li>
                  <li className="breadcrumb-item active">Analytics</li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-body text-center py-5">
                <div className="avatar-lg mx-auto mb-4">
                  <div className="avatar-title bg-soft-danger text-danger rounded-circle fs-2">
                    <i className="ri-error-warning-line"></i>
                  </div>
                </div>
                <h5 className="text-danger mb-3">
                  Failed to Load Analytics Data
                </h5>
                <p className="text-muted mb-4">
                  We encountered an error while fetching your analytics data.
                  Please check the console for detailed error information.
                </p>
                <div className="alert alert-danger" role="alert">
                  <strong>Error Details:</strong>{" "}
                  {error?.message ||
                    "Unable to connect to the analytics service."}
                  <br />
                  <small className="text-muted">
                    This could be due to network issues, server maintenance, or
                    invalid API configuration.
                  </small>
                </div>
                <button
                  className="btn btn-primary"
                  onClick={() => window.location.reload()}
                >
                  <i className="ri-refresh-line me-1"></i>
                  Retry
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      {/* Header */}
      <div className="row">
        <div className="col-12">
          <div className="page-title-box d-sm-flex align-items-center justify-content-between">
            <h4 className="mb-sm-0">Analytics Dashboard</h4>
            <div className="page-title-right">
              <ol className="breadcrumb m-0">
                <li className="breadcrumb-item">
                  <a href="javascript: void(0);">Dashboard</a>
                </li>
                <li className="breadcrumb-item active">Analytics</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      {/* Date Range Picker */}
      <DateRangePicker />

      {/* Performance Overview */}
      <div className="row mb-3">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h5 className="card-title mb-0">Performance Overview</h5>
                  <p className="text-muted mb-0">
                    Track your key metrics and business performance for {selectedPeriod === 'custom' ? 'custom date range' : selectedPeriod}
                  </p>
                </div>
                <div className="d-flex gap-2">
                  <span className="badge bg-primary-subtle text-primary">
                    {dateRange.startDate.toLocaleDateString()} - {dateRange.endDate.toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 1. Key Performance Indicators (KPIs) */}
      <div className="row mb-4">
        <div className="col-12">
          <h5 className="mb-3">📊 Key Performance Indicators</h5>
        </div>
        <KPICard
          title="Total Revenue"
          value={analyticsData.kpis?.totalRevenue?.current}
          previousValue={analyticsData.kpis?.totalRevenue?.previous}
          change={analyticsData.kpis?.totalRevenue?.change}
          icon="bx bx-dollar-circle"
          format="currency"
        />
        <KPICard
          title="Conversion Rate"
          value={analyticsData.kpis?.conversionRate?.current}
          previousValue={analyticsData.kpis?.conversionRate?.previous}
          change={analyticsData.kpis?.conversionRate?.change}
          icon="bx bx-trending-up"
          format="percentage"
        />
        <KPICard
          title="Website Traffic"
          value={analyticsData.kpis?.websiteTraffic?.current}
          previousValue={analyticsData.kpis?.websiteTraffic?.previous}
          change={analyticsData.kpis?.websiteTraffic?.change}
          icon="bx bx-globe"
        />
        <KPICard
          title="Leads"
          value={analyticsData.kpis?.leads?.current}
          previousValue={analyticsData.kpis?.leads?.previous}
          change={analyticsData.kpis?.leads?.change}
          icon="bx bx-target-lock"
        />
        <KPICard
          title="Cost Per Acquisition"
          value={analyticsData.kpis?.cpa?.current}
          previousValue={analyticsData.kpis?.cpa?.previous}
          change={analyticsData.kpis?.cpa?.change}
          icon="bx bx-money"
          format="currency"
        />
        <KPICard
          title="Active Users"
          value={analyticsData.kpis?.activeUsers?.current}
          previousValue={analyticsData.kpis?.activeUsers?.previous}
          change={analyticsData.kpis?.activeUsers?.change}
          icon="bx bx-user"
        />
        <KPICard
          title="Churn Rate"
          value={analyticsData.kpis?.churnRate?.current}
          previousValue={analyticsData.kpis?.churnRate?.previous}
          change={analyticsData.kpis?.churnRate?.change}
          icon="bx bx-user-minus"
          format="percentage"
        />
        <KPICard
          title="NPS Score"
          value={analyticsData.kpis?.nps?.current}
          previousValue={analyticsData.kpis?.nps?.previous}
          change={analyticsData.kpis?.nps?.change}
          icon="bx bx-star"
        />
      </div>

      {/* 2. Trend Analysis */}
      <div className="row mb-4">
        <div className="col-12">
          <h5 className="mb-3">📈 Trend Analysis</h5>
        </div>
        <div className="col-xl-4 col-lg-6">
          <div className="card">
            <div className="card-header">
              <h6 className="card-title mb-0">Revenue Trend</h6>
            </div>
            <div className="card-body">
              <div style={{ height: "300px" }}>
                <Line data={revenueLineData} options={lineChartOptions} />
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-4 col-lg-6">
          <div className="card">
            <div className="card-header">
              <h6 className="card-title mb-0">Website Traffic Trend</h6>
            </div>
            <div className="card-body">
              <div style={{ height: "300px" }}>
                <Line data={trafficLineData} options={lineChartOptions} />
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-4 col-lg-6">
          <div className="card">
            <div className="card-header">
              <h6 className="card-title mb-0">User Growth Trend</h6>
            </div>
            <div className="card-body">
              <div style={{ height: "300px" }}>
                <Line data={usersLineData} options={lineChartOptions} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Comparison & Segmentation */}
      <div className="row mb-4">
        <div className="col-12">
          <h5 className="mb-3">📊 Comparison & Segmentation</h5>
        </div>
        <div className="col-xl-6">
          <div className="card">
            <div className="card-header">
              <h6 className="card-title mb-0">Revenue by Product Category</h6>
            </div>
            <div className="card-body">
              <div style={{ height: "350px" }}>
                <Bar data={revenueByProductData} options={barChartOptions} />
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-6">
          <div className="card">
            <div className="card-header">
              <h6 className="card-title mb-0">Marketing Channel Performance</h6>
            </div>
            <div className="card-body">
              <div style={{ height: "350px" }}>
                <Bar data={channelPerformanceData} options={barChartOptions} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Composition Analysis */}
      <div className="row mb-4">
        <div className="col-12">
          <h5 className="mb-3">🥧 Composition Analysis</h5>
        </div>
        <div className="col-xl-6">
          <div className="card">
            <div className="card-header">
              <h6 className="card-title mb-0">Traffic Sources Distribution</h6>
            </div>
            <div className="card-body">
              <div style={{ height: "350px" }}>
                <Pie data={trafficSourcesData} options={pieChartOptions} />
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-6">
          <div className="card">
            <div className="card-header">
              <h6 className="card-title mb-0">Customer Demographics</h6>
            </div>
            <div className="card-body">
              <div style={{ height: "350px" }}>
                <Doughnut
                  data={customerDemographicsData}
                  options={pieChartOptions}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Recent Activities */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">🕒 Recent Activities</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-12">
                  <h6 className="mb-3">Recent Sales</h6>
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Sale ID</th>
                          <th>Customer</th>
                          <th>Amount</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {analyticsData.recentActivities?.recentSales?.slice(0, 10).map((sale, index) => (
                          <tr key={sale.id || index}>
                            <td>
                              <span className="badge bg-primary">{sale.id}</span>
                            </td>
                            <td>{sale.customer_name || 'Guest Customer'}</td>
                            <td>
                              <span className="fw-semibold text-success">
                                ₹{parseFloat(sale.total_payment).toLocaleString()}
                              </span>
                            </td>
                            <td>
                              <small className="text-muted">{sale.sale_date}</small>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {(!analyticsData.recentActivities?.recentSales || analyticsData.recentActivities.recentSales.length === 0) && (
                    <div className="text-center py-4">
                      <p className="text-muted mb-0">No recent sales data available</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Insights */}
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h6 className="card-title mb-0">
                💡 Key Insights & Recommendations
              </h6>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <div className="alert alert-success" role="alert">
                    <h6 className="alert-heading">📈 Strong Performance</h6>
                    <p className="mb-0">
                      Revenue is up 13.6% compared to last period, with
                      Electronics leading product categories.
                    </p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="alert alert-info" role="alert">
                    <h6 className="alert-heading">
                      🎯 Optimization Opportunity
                    </h6>
                    <p className="mb-0">
                      Focus on improving conversion rates in paid search
                      channels for better ROI.
                    </p>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <div className="alert alert-warning" role="alert">
                    <h6 className="alert-heading">⚠️ Monitor Closely</h6>
                    <p className="mb-0">
                      Churn rate has improved but still requires attention to
                      maintain user retention.
                    </p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="alert alert-primary" role="alert">
                    <h6 className="alert-heading">🚀 Growth Opportunity</h6>
                    <p className="mb-0">
                      Social media traffic shows potential - consider increasing
                      investment in this channel.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
