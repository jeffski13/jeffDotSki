import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAnalytics, logEvent, type Analytics } from 'firebase/analytics';

let analyticsInstance: Analytics | null = null;

export function initFirebase(config: Record<string, any>) {
  if (!config) return null;
  // Avoid double-initialization during HMR or multiple imports
  if (getApps().length === 0) {
    try {
      const app: FirebaseApp = initializeApp(config);
      // Analytics requires window (client-only)
      if (typeof window !== 'undefined') {
        try {
          analyticsInstance = getAnalytics(app);
        } catch (e) {
          // analytics may fail in some envs (e.g., blocked by adblockers)
          // swallow error to avoid crashing the app
          // eslint-disable-next-line no-console
          console.warn('Firebase Analytics initialization failed', e);
        }
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('Firebase initialization failed', e);
    }
  }

  return analyticsInstance;
}

export function logPageView(path?: string) {
  if (!analyticsInstance) return;
  try {
    logEvent(analyticsInstance, 'page_view', {
      page_location: typeof window !== 'undefined' ? window.location.href : path,
      page_path: path ?? (typeof window !== 'undefined' ? window.location.pathname : '/'),
    });
  } catch (e) {
    // swallow analytics errors
  }
}

export function logCustomEvent(name: string, params?: Record<string, any>) {
  if (!analyticsInstance) return;
  try {
    logEvent(analyticsInstance, name, params);
  } catch (e) {
    // ignore
  }
}
