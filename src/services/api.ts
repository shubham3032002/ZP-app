// Use Vite's same-origin proxy in development so browsers on the LAN do not
// send cross-origin preflight requests to the API. Production builds continue
// to use the configured backend URL (and Capacitor's native HTTP bridge).
const API_BASE_URL = import.meta.env.DEV
  ? '/api'
  : import.meta.env.VITE_API_URL;

const TOKEN_KEY = 'sahakar_coop_auth_token_v1';

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {

  const token = getToken();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  let body: any = null;

  try {
    body = await res.json();
  } catch {}

  if (!res.ok) {
    throw new ApiError(
      body?.message ||
      `Request failed with status ${res.status}`,
      res.status
    );
  }

  return body as T;
}

export interface SocietyResponse {
  name: string;
  regNo: string;
  regNoMarathi: string;
  address: string;
  location: string;
  contactNo: string;
  email: string;
}

export interface DashboardResponse {
  profile?: {
    id?: string;
    name?: string;
    email?: string;
    phone?: string;
    cifNumber?: string;
    memberNumber?: string | null;
    memberSince?: string | null;
    panNumber?: string | null;
    kycVerified?: boolean;
    [key: string]: any;
  };

  society?: SocietyResponse;
  accounts?: any[];

  balances?: {
    total_balance?: number;
    updated_at?: string;
  };

  shares?: {
    memberNumber?: string | null;
    numberOfShares?: number;
    faceValuePerShare?: number;
    totalShareCapital?: number;
    shareFolioNumber?: string;
    membershipDate?: string | null;
    ledger?: any[];
    [key: string]: any;
  };

  loans?: any[];
  deposits?: any[];
  transactions?: any[];
}

// Shape returned by BalanceHubController::accountTransactions() and
// ::loanTransactions() — both endpoints return this same envelope, just
// with a different "transactions" row shape inside (deposit rows vs.
// loan rows with principal/interest breakdown).
export interface AccountLedgerResponse {
  success: boolean;
  accountId: string;
  transactions: any[];
}

export const api = {

  login: async (username: string, password: string) => {
    const result = await request<{ token: string; custno: string; memno: string | null }>('/login', {
      method: 'POST',
      body: JSON.stringify({
        username,
        password,
      }),
    });
    setToken(result.token);
    return result;
  },

  logout: async () => {
    try {
      await request<{ message: string }>('/logout', {
        method: 'POST',
      });
    } finally {
      clearToken();
    }
  },

  me: () => request<any>('/me'),

  dashboard: () =>
    request<DashboardResponse>('/dashboard'),

  // Full, uncapped ledger for ONE deposit account (savings/pigmy/RD/FD).
  // id is the "SSCODE-ACNO" key, e.g. "401-24" — matches account.id as
  // returned in DashboardResponse.accounts[].
  accountTransactions: (id: string) =>
    request<AccountLedgerResponse>(
      `/accounts/${encodeURIComponent(id)}/transactions`
    ),

  // Full, uncapped ledger for ONE loan account, grouped by voucher
  // (date + setno) with principal/interest split. id is the
  // "SSCODE-ACNO" key, e.g. "200-1091" — matches loan.id as returned in
  // DashboardResponse.loans[].
  loanTransactions: (id: string) =>
    request<AccountLedgerResponse>(
      `/loans/${encodeURIComponent(id)}/transactions`
    ),
};
