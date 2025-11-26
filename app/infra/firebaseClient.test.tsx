import { ENV } from './env';
import { shouldUseFirebase } from './firebaseClient';

describe('Dev Banner', () => {
  it('should not use firebase in dev', () => {
    expect(shouldUseFirebase(true, ENV.DEV)).toBe(false);
  });

  it('should not use firebase with no window', () => {
    const mockWindow = undefined;
    expect(shouldUseFirebase(mockWindow, ENV.PROD)).toBe(false);
  });
  
  it('should use firebase in prod', () => {
    const mockWindow = {};
    expect(shouldUseFirebase(mockWindow, ENV.PROD)).toBe(true);
  });
});