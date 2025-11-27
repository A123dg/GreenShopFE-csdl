export interface MonthlyStat {
  month: number;
  revenue: number;
  totalProducts: number;
}

export interface TopUser {
  userId: number;
  fullName: string;
  totalSpent: number;
}

export interface TopProduct {
  productId: number;
  productName: string;
  totalSold: number;
}

export interface DashboardResponse {
  totalUsers: number;
  totalNews: number;
  totalOrders: number;
  totalProducts: number;
  totalVouchers: number;
  totalRevenue: number;

  monthlyStats: MonthlyStat[];

  avgRevenue12Months: number;

  highestMonth: MonthlyStat;
  lowestMonth: MonthlyStat;

  topUsers: TopUser[];
  topProducts: TopProduct[];
}
