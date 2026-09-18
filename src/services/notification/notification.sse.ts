import { SSEEvent } from "@/types/notification.types";

let API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
if (API_BASE.endsWith("/api")) API_BASE = API_BASE.slice(0, -4);
if (API_BASE.endsWith("/")) API_BASE = API_BASE.slice(0, -1);

const SSE_URL = `${API_BASE}/api/notifications/stream`;

const MIN_RECONNECT_DELAY = 1_000;  // 1 s
const MAX_RECONNECT_DELAY = 30_000; // 30 s

export type SSECallbacks = {
  onEvent: (event: SSEEvent) => void;
  onConnected?: () => void;
  onDisconnected?: () => void;
};

class NotificationSSEService {
  private abortController: AbortController | null = null;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private reconnectDelay = MIN_RECONNECT_DELAY;
  private active = false;
  private callbacks: SSECallbacks | null = null;
  private token: string | null = null;

  connect(token: string, callbacks: SSECallbacks) {
    this.token = token;
    this.callbacks = callbacks;
    this.active = true;
    this.reconnectDelay = MIN_RECONNECT_DELAY;
    this._startStream();
  }

  disconnect() {
    this.active = false;
    this._cleanup();
    this.callbacks?.onDisconnected?.();
  }

  private _cleanup() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
  }

  private async _startStream() {
    if (!this.active || !this.token) return;

    this._cleanup();
    this.abortController = new AbortController();

    console.debug("[SSE] Connecting to", SSE_URL);

    try {
      const response = await fetch(SSE_URL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.token}`,
          Accept: "text/event-stream",
          // Note: Do NOT add Cache-Control here — it triggers a CORS preflight
          // that the backend rejects. Authorization + Accept is sufficient for SSE.
        },
        signal: this.abortController.signal,
      });

      if (!response.ok || !response.body) {
        console.error("[SSE] Connect failed:", response.status, response.statusText);
        throw new Error(`SSE connect failed: ${response.status}`);
      }

      console.debug("[SSE] Connected ✅");
      this.callbacks?.onConnected?.();
      this.reconnectDelay = MIN_RECONNECT_DELAY; // reset on success

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // SSE frames are separated by double newlines
        const frames = buffer.split(/\n\n/);
        buffer = frames.pop() ?? ""; // keep incomplete frame

        for (const frame of frames) {
          const lines = frame.split("\n");
          let dataLine = "";
          for (const line of lines) {
            if (line.startsWith("data:")) {
              dataLine += line.slice(5).trim();
            }
          }
          if (!dataLine) continue;
          console.debug("[SSE] Raw frame:", dataLine);
          try {
            let parsed = JSON.parse(dataLine);
            // NestJS @Sse wraps payload in { data: { ... } } on the wire —
            // handle both flat { type, ... } and nested { data: { type, ... } }
            if (parsed && typeof parsed === "object" && !parsed.type && parsed.data) {
              parsed = parsed.data;
            }
            console.debug("[SSE] Event:", parsed);
            this.callbacks?.onEvent(parsed as SSEEvent);
          } catch (err) {
            console.warn("[SSE] Failed to parse frame:", dataLine, err);
          }
        }
      }

      // Stream ended normally — reconnect
      console.debug("[SSE] Stream ended, reconnecting...");
      this._scheduleReconnect();
    } catch (err: any) {
      if (err?.name === "AbortError") return; // intentional disconnect
      console.warn("[SSE] Error, reconnecting in", this.reconnectDelay, "ms", err?.message);
      this._scheduleReconnect();
    }
  }

  private _scheduleReconnect() {
    if (!this.active) return;
    this.reconnectTimer = setTimeout(() => {
      this.reconnectDelay = Math.min(
        this.reconnectDelay * 2,
        MAX_RECONNECT_DELAY
      );
      this._startStream();
    }, this.reconnectDelay);
  }
}

// Singleton so the connection survives re-renders
export const notificationSSEService = new NotificationSSEService();
