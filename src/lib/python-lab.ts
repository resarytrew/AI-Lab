export type PythonRuntimeState = 'idle' | 'loading' | 'ready' | 'running' | 'error';

export type PythonTestResult = {
  name: string;
  passed: boolean;
  detail: string;
};

export type PythonRunResult = {
  ok: boolean;
  stdout: string;
  stderr: string;
  result: string;
  traceback?: string;
  tests: PythonTestResult[];
  testsPassed?: boolean;
  durationMs: number;
};

type RuntimeResponse = PythonRunResult & {
  id: number;
  type: 'ready' | 'result';
  pythonVersion?: string;
};

type PendingRequest = {
  resolve: (value: RuntimeResponse) => void;
  reject: (reason?: unknown) => void;
  timeout: ReturnType<typeof setTimeout>;
};

export function buildReferenceSource(starterCode: string, expected: string) {
  if (!starterCode.includes('...')) return starterCode;
  return starterCode.replace('...', expected);
}

export function resolvePythonWorkerUrl(location: Pick<Location, 'hostname' | 'origin' | 'pathname'>) {
  const firstPathSegment = location.pathname.split('/').filter(Boolean)[0];
  const pagesBasePath = location.hostname.endsWith('github.io') && firstPathSegment ? `/${firstPathSegment}` : '';
  return `${location.origin}${pagesBasePath}/pyodide-worker.mjs`;
}

export class PythonLabClient {
  private worker: Worker;
  private requestId = 0;
  private pending = new Map<number, PendingRequest>();

  constructor(workerUrl: string) {
    this.worker = new Worker(workerUrl, {type: 'module', name: 'ai-lab-python'});
    this.worker.addEventListener('message', this.handleMessage);
    this.worker.addEventListener('error', this.handleWorkerError);
  }

  private handleMessage = (event: MessageEvent<RuntimeResponse>) => {
    const request = this.pending.get(event.data.id);
    if (!request) return;
    clearTimeout(request.timeout);
    this.pending.delete(event.data.id);
    request.resolve(event.data);
  };

  private handleWorkerError = (event: ErrorEvent) => {
    const error = new Error(event.message || 'Python worker crashed.');
    for (const request of this.pending.values()) {
      clearTimeout(request.timeout);
      request.reject(error);
    }
    this.pending.clear();
  };

  private send(payload: Record<string, unknown>, timeoutMs: number) {
    const id = ++this.requestId;
    return new Promise<RuntimeResponse>((resolve, reject) => {
      const timeout = setTimeout(() => {
        this.pending.delete(id);
        this.terminate();
        reject(new Error('PYTHON_TIMEOUT'));
      }, timeoutMs);

      this.pending.set(id, {resolve, reject, timeout});
      this.worker.postMessage({...payload, id});
    });
  }

  async init() {
    return this.send({type: 'init'}, 45_000);
  }

  async run(code: string) {
    return this.send({type: 'run', code}, 7_000);
  }

  async test(code: string, referenceCode: string) {
    return this.send({type: 'test', code, referenceCode}, 7_000);
  }

  terminate() {
    this.worker.removeEventListener('message', this.handleMessage);
    this.worker.removeEventListener('error', this.handleWorkerError);
    this.worker.terminate();
    for (const request of this.pending.values()) {
      clearTimeout(request.timeout);
    }
    this.pending.clear();
  }
}
