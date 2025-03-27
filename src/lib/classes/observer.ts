type ObserverCallback<T extends any> = (data?: T) => void;

class Observer<T extends any> {
  private callbacks: ObserverCallback<T>[] = [];

  subscribe(callback: ObserverCallback<T>): () => void {
    this.callbacks.push(callback);
    return () => this.unsubscribe(callback);
  }

  unsubscribe(callback: ObserverCallback<T>): void {
    this.callbacks = this.callbacks.filter((cb) => cb !== callback);
  }

  notify(data?: T): void {
    for (const callback of this.callbacks) {
      callback(data);
    }
  }

  clear(): void {
    this.callbacks = [];
  }
}

export default Observer;
