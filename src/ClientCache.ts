class ClientCache {
  private static instance: ClientCache;
  public _cache: Map<string, LocalForage>;
  public readonly events: Record<string, Array<() => void>>;

  private constructor() {
    this._cache = new Map<string, LocalForage>();
    this.events = {};
  }

  public static getInstance(): ClientCache {
    if (!ClientCache.instance) {
      ClientCache.instance = new ClientCache();
    }
    return ClientCache.instance;
  }

  public addCache(key: string, cache: LocalForage): void {
    this._cache.set(key, cache);
    this.triggerEvent('change');
  }

  public getCache(key: string): LocalForage | undefined {
    return this._cache.get(key);
  }

  public hasCache(key: string): boolean {
    return this._cache.has(key);
  }

  public removeCache(key: string): void {
    this._cache.delete(key);
    this.triggerEvent('change');
  }

  public addEventListener(event: string, listener: () => void): void {
    if (typeof this.events[event] !== 'object') {
      this.events[event] = [];
    }

    this.events[event].push(listener);
  }

  public removeEventListener(event: string, listener: () => void): void {
    if (typeof this.events[event] === 'object') {
      const idx = this.events[event].indexOf(listener);

      if (idx > -1) {
        this.events[event].splice(idx, 1);
      }
    }
  }

  private triggerEvent(event: string): void {
    if (typeof this.events[event] === 'object') {
      this.events[event].forEach((listener) => {
        try {
          listener.call(this);
        } catch (e) {
          console.error(e);
        }
      });
    }
  }
}

export default ClientCache.getInstance();
