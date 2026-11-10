import { Component, type ErrorInfo, type ReactNode } from 'react';

type Props = { children: ReactNode };
type State = { error: Error | null };

/**
 * A stale chunk (deploy changed the bundle hashes while the tab was open) makes
 * `import()` reject, which unmounts the whole React tree and leaves a blank
 * page. This boundary catches that and offers a reload instead.
 *
 * It also guards against any other render-time crash so the visitor is never
 * left staring at an empty document.
 */
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Unhandled UI error:', error, info.componentStack);
  }

  private reload = () => {
    // `true` bypasses the bfcache so the new bundle is fetched.
    window.location.reload();
  };

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    const isChunkError =
      /Failed to fetch dynamically imported module|error loading dynamically imported module|Importing a module script failed/i.test(
        error.message,
      );

    return (
      <div className="flex min-h-[100svh] flex-col items-center justify-center gap-6 px-6 text-center">
        <div className="glass w-full max-w-md rounded-2xl p-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-brand">Something broke</p>
          <h1 className="mt-4 font-display text-3xl leading-tight text-bone">
            {isChunkError ? 'A new version is ready' : 'The episode stopped'}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-mist">
            {isChunkError
              ? 'This page was updated while your tab was open. Reload to pick up the latest version.'
              : 'An unexpected error occurred. Reloading usually fixes it.'}
          </p>
          <button
            type="button"
            onClick={this.reload}
            className="mt-6 flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-bone px-6 text-[15px] font-bold text-ink transition hover:bg-white"
          >
            ↺ Reload the page
          </button>
        </div>
      </div>
    );
  }
}
