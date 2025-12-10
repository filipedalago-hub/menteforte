interface StorageItem<T> {
  data: T;
  timestamp: number;
  version: string;
}

class LocalStorageService {
  private readonly prefix = 'mentes_';
  private readonly version = '1.0.0';

  private getKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  set<T>(key: string, value: T): void {
    try {
      const item: StorageItem<T> = {
        data: value,
        timestamp: Date.now(),
        version: this.version,
      };
      localStorage.setItem(this.getKey(key), JSON.stringify(item));
    } catch (error) {
      console.error('[Storage] Error saving to localStorage:', error);
    }
  }

  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(this.getKey(key));
      if (!item) return null;

      const parsed: StorageItem<T> = JSON.parse(item);

      if (parsed.version !== this.version) {
        this.remove(key);
        return null;
      }

      return parsed.data;
    } catch (error) {
      console.error('[Storage] Error reading from localStorage:', error);
      return null;
    }
  }

  remove(key: string): void {
    try {
      localStorage.removeItem(this.getKey(key));
    } catch (error) {
      console.error('[Storage] Error removing from localStorage:', error);
    }
  }

  clear(): void {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach((key) => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('[Storage] Error clearing localStorage:', error);
    }
  }

  has(key: string): boolean {
    return localStorage.getItem(this.getKey(key)) !== null;
  }
}

export const storage = new LocalStorageService();

interface ActionLog {
  action: string;
  timestamp: number;
  userId: string;
  metadata?: any;
}

class ActionLogService {
  private readonly maxLogs = 1000;
  private readonly storageKey = 'action_logs';

  private getLogs(): ActionLog[] {
    return storage.get<ActionLog[]>(this.storageKey) || [];
  }

  private saveLogs(logs: ActionLog[]): void {
    storage.set(this.storageKey, logs.slice(-this.maxLogs));
  }

  log(action: string, userId: string, metadata?: any): void {
    const logs = this.getLogs();
    logs.push({
      action,
      userId,
      timestamp: Date.now(),
      metadata,
    });
    this.saveLogs(logs);
  }

  hasActionInTimeWindow(
    action: string,
    userId: string,
    windowMs: number
  ): boolean {
    const logs = this.getLogs();
    const now = Date.now();

    return logs.some(
      (log) =>
        log.action === action &&
        log.userId === userId &&
        now - log.timestamp < windowMs
    );
  }

  getActionCount(action: string, userId: string, sinceTimestamp?: number): number {
    const logs = this.getLogs();
    const since = sinceTimestamp || 0;

    return logs.filter(
      (log) =>
        log.action === action &&
        log.userId === userId &&
        log.timestamp >= since
    ).length;
  }

  clear(userId?: string): void {
    if (userId) {
      const logs = this.getLogs().filter((log) => log.userId !== userId);
      this.saveLogs(logs);
    } else {
      storage.remove(this.storageKey);
    }
  }
}

export const actionLog = new ActionLogService();
