import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import type { IMessage, StompSubscription } from "@stomp/stompjs";
import { useNotificationStore, type EventNotification } from "@/store/useNotificationStore";

// Helper: build WebSocket endpoint
function getWebSocketUrl(): string {
  const explicit = import.meta.env.VITE_WS_URL as string | undefined;
  if (explicit) return explicit;

  // Fallback: derive from API URL, strip trailing /api if present
  const apiUrl = import.meta.env.VITE_API_URL as string | undefined;
  if (!apiUrl) {
    // As a last resort, use current origin
    return `${window.location.origin.replace(/^http/, "http")}/ws`;
  }

  try {
    const url = new URL(apiUrl);
    // Remove common "/api" suffix
    if (url.pathname.endsWith("/api")) {
      url.pathname = url.pathname.replace(/\/api$/, "");
    }
    url.pathname = (url.pathname.replace(/\/$/, "")) + "/ws";
    return url.toString();
  } catch {
    return `${apiUrl.replace(/\/$/, "")}/ws`;
  }
}

export type UserRoleName = "USER" | "ADMIN" | "SUPER_ADMIN" | "SUPERADMIN" | "GUEST" | string;

function getTopicsForRole(roleName?: UserRoleName | null): string[] {
  const normalized = (roleName || "GUEST").toUpperCase();

  if (normalized === "SUPER_ADMIN" || normalized === "SUPERADMIN") {
    // Super admin topic
    return ["/topic/events/super-admins"];
  }

  // Normal users / guests / admins
  return ["/topic/events/users"];
}

export interface ConnectOptions {
  roleName?: UserRoleName | null;
  accessToken?: string | null;
  /** Optional callbacks for additional side effects (e.g. toast) */
  onMessage?: (notification: EventNotification) => void;
}

class EventNotificationSocketService {
  private client: Client | null = null;
  private subscriptions: StompSubscription[] = [];
  private connected = false;
  private currentRoleKey: string | null = null;
  private currentToken: string | null = null;
  private listeners: Array<(n: EventNotification) => void> = [];

  private buildClient(wsUrl: string, accessToken?: string | null): Client {
    const headers: Record<string, string> = {};
    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }

    const client = new Client({
      webSocketFactory: () => new SockJS(wsUrl),
      connectHeaders: headers,
      // Try to auto reconnect
      reconnectDelay: 5000,
      debug: () => {
        // silent in production; can add console.log here when debugging
      },
    });

    client.onConnect = () => {
      this.connected = true;
      this.resubscribe();
    };

    client.onStompError = () => {
      // Broker error; keep reconnectDelay handling
    };

    client.onWebSocketClose = () => {
      this.connected = false;
      this.subscriptions = [];
    };

    return client;
  }

  private ensureClient(accessToken?: string | null) {
    if (!this.client) {
      const wsUrl = getWebSocketUrl();
      this.client = this.buildClient(wsUrl, accessToken);
      this.client.activate();
    }
  }

  private messageHandler = (message: IMessage) => {
    try {
      const body = JSON.parse(message.body || "{}");

      const eventId: number | string = body.eventId ?? body.id;
      const title: string = body.title ?? "Sự kiện mới";
      const msg: string = body.message ?? "Sự kiện mới ra mắt";
      const createdAt: string = body.createdAt ?? new Date().toISOString();

      const notification: EventNotification = {
        id: `${eventId}-${Date.now()}`,
        eventId,
        title,
        message: msg,
        createdAt,
        read: false,
      };

      // Push into global store
      const store = useNotificationStore.getState();
      store.addNotification(notification);

      // Notify listeners (e.g. to show toast)
      this.listeners.forEach((cb) => cb(notification));
    } catch (err) {
      // Ignore malformed messages
      console.error("Failed to parse notification message", err);
    }
  };

  private resubscribe() {
    if (!this.client || !this.connected) return;

    // Clear previous subscriptions
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.subscriptions = [];

    const topics = getTopicsForRole(this.currentRoleKey || undefined);
    topics.forEach((topic) => {
      const sub = this.client!.subscribe(topic, this.messageHandler);
      this.subscriptions.push(sub);
    });
  }

  connect(options: ConnectOptions = {}) {
    const roleKey = (options.roleName || "GUEST").toUpperCase();
    const token = options.accessToken || null;

    // Keep listeners up to date
    if (options.onMessage) {
      this.addListener(options.onMessage);
    }

    // If we already have a client with same role & token, do nothing
    if (this.client && this.connected && this.currentRoleKey === roleKey && this.currentToken === token) {
      return;
    }

    this.currentRoleKey = roleKey;
    this.currentToken = token;

    // If client exists but role/token changed, disconnect first
    if (this.client) {
      this.disconnect();
    }

    this.ensureClient(token);
  }

  disconnect() {
    if (this.client) {
      try {
        this.subscriptions.forEach((sub) => sub.unsubscribe());
        this.subscriptions = [];
        this.client.deactivate();
      } catch {
        // ignore
      }
    }
    this.client = null;
    this.connected = false;
    this.currentRoleKey = null;
    this.currentToken = null;
  }

  addListener(listener: (n: EventNotification) => void) {
    this.listeners.push(listener);
  }

  removeListener(listener: (n: EventNotification) => void) {
    this.listeners = this.listeners.filter((l) => l !== listener);
  }

  isConnected() {
    return this.connected;
  }
}

export const eventNotificationSocketService = new EventNotificationSocketService();
