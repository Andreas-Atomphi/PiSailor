type ObserverCallback<T extends any> = (data?: T) => void;

class Observer<T extends any> {
  private subscriptions: {callback: ObserverCallback<T>, oneShot: boolean}[] = [];

  subscribe(callback: ObserverCallback<T>, oneShot: boolean = false): () => void {
    this.subscriptions.push({callback, oneShot});
    return () => this.unsubscribe(callback);
  }

  unsubscribe(callback: ObserverCallback<T>): void {
    this.subscriptions = this.subscriptions.filter((cb) => cb.callback !== callback);
  }

  notify(data?: T): void {
    for (const subscription of this.subscriptions) {
      subscription.callback(data);
    }
  }

  clear(): void {
    this.subscriptions = [];
  }
}

export default Observer;
