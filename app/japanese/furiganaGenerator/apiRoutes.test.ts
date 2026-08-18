/// <reference types="vitest/globals" />
import { ENV } from '../../infra/env';
import { getChorusSeparatorsUrl, getFuriganaTransformationUrl } from './apiRoutes';

describe('getFuriganaTransformationUrl', () => {
  it('points at the Cloud Run furigana service in prod', () => {
    expect(getFuriganaTransformationUrl(ENV.PROD)).toBe(
      'https://jeffdotskifuriganaserver-176879653026.us-east1.run.app/furiganaTransformation',
    );
  });

  it('uses the relative, vite-proxied path in dev', () => {
    expect(getFuriganaTransformationUrl(ENV.DEV)).toBe('/furiganaTransformation');
  });

  it('falls back to the relative path for any other environment', () => {
    expect(getFuriganaTransformationUrl('test')).toBe('/furiganaTransformation');
  });
});

describe('getChorusSeparatorsUrl', () => {
  it('points at the Cloud Run furigana service in prod', () => {
    expect(getChorusSeparatorsUrl(ENV.PROD)).toBe(
      'https://jeffdotskifuriganaserver-176879653026.us-east1.run.app/chorusSeparators',
    );
  });

  it('uses the relative, vite-proxied path in dev', () => {
    expect(getChorusSeparatorsUrl(ENV.DEV)).toBe('/chorusSeparators');
  });

  it('falls back to the relative path for any other environment', () => {
    expect(getChorusSeparatorsUrl('test')).toBe('/chorusSeparators');
  });
});
