import { ENV, getEnv } from '../../infra/env';

// In dev, relative path is proxied to the local furigana service by vite.config.ts,
// so requests stay same-origin and the browser never sends a CORS preflight. Firebase
// Hosting has no such proxy, so prod talks to the Cloud Run service directly.
export const getFuriganaTransformationUrl = (env: string): string =>
  env === ENV.PROD
    ? 'https://jeffdotskifuriganaserver-176879653026.us-east1.run.app/furiganaTransformation'
    : '/furiganaTransformation';

export const FURIGANA_TRANSFORMATION_URL = getFuriganaTransformationUrl(getEnv());
