import React from "react";
import { useDashboard } from "../hooks/useDashboard";

// Heroicons
import {
  BanknotesIcon,
  UserGroupIcon,
  ShoppingBagIcon,
  NewspaperIcon,
  TicketIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

// Recharts
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const Dashboard: React.FC = () => {
  const { dashboard, fetchDashboard } = useDashboard();

  React.useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  if (!dashboard) return <div className="p-6">Đang tải...</div>;

  return (
    <div className="w-full p-6 bg-gray-100 min-h-screen space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard
          title="Tổng doanh thu"
          value={formatCurrency(dashboard.totalRevenue)}
          icon={<BanknotesIcon className="w-10 h-10 text-green-600" />}
        />
        <StatCard
          title="Tổng người dùng"
          value={dashboard.totalUsers.toLocaleString()}
          icon={<UserGroupIcon className="w-10 h-10 text-blue-600" />}
        />
        <StatCard
          title="Tổng đơn hàng"
          value={dashboard.totalOrders.toLocaleString()}
          icon={<ShoppingBagIcon className="w-10 h-10 text-purple-600" />}
        />
        <StatCard
          title="Tổng tin tức"
          value={dashboard.totalNews.toLocaleString()}
          icon={<NewspaperIcon className="w-10 h-10 text-yellow-600" />}
        />
        <StatCard
          title="Tổng sản phẩm"
          value={dashboard.totalProducts.toLocaleString()}
          icon={<ChartBarIcon className="w-10 h-10 text-indigo-600" />}
        />
        <StatCard
          title="Tổng voucher"
          value={dashboard.totalVouchers.toLocaleString()}
          icon={<TicketIcon className="w-10 h-10 text-red-600" />}
        />
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center gap-2 mb-4">
          <ChartBarIcon className="w-6 h-6 text-gray-600" />
          <h2 className="text-lg font-bold text-gray-700">Doanh thu 12 tháng</h2>
        </div>
        {dashboard.monthlyStats && dashboard.monthlyStats.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dashboard.monthlyStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tickFormatter={(m) => `Th ${m}`} />
              <YAxis />
              <Tooltip formatter={(v) => formatCurrency(v as number)} />
              <Line type="monotone" dataKey="revenue" stroke="#4ade80" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500 italic">Không có dữ liệu</p>
        )}
      </div>

      {/* Highest & Lowest Month */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <MonthCard
          title="Tháng cao nhất"
          monthData={dashboard.highestMonth}
          formatCurrency={formatCurrency}
          bgColor="green-50"
          textColor="green-700"
        />
        <MonthCard
          title="Tháng thấp nhất"
          monthData={dashboard.lowestMonth}
          formatCurrency={formatCurrency}
          bgColor="red-50"
          textColor="red-700"
        />
      </div>

      {/* Average Revenue */}
      <div className="p-6 bg-blue-50 rounded-xl shadow">
        <h3 className="text-lg font-bold text-blue-700 mb-2">Doanh thu trung bình 12 tháng</h3>
        <p className="text-2xl font-bold text-gray-800">
          {formatCurrency(dashboard.avgRevenue12Months)}
        </p>
      </div>

      {/* Top Users */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-bold mb-4 text-gray-700">Top khách hàng</h2>
        {dashboard.topUsers && dashboard.topUsers.length > 0 ? (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="p-3 text-left">Tên</th>
                <th className="p-3 text-right">Tổng chi tiêu</th>
              </tr>
            </thead>
            <tbody>
              {dashboard.topUsers.map((u) => (
                <tr key={u.userId} className="border-b">
                  <td className="p-3">{u.fullName}</td>
                  <td className="p-3 text-right">{formatCurrency(u.totalSpent)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500 italic">Không có dữ liệu</p>
        )}
      </div>

      {/* Top Products */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-bold mb-4 text-gray-700">Sản phẩm bán chạy nhất</h2>
        {dashboard.topProducts && dashboard.topProducts.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dashboard.topProducts}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="productName" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="totalSold" fill="#60a5fa" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500 italic">Không có dữ liệu</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

/* --- COMPONENTS --- */

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}
const StatCard: React.FC<StatCardProps> = ({ title, value, icon }) => (
  <div className="bg-white shadow rounded-xl p-4 flex items-center gap-3">
    {icon}
    <div>
      <p className="text-gray-500">{title}</p>
      <p className="text-xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

interface MonthData {
  month: number;
  revenue: number;
  totalProducts: number;
}

interface MonthCardProps {
  title: string;
  monthData: MonthData | null;
  formatCurrency: (amount: number) => string;
  bgColor: string;
  textColor: string;
}

const MonthCard: React.FC<MonthCardProps> = ({
  title,
  monthData,
  formatCurrency,
  bgColor,
  textColor,
}) => (
  <div className={`p-6 rounded-xl shadow ${bgColor}`}>
    <h3 className={`text-lg font-bold mb-2 ${textColor}`}>{title}</h3>
    {monthData ? (
      <>
        <p>Tháng: <strong>{monthData.month}</strong></p>
        <p>Doanh thu: <strong>{formatCurrency(monthData.revenue)}</strong></p>
        <p>Sản phẩm bán: <strong>{monthData.totalProducts}</strong></p>
      </>
    ) : (
      <p className="text-gray-500 italic">Không có dữ liệu</p>
    )}
  </div>
);
