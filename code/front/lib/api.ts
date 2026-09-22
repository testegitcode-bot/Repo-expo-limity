// Endereço do backend Spring Boot. Para mudar, crie code/front/.env.local com
// NEXT_PUBLIC_API_URL=http://localhost:PORTA e reinicie o `npm run dev`.
export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  points: number;
  cashback: number;
  preferences: string[];
}

export interface AuthResponse {
  accessToken: string;
  tokenType: "Bearer";
  expiresAt: string;
  user: AuthUser;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export type Transport = "AVIAO" | "ONIBUS";

export interface SearchPayload {
  budget: number;
  origin: string;
  departureDate: string; // YYYY-MM-DD
  preferences: string[];
  sort?: "best" | "price";
  limit?: number;
}

export interface DestinationImage {
  url: string;
  photographer: string | null;
  photographerUrl: string | null;
  sourceUrl: string | null;
}

export interface DestinationView {
  id: string;
  name: string;
  state: string;
  tags: string[];
  flightTo: string | null;
  image: DestinationImage | null;
}

export interface FlightView {
  pricePerPerson: number;
  airline: string | null;
  flightNumber: string | null;
  departureAt: string;
  returnAt: string;
  transfers: number | null;
  dateMatch: "EXACT" | "NEAR";
  bookingUrl: string | null;
}

export interface BusView {
  distanceKm: number;
  hours: number;
  estimated: boolean;
}

export interface HotelView {
  id: string;
  name: string;
  stars: number | null;
  rating: number | null;
  photoUrl: string | null;
  address: string | null;
  pricePerNight: number;
  total: number;
}

export interface TripOption {
  destination: DestinationView;
  transport: Transport;
  flight: FlightView | null;
  bus: BusView | null;
  hotel: HotelView | null;
  checkIn: string;
  checkOut: string;
  nights: number;
  transportCost: number;
  hotelCost: number | null;
  totalCost: number;
  budgetLeft: number;
  complete: boolean;
}

export interface SearchResponse {
  origin: {
    query: string;
    iata: string;
    hubName: string;
    exact: boolean;
    distanceToHubKm: number;
  };
  budget: number;
  adults: number;
  options: TripOption[];
  totalFound: number;
  warnings: string[];
  providers: Record<string, string>;
}

export class ApiError extends Error {}

interface ProblemDetail {
  detail?: string;
  errors?: Record<string, string>;
}

async function parseApiError(response: Response): Promise<ApiError> {
  const problem: ProblemDetail | null = await response.json().catch(() => null);
  const fieldErrors = problem?.errors ? Object.values(problem.errors).join(" ") : "";
  return new ApiError(fieldErrors || problem?.detail || "Não foi possível concluir a operação.");
}

async function request<T>(path: string, init: RequestInit = {}, token?: string): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...init.headers,
      },
    });
  } catch {
    throw new ApiError(
      "Não conseguimos falar com o servidor do Limity. Confira se o backend está rodando.",
    );
  }

  if (!response.ok) {
    throw await parseApiError(response);
  }
  return response.json() as Promise<T>;
}

export function register(payload: RegisterPayload): Promise<AuthResponse> {
  return request<AuthResponse>("/api/v1/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function login(payload: LoginPayload): Promise<AuthResponse> {
  return request<AuthResponse>("/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getCurrentUser(token: string): Promise<AuthUser> {
  return request<AuthUser>("/api/v1/auth/me", { method: "GET" }, token);
}

export function updatePreferences(token: string, preferences: string[]): Promise<AuthUser> {
  return request<AuthUser>("/api/v1/auth/preferences", {
    method: "PUT",
    body: JSON.stringify({ preferences }),
  }, token);
}

export interface PasswordRecoveryPayload {
  email: string;
  newPassword: string;
}

export function recoverPassword(payload: PasswordRecoveryPayload): Promise<void> {
  return request<void>("/api/v1/auth/recover-password", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function searchTrips(
  payload: SearchPayload,
  signal?: AbortSignal,
): Promise<SearchResponse> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}/api/v1/search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw error;
    }
    throw new ApiError(
      "Não conseguimos falar com o servidor do Limity. Confira se o backend está rodando.",
    );
  }

  if (!response.ok) {
    throw await parseApiError(response);
  }
  return response.json();
}
