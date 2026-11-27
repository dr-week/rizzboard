export type CleanupFn = () => void;

interface ReactiveNode {
  dependencies: Set<Subscribable>;
  isStale: boolean;
  execute: () => void;
}

interface Subscribable {
  _unsubscribe(node: ReactiveNode): void;
}

let activeObserver: ReactiveNode | null = null;
const pendingQueue = new Set<ReactiveNode>();
let batchDepth = 0;

function setActiveObserver(next: ReactiveNode | null): ReactiveNode | null {
  const prev = activeObserver;
  activeObserver = next;
  return prev;
}

function scheduleNode(node: ReactiveNode): void {
  node.isStale = true;
  if (batchDepth > 0) {
    pendingQueue.add(node);
  } else {
    node.execute();
  }
}

export function batch<T>(fn: () => T): T {
  batchDepth++;
  try {
    return fn();
  } finally {
    batchDepth--;
    if (batchDepth === 0) {
      while (pendingQueue.size > 0) {
        const snapshot = Array.from(pendingQueue);
        pendingQueue.clear();
        for (const item of snapshot) {
          if (item.isStale) item.execute();
        }
      }
    }
  }
}

export class Signal<T> implements Subscribable {
  private _value: T;
  private _subscribers = new Set<ReactiveNode>();

  constructor(initial: T) {
    this._value = initial;
  }

  get value(): T {
    if (activeObserver) {
      this._subscribers.add(activeObserver);
      activeObserver.dependencies.add(this);
    }
    return this._value;
  }

  set value(next: T) {
    if (!Object.is(this._value, next)) {
      this._value = next;
      const subs = Array.from(this._subscribers);
      for (const s of subs) scheduleNode(s);
    }
  }

  peek(): T {
    return this._value;
  }

  _unsubscribe(node: ReactiveNode): void {
    this._subscribers.delete(node);
  }
}

export function signal<T>(initial: T): Signal<T> {
  return new Signal(initial);
}

export class Computed<T> implements Subscribable {
  private _value!: T;
  private _isDirty = true;
  private _subscribers = new Set<ReactiveNode>();
  private _node: ReactiveNode;

  constructor(private readonly _fn: () => T) {
    this._node = {
      dependencies: new Set(),
      isStale: true,
      execute: () => {
        if (!this._isDirty) {
          this._isDirty = true;
          for (const sub of Array.from(this._subscribers)) {
            scheduleNode(sub);
          }
        }
      }
    };
  }

  get value(): T {
    if (this._isDirty) this._recompute();
    if (activeObserver) {
      this._subscribers.add(activeObserver);
      activeObserver.dependencies.add(this);
    }
    return this._value;
  }

  private _recompute(): void {
    for (const dep of this._node.dependencies) dep._unsubscribe(this._node);
    this._node.dependencies.clear();
    const prev = setActiveObserver(this._node);
    try {
      this._value = this._fn();
      this._isDirty = false;
      this._node.isStale = false;
    } finally {
      setActiveObserver(prev);
    }
  }

  _unsubscribe(node: ReactiveNode): void {
    this._subscribers.delete(node);
  }
}

export function computed<T>(fn: () => T): Computed<T> {
  return new Computed(fn);
}

export function effect(fn: () => void | CleanupFn): CleanupFn {
  let cleanup: void | CleanupFn;
  const node: ReactiveNode = {
    dependencies: new Set(),
    isStale: false,
    execute: () => {
      for (const dep of node.dependencies) dep._unsubscribe(node);
      node.dependencies.clear();
      if (typeof cleanup === 'function') cleanup();
      const prev = setActiveObserver(node);
      try {
        cleanup = fn();
      } finally {
        setActiveObserver(prev);
        node.isStale = false;
      }
    }
  };
  node.execute();
  return () => {
    for (const dep of node.dependencies) dep._unsubscribe(node);
    node.dependencies.clear();
    if (typeof cleanup === 'function') cleanup();
  };
}
