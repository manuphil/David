// ================================
// 📦 API SERVICE POUR REACT (TypeScript)
// ================================

// ================================
// 🎯 TYPES & INTERFACES
// ================================

// Utilisateur
export interface UserAPI {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  date_joined: string;
  is_active: boolean;
  wallet_address?: string;
}

// Jeton JWT
export interface TokenResponse {
  access: string;
  refresh: string;
}

// Holdings
export interface TokenHoldingAPI {
  id: number;
  wallet_address: string;
  balance: string;
  tickets_count: number;
  is_eligible: boolean;
  last_updated: string;
  participation_count?: number;
  total_winnings?: string;
  last_win_time?: string | null;
}

export interface TokenHoldingResponse {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: TokenHoldingAPI[];
}

// Loterie
export interface LotteryAPI {
  id: number;
  lottery_type: 'hourly' | 'daily';
  draw_id: number;
  scheduled_time: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  jackpot_amount_sol: string;
  total_participants: number;
  total_tickets: number;
  created_at: string;
  executed_time?: string | null;
  winner_wallet?: string | null;
  transaction_signature?: string | null;
  random_seed?: string | null;
}

export interface LotteryResponse {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: LotteryAPI[];
}

// Gagnant
// Mise à jour de l'interface WinnerAPI
export interface WinnerAPI {
  id: number;
  lottery_id: number; // ✅ Changement de 'lottery' vers 'lottery_id'
  wallet_address: string;
  wallet_short?: string;
  winning_amount_sol: string;
  winning_amount_formatted?: string;
  winning_amount_usd?: string;
  tickets_held: number;
  payout_status: 'pending' | 'processing' | 'completed' | 'failed';
  payout_time?: string | null;
  payout_transaction_signature?: string | null;
  created_at: string;
  // Champs ajoutés par le serializer
  lottery_type?: 'hourly' | 'daily';
  lottery_date?: string;
}


export interface WinnerResponse {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: WinnerAPI[];
}

// Transaction
export interface TransactionAPI {
  id: number;
  wallet_address: string;
  transaction_type: 'buy' | 'sell' | 'lottery_draw' | 'payout';
  sol_amount: string;
  ball_amount: string;
  transaction_signature: string;
  block_time: string;
  slot: number;
  created_at: string;
}

export interface TransactionResponse {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: TransactionAPI[];
}

// Jackpot
export interface JackpotPoolAPI {
  id: number;
  lottery_type: 'hourly' | 'daily';
  current_amount_sol: string;
  last_updated: string;
  total_contributions: string;
  contribution_count: number;
}

export interface JackpotPoolResponse {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: JackpotPoolAPI[];
}

// Statistiques
export interface StatsAPI {
  total_draws: number;
  total_participants: number;
  total_winnings_sol: string;
  burned_tokens: string;
  burned_tickets: number;
  average_jackpot: string;
  total_volume_sol: string;
  active_players: number;
}

// Info Wallet
export interface WalletInfoAPI {
  wallet_address: string;
  current_balance: string;
  tickets_count: number;
  is_eligible: boolean;
  last_updated: string;
  was_active: boolean;
  total_winnings: string;
  estimated_roi_percentage: string;
  estimated_roi_amount: string;
  win_history: WinnerAPI[];
  recent_transactions: TransactionAPI[];
  participation_stats: {
    total_participations: number;
    total_wins: number;
    win_rate: number;
    average_win: string;
  };
  rankings: {
    balance_rank: number;
    tickets_rank: number;
  };
}

// Dashboard
export interface DashboardAPI {
  current_jackpots: JackpotPoolAPI[];
  recent_winners: WinnerAPI[];
  recent_transactions: TransactionAPI[];
  current_lottery: LotteryAPI | null;
  stats: {
    total_participants: number;
    total_draws: number;
    total_winnings: string;
    active_tickets: number;
  };
}

// État du tirage
export interface LotteryStateAPI {
  admin: string;
  ball_token_mint: string;
  hourly_jackpot_sol: string;
  daily_jackpot_sol: string;
  total_participants: number;
  total_tickets: number;
  last_hourly_draw: string;
  last_daily_draw: string;
  hourly_draw_count: number;
  daily_draw_count: number;
  is_paused: boolean;
  emergency_stop: boolean;
  last_updated: string;
  treasury_balance: string;
  total_volume_processed: string;
}

// Constantes
export const LOTTERY_TYPES = {
  HOURLY: 'hourly',
  DAILY: 'daily'
} as const;

// ================================
// 🌐 API SERVICE CLASS
// ================================

class LotteryAPIService {
  private baseUrl: string;
  public accessToken: string | null = null;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_URL || 'https://power-8.onrender.com';
    if (typeof window !== 'undefined') {
      this.accessToken = localStorage.getItem('access_token');
    }
  }

  private getAuthHeaders(): Record<string, string> {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (this.accessToken) headers['Authorization'] = `Bearer ${this.accessToken}`;
    return headers;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, { headers: this.getAuthHeaders(), ...options });
    if (!response.ok) throw new Error(await response.text());
    return response.json();
  }

  // 🔐 Auth
  async login(username: string, password: string): Promise<TokenResponse> {
    const res = await this.request<TokenResponse>('/api/auth/token/', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });
    this.accessToken = res.access;
    localStorage.setItem('access_token', res.access);
    localStorage.setItem('refresh_token', res.refresh);
    return res;
  }

  async refreshToken(): Promise<TokenResponse> {
    const refresh = localStorage.getItem('refresh_token');
    if (!refresh) throw new Error('No refresh token available');
    const res = await this.request<TokenResponse>('/api/auth/token/refresh/', {
      method: 'POST',
      body: JSON.stringify({ refresh })
    });
    this.accessToken = res.access;
    localStorage.setItem('access_token', res.access);
    return res;
  }

  async verifyToken(): Promise<boolean> {
    try {
      const token = this.accessToken || localStorage.getItem('access_token');
      if (!token) return false;
      await this.request('/api/auth/token/verify/', {
        method: 'POST',
        body: JSON.stringify({ token })
      });
      return true;
    } catch {
      return false;
    }
  }

  logout(): void {
    this.accessToken = null;
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  // 👤 Users
  async getCurrentUser(userId?: number): Promise<UserAPI> {
    const params = userId ? `?user_id=${userId}` : '';
    return this.request(`/api/v1/users/me/${params}`);
  }

  async connectWallet(userId: number, walletAddress: string): Promise<{ success: string }> {
    return this.request(`/api/v1/users/${userId}/connect_wallet/`, {
      method: 'POST',
      body: JSON.stringify({ wallet_address: walletAddress })
    });
  }

  // 🎫 Token Holdings
  async getTokenHoldings(page = 1, pageSize = 20): Promise<TokenHoldingResponse> {
    return this.request(`/api/v1/holdings/?page=${page}&page_size=${pageSize}`);
  }

  async getMyHoldings(walletAddress: string): Promise<TokenHoldingAPI> {
    return this.request(`/api/v1/holdings/my_holdings/?wallet_address=${walletAddress}`);
  }

  async getLeaderboard(): Promise<TokenHoldingAPI[]> {
    return this.request(`/api/v1/holdings/leaderboard/`);
  }

  async syncWallet(walletAddress: string): Promise<TokenHoldingAPI> {
    return this.request(`/api/v1/holdings/sync_wallet/`, {
      method: 'POST',
      body: JSON.stringify({ wallet_address: walletAddress })
    });
  }

  async syncAllWallets(): Promise<{ success: string }> {
    return this.request(`/api/v1/holdings/sync_all/`, {
      method: 'POST'
    });
  }

  // 🎲 Lotteries
  async getLotteries(page = 1, pageSize = 20): Promise<LotteryResponse> {
    return this.request(`/api/v1/lotteries/?page=${page}&page_size=${pageSize}`);
  }

  async getLottery(id: number): Promise<LotteryAPI> {
    return this.request(`/api/v1/lotteries/${id}/`);
  }

  async getUpcomingLotteries(): Promise<LotteryAPI[]> {
    return this.request(`/api/v1/lotteries/upcoming/`);
  }

  async getRecentLotteries(): Promise<LotteryAPI[]> {
    return this.request(`/api/v1/lotteries/recent/`);
  }

  async executeLottery(id: number): Promise<{ success: string; winner: string }> {
    return this.request(`/api/v1/lotteries/${id}/execute/`, {
      method: 'POST'
    });
  }

  async syncLotteryWithSolana(id: number): Promise<{ success: string }> {
    return this.request(`/api/v1/lotteries/${id}/sync_with_solana/`, {
      method: 'POST'
    });
  }

  async createLottery(data: any): Promise<LotteryAPI> {
    return this.request(`/api/v1/lotteries/`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  // 🏆 Winners
  async getWinners(page = 1, pageSize = 20): Promise<WinnerResponse> {
    return this.request(`/api/v1/winners/?page=${page}&page_size=${pageSize}`);
  }

  async getWinner(id: number): Promise<WinnerAPI> {
    return this.request(`/api/v1/winners/${id}/`);
  }

  async getHallOfFame(): Promise<WinnerAPI[]> {
    return this.request(`/api/v1/winners/hall_of_fame/`);
  }

  async getMyWins(walletAddress: string): Promise<WinnerAPI[]> {
    return this.request(`/api/v1/winners/my_wins/?wallet_address=${walletAddress}`);
  }

  async payWinner(id: number): Promise<{ success: string }> {
    return this.request(`/api/v1/winners/${id}/pay_winner/`, {
      method: 'POST'
    });
  }

  // 💰 Jackpots
  async getJackpots(): Promise<JackpotPoolResponse> {
    return this.request(`/api/v1/jackpots/`);
  }

  async getCurrentPools(): Promise<JackpotPoolAPI[]> {
    return this.request(`/api/v1/jackpots/current_pools/`);
  }

  async syncPools(): Promise<{ success: string; data: any }> {
    return this.request(`/api/v1/jackpots/sync_pools/`, {
      method: 'POST'
    });
  }

  // 💳 Transactions
  async getTransactions(page = 1, pageSize = 20): Promise<TransactionResponse> {
    return this.request(`/api/v1/transactions/?page=${page}&page_size=${pageSize}`);
  }

  async getRecentActivity(): Promise<TransactionAPI[]> {
    return this.request(`/api/v1/transactions/recent_activity/`);
  }

  async getMyTransactions(walletAddress: string): Promise<TransactionAPI[]> {
    return this.request(`/api/v1/transactions/my_transactions/?wallet_address=${walletAddress}`);
  }

  async getTransactionStats(): Promise<any> {
    return this.request(`/api/v1/transactions/stats/`);
  }

  // 📊 Stats
  async getStats(): Promise<StatsAPI> {
    return this.request(`/api/v1/stats/`);
  }

  async getLotteryHistory(type?: string, days = 30): Promise<any[]> {
    const params = new URLSearchParams();
    if (type) params.append('type', type);
    params.append('days', days.toString());
    return this.request(`/api/v1/stats/lottery_history/?${params}`);
  }

  async getParticipantStats(): Promise<any> {
    return this.request(`/api/v1/stats/participant_stats/`);
  }

  // ⚙️ System Config
  async getSystemConfig(): Promise<any> {
    return this.request(`/api/v1/config/`);
  }

  async getPublicConfig(): Promise<any> {
    return this.request(`/api/v1/config/public_config/`);
  }

  async updateConfig(key: string, value: any, description = ''): Promise<any> {
    return this.request(`/api/v1/config/update_config/`, {
      method: 'POST',
      body: JSON.stringify({ key, value, description })
    });
  }

  async getSolanaConfig(): Promise<any> {
    return this.request(`/api/v1/config/solana_config/`);
  }

    // 📋 Audit Logs (suite)
    async getRecentAuditActivity(): Promise<any[]> {
      return this.request(`/api/v1/audit-logs/recent_activity/`);
    }
  
    async getUserActivity(userId?: number, walletAddress?: string): Promise<any[]> {
      const params = new URLSearchParams();
      if (userId) params.append('user_id', userId.toString());
      if (walletAddress) params.append('wallet_address', walletAddress);
      return this.request(`/api/v1/audit-logs/user_activity/?${params}`);
    }
  
    // 📈 Dashboard
    async getDashboard(): Promise<DashboardAPI> {
      return this.request(`/api/v1/dashboard/`);
    }
  
    async triggerSync(): Promise<{ success: string }> {
      return this.request(`/api/v1/dashboard/trigger_sync/`, {
        method: 'POST'
      });
    }
  
    async getSystemStatus(): Promise<any> {
      return this.request(`/api/v1/dashboard/system_status/`);
    }
  
    async getLotteryState(): Promise<any> {
      try {
        // Utiliser l'URL correcte avec /api/v1/
        const response = await this.request('/api/v1/dashboard/lottery_state/', {
          method: 'GET',
        });
        return response;
      } catch (error) {
        console.error('Error fetching lottery state:', error);
        throw error; // Laisser le composant gérer l'erreur
      }
    }
  
  
    async getDashboardStats(): Promise<any> {
      return this.request(`/api/v1/dashboard/stats/`);
    }
  
    // 👛 Wallet Info
    async getWalletInfo(walletAddress: string): Promise<WalletInfoAPI> {
      return this.request(`/api/v1/wallet-info/${walletAddress}/`);
    }
  
    async syncWalletInfo(walletAddress: string): Promise<{ success: string; data: any }> {
      return this.request(`/api/v1/wallet-info/${walletAddress}/sync_wallet/`, {
        method: 'POST'
      });
    }
  
    async getWalletLeaderboard(type = 'balance', limit = 10): Promise<{ count: number; results: TokenHoldingAPI[]; type: string }> {
      return this.request(`/api/v1/wallet-info/leaderboard/?type=${type}&limit=${limit}`);
    }
  
    async searchWallets(query: string): Promise<{ count: number; results: TokenHoldingAPI[]; query: string }> {
      return this.request(`/api/v1/wallet-info/search/?q=${encodeURIComponent(query)}`);
    }
  
    async getParticipationHistory(walletAddress: string): Promise<{
      wallet_address: string;
      participation_history: any[];
      total_participations: number;
      total_wins: number;
    }> {
      return this.request(`/api/v1/wallet-info/${walletAddress}/participation_history/`);
    }
  
    async bulkSyncWallets(): Promise<{ success: string; task_id: string; wallets_count: number }> {
      return this.request(`/api/v1/wallet-info/bulk_sync/`);
    }
  
    // 🛠️ Méthodes utilitaires héritées
    async getCurrentLottery(): Promise<LotteryAPI | null> {
      try {
        const upcoming = await this.getUpcomingLotteries();
        return upcoming[0] || null;
      } catch {
        return null;
      }
    }
  
    async getRecentWinners(limit = 5): Promise<WinnerAPI[]> {
      const res = await this.request<WinnerResponse>(`/api/v1/winners/?ordering=-created_at&page_size=${limit}`);
      return res.results;
    }
  
    async getTopHolders(limit = 10): Promise<TokenHoldingAPI[]> {
      const res = await this.request<TokenHoldingResponse>(`/api/v1/holdings/?ordering=-balance&page_size=${limit}`);
      return res.results;
    }
  
    // 🛠️ UTILS
    lamportsToSol(val: number | string): number {
      return Number(val) / 1_000_000_000;
    }
  
    solToLamports(val: number | string): number {
      return Math.floor(Number(val) * 1_000_000_000);
    }
  
    // 🔄 Méthodes de synchronisation avancées
    async fullSystemSync(): Promise<{
      lottery_sync: { success: string };
      wallet_sync: { success: string };
      pool_sync: { success: string; data: any };
    }> {
      const [lotterySync, walletSync, poolSync] = await Promise.all([
        this.triggerSync(),
        this.syncAllWallets(),
        this.syncPools()
      ]);
  
      return {
        lottery_sync: lotterySync,
        wallet_sync: walletSync,
        pool_sync: poolSync
      };
    }
  
    // 📊 Méthodes d'analyse avancées
    async getComprehensiveStats(): Promise<{
      dashboard: DashboardAPI;
      stats: StatsAPI;
      participant_stats: any;
      transaction_stats: any;
      system_status: any;
    }> {
      const [dashboard, stats, participantStats, transactionStats, systemStatus] = await Promise.all([
        this.getDashboard(),
        this.getStats(),
        this.getParticipantStats(),
        this.getTransactionStats(),
        this.getSystemStatus()
      ]);
  
      return {
        dashboard,
        stats,
        participant_stats: participantStats,
        transaction_stats: transactionStats,
        system_status: systemStatus
      };
    }
  
    // 🎯 Méthodes de recherche et filtrage
    async searchLotteries(filters: {
      status?: string;
      lottery_type?: string;
      page?: number;
      page_size?: number;
    }): Promise<LotteryResponse> {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) params.append(key, value.toString());
      });
      return this.request(`/api/v1/lotteries/?${params}`);
    }
  
    async searchWinners(filters: {
      wallet_address?: string;
      lottery_type?: string;
      payout_status?: string;
      page?: number;
      page_size?: number;
    }): Promise<WinnerResponse> {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) params.append(key, value.toString());
      });
      return this.request(`/api/v1/winners/?${params}`);
    }
  
    async searchTransactions(filters: {
      wallet_address?: string;
      transaction_type?: string;
      page?: number;
      page_size?: number;
    }): Promise<TransactionResponse> {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) params.append(key, value.toString());
      });
      return this.request(`/api/v1/transactions/?${params}`);
    }
  
    // 🔧 Méthodes d'administration (sans restriction d'auth)
    async adminExecuteLottery(id: number): Promise<{ success: string; winner: string }> {
      return this.executeLottery(id);
    }
  
    async adminPayWinner(id: number): Promise<{ success: string }> {
      return this.payWinner(id);
    }
  
    async adminUpdateConfig(key: string, value: any, description = ''): Promise<any> {
      return this.updateConfig(key, value, description);
    }
  
    async adminTriggerFullSync(): Promise<any> {
      return this.fullSystemSync();
    }
  
    // 🎮 Méthodes de jeu pour les utilisateurs
    async getMyLotteryData(walletAddress: string): Promise<{
      holdings: TokenHoldingAPI;
      wins: WinnerAPI[];
      transactions: TransactionAPI[];
      wallet_info: WalletInfoAPI;
      participation_history: any;
    }> {
      const [holdings, wins, transactions, walletInfo, participationHistory] = await Promise.all([
        this.getMyHoldings(walletAddress),
        this.getMyWins(walletAddress),
        this.getMyTransactions(walletAddress),
        this.getWalletInfo(walletAddress),
        this.getParticipationHistory(walletAddress)
      ]);
  
      return {
        holdings,
        wins,
        transactions,
        wallet_info: walletInfo,
        participation_history: participationHistory
      };
    }
  
    // 📱 Méthodes pour l'interface mobile
    async getMobileData(): Promise<{
      current_lottery: LotteryAPI | null;
      jackpots: JackpotPoolAPI[];
      recent_winners: WinnerAPI[];
      leaderboard: TokenHoldingAPI[];
      stats: StatsAPI;
    }> {
      const [currentLottery, jackpots, recentWinners, leaderboard, stats] = await Promise.all([
        this.getCurrentLottery(),
        this.getCurrentPools(),
        this.getRecentWinners(3),
        this.getLeaderboard(),
        this.getStats()
      ]);
  
      return {
        current_lottery: currentLottery,
        jackpots,
        recent_winners: recentWinners,
        leaderboard: leaderboard.slice(0, 5),
        stats
      };
    }
  }
  
  // 🎯 INSTANCE & EXPORTS
  export const api = new LotteryAPIService();
  export default api;
  
  // Exports de convenance pour les méthodes les plus utilisées
  export const getWalletInfo = api.getWalletInfo.bind(api);
  export const getDashboard = api.getDashboard.bind(api);
  export const getJackpots = api.getJackpots.bind(api);
  export const getCurrentLottery = api.getCurrentLottery.bind(api);
  export const getStats = api.getStats.bind(api);
  export const syncWallet = api.syncWallet.bind(api);
  export const getLotteryState = api.getLotteryState.bind(api);
  export const getMyLotteryData = api.getMyLotteryData.bind(api);
  export const getMobileData = api.getMobileData.bind(api);
  
  // 🔄 Auto-refresh token si nécessaire
  if (typeof window !== 'undefined') {
    setInterval(async () => {
      try {
        const isValid = await api.verifyToken();
        if (!isValid && localStorage.getItem('refresh_token')) {
          await api.refreshToken();
        }
      } catch (error) {
        console.warn('Token refresh failed:', error);
      }
    }, 5 * 60 * 1000); // Vérification toutes les 5 minutes
  }
  
