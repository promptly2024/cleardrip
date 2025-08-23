import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, ReferenceDot, ReferenceLine } from "recharts";
import { TdsClass } from "@/lib/httpClient/tds";
import { SubscriptionClass } from "@/lib/httpClient/subscription";
import { ServicesClass } from "@/lib/httpClient/services";
import { TDSLog } from "@/lib/types/tds";
import { MoreHorizontal, ArrowUpRight } from "lucide-react";

export const OverviewTab = ({ user }: { user?: { name?: string } }) => {
  const [tdsLogs, setTdsLogs] = useState<TDSLog[]>([]);
  const [liveTDS, setLiveTDS] = useState<number | null>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const [nextService, setNextService] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      try {
        // Fetch TDS logs (last 7 is enough for chart and live)
        const tdsRes = await TdsClass.getRecentTDSLogs(7, 0);
        setTdsLogs(Array.isArray(tdsRes.tdsLogs) ? tdsRes.tdsLogs : []);
        if (tdsRes.tdsLogs?.length) {
          setLiveTDS(tdsRes.tdsLogs[tdsRes.tdsLogs.length - 1]?.tdsValue || null);
        }

        // Fetch subscription
        const subRes = await SubscriptionClass.getCurrentSubscription();
        console.log("Current Sub Plan is ", subRes);
        setSubscription(subRes.data);

        // Fetch next RO service (find next scheduled/upcoming)
        const servicesRes = await ServicesClass.getAllServices(5, 0);
        const upcoming = Array.isArray(servicesRes.services)
          ? servicesRes.services.find((svc: any) => svc.status === "PENDING" || svc.status === "SCHEDULED")
          : null;
        setNextService(upcoming || null);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, []);

  // Format TDS chart data for Recharts
  const chartData = tdsLogs.map((log: any, idx: number) => ({
    day: log.day || (log.createdAt ? new Date(log.createdAt).toLocaleDateString('en-US', { weekday: 'short' }) : `Day ${idx+1}`),
    InputTDS: log.inputTds ?? log.tdsValue ?? 0,
    PurifiedTDS: log.purifiedTds ?? log.purifiedTds ?? 0,
  }));

  // Find alerts for chart
  const alertDay = chartData.find((log: any) => log.InputTDS > 550)?.day;

  // Calculate days until next service
  const getDaysUntilService = (scheduledDate: string | null) => {
    if (!scheduledDate) return null;
    const today = new Date();
    const serviceDate = new Date(scheduledDate);
    const timeDiff = serviceDate.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return Math.max(0, daysDiff);
  };

  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not scheduled";
    return new Date(dateString).toLocaleDateString('en-US', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  // Check if subscription is active
  const isSubscriptionActive = (subscription: any) => {
    if (!subscription || !subscription.endDate) return false;
    const today = new Date();
    const endDate = new Date(subscription.endDate);
    return endDate > today;
  };

  // Get subscription status
  const getSubscriptionStatus = (subscription: any) => {
    if (!subscription) return "No Subscription";
    if (isSubscriptionActive(subscription)) return "Active";
    return "Expired";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-4">
      {/* Top row - spans 2 columns */}
      <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Live TDS Card */}
        <Card className="bg-gradient-to-br from-blue-600 to-blue-700 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Live TDS</span>
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              </div>
              <div className="text-6xl opacity-20">💧</div>
            </div>
            <div className="mb-4">
              <div className="text-4xl font-bold mb-2">
                {liveTDS !== null ? `${liveTDS} ppm` : <span className="text-white/60">No data</span>}
              </div>
              <div className="text-sm opacity-80">Safe until 550ppm</div>
            </div>
          </CardContent>
        </Card>

        {/* Filter Health Card */}
        <Card className="bg-white border shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Filter health</h3>
            <div className="flex flex-col items-center">
              <div className="relative w-24 h-24 mb-4">
                <svg className="w-24 h-24 transform -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r="36"
                    stroke="#e5e7eb"
                    strokeWidth="6"
                    fill="none"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="36"
                    stroke="#06b6d4"
                    strokeWidth="6"
                    fill="none"
                    strokeDasharray={226}
                    strokeDashoffset={226 * (1 - 0.85)}
                    className="transition-all duration-300"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-700">85%</span>
                </div>
              </div>
              <p className="text-sm text-gray-600">remaining</p>
            </div>
            <p className="text-xs text-gray-500 text-center mt-4">
              Estimated replacement in 2 months
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Subscription Info Card - Right side */}
      <Card className="bg-white border shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-lg font-semibold">Subscription Plan</h3>
            <MoreHorizontal className="w-5 h-5 text-gray-400" />
          </div>
          
          {subscription ? (
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">
                  Plan: <span className="font-medium capitalize">{subscription.planType || "N/A"}</span>
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">
                  Status: <span className={`font-medium capitalize ${
                    getSubscriptionStatus(subscription) === "Active" 
                      ? "text-green-600" 
                      : getSubscriptionStatus(subscription) === "Expired"
                      ? "text-red-600"
                      : "text-gray-600"
                  }`}>
                    {getSubscriptionStatus(subscription)}
                  </span>
                </p>
              </div>
              {subscription.loyaltyBadge && (
                <div>
                  <p className="text-sm text-gray-600">
                    Badge: <span className="font-medium text-yellow-600">{subscription.loyaltyBadge}</span>
                  </p>
                </div>
              )}
              {subscription.startDate && (
                <div>
                  <p className="text-sm text-gray-600">
                    Valid from: <span className="font-medium">{formatDate(subscription.startDate)}</span>
                  </p>
                </div>
              )}
              {subscription.endDate && (
                <div>
                  <p className="text-sm text-gray-600">
                    Valid until: <span className="font-medium">{formatDate(subscription.endDate)}</span>
                  </p>
                </div>
              )}
              {subscription.id && (
                <div>
                  <p className="text-xs text-gray-500 mt-2">
                    ID: {subscription.id.slice(0, 8)}...
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-sm text-gray-500">No active subscription found</div>
          )}
        </CardContent>
      </Card>

      {/* Water Usage Analytics - Full width bottom */}
      <div className="lg:col-span-2">
        <Card className="bg-white border shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">Water usage Analytics</h3>
              <select className="text-sm border rounded px-3 py-1 text-gray-600">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
              </select>
            </div>
            
            {chartData.length > 0 ? (
              <>
                <div className="h-64 mb-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <XAxis 
                        dataKey="day" 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: '#6b7280' }}
                      />
                      <YAxis 
                        domain={[0, 800]} 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: '#6b7280' }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px'
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="InputTDS" 
                        stroke="#374151" 
                        strokeWidth={3}
                        dot={{ fill: '#374151', strokeWidth: 2, r: 4 }}
                        name="Input TDS" 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="PurifiedTDS" 
                        stroke="#3b82f6" 
                        strokeWidth={3}
                        dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                        name="Purified TDS" 
                      />
                      {/* Highlight alert point */}
                      {alertDay && (
                        <ReferenceDot 
                          x={alertDay} 
                          y={chartData.find(d => d.day === alertDay)?.InputTDS} 
                          r={6} 
                          fill="#ef4444" 
                          stroke="#dc2626"
                        />
                      )}
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Legend */}
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gray-700 rounded-full"></div>
                    <span className="text-sm text-gray-600">Input TDS</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Purified TDS</span>
                  </div>
                </div>

                {/* Alert */}
                {alertDay && (
                  <div className="flex items-center gap-2 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-red-500"></div>
                    <span className="text-sm text-red-700">
                      <strong>Alert:</strong> Input TDS levels exceeded 550 ppm on {alertDay}
                    </span>
                  </div>
                )}
              </>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500">
                No TDS data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Next RO Service Card */}
      <Card className="bg-white border shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-lg font-semibold">Next Ro service scheduled</h3>
            <button className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center hover:bg-blue-200 transition-colors">
              <ArrowUpRight className="w-4 h-4 text-blue-600" />
            </button>
          </div>
          
          {nextService ? (
            <div className="space-y-4">
              {nextService.scheduledDate && (
                <p className="text-sm text-gray-600">
                  Due in <span className="font-semibold">
                    {getDaysUntilService(nextService.scheduledDate)} Days
                  </span>
                </p>
              )}
              
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-semibold">Date:</span> {formatDate(nextService.scheduledDate)}
                </p>
                {nextService.bookingId && (
                  <p className="text-sm">
                    <span className="font-semibold">Booking ID:</span> {nextService.bookingId}
                  </p>
                )}
                {nextService.id && !nextService.bookingId && (
                  <p className="text-sm">
                    <span className="font-semibold">Service ID:</span> {nextService.id}
                  </p>
                )}
                <p className="text-sm">
                  <span className="font-semibold">Time:</span> {nextService.timeSlot || "Between 10 AM – 1 PM"}
                </p>
                {nextService.serviceType && (
                  <p className="text-sm">
                    <span className="font-semibold">Type:</span> {nextService.serviceType}
                  </p>
                )}
              </div>

              <div className="pt-4 space-y-2">
                <button className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                  Reschedule
                </button>
                <button className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                  Add to calendar
                </button>
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-500">No upcoming service found</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
