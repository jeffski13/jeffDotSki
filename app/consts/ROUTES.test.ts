import ROUTES from './ROUTES';
import fs from 'fs';
import path from 'path';

describe('ROUTES vs firebase rewrites', () => {
  it('all non-external routes appear in firebase.json rewrites sources', () => {
    const firebasePath = path.resolve(__dirname, '../../firebaseski/firebase.json');
    const raw = fs.readFileSync(firebasePath, 'utf8');
    const firebaseJson = JSON.parse(raw);

    const rewrites: Array<{ source: string; destination?: string }> = firebaseJson.hosting?.rewrites || [];
    const sources = rewrites.map(r => r.source);

    // Flatten ROUTES but exclude the 'external' key
    const collectRoutes = (obj: any): string[] => {
      const out: string[] = [];
      Object.keys(obj).forEach(k => {
        if (k === 'external') {
            return;
        }
        const val = obj[k];
        if (typeof val === 'string'){ 
            out.push(val);
        }
        else if (typeof val === 'object' && val !== null) {
            out.push(...collectRoutes(val));
        }
      });
      return out;
    };

    const routeList = collectRoutes(ROUTES);
    // Ensure every route is present in firebase rewrites
    routeList.forEach(route => {
      expect(sources).toContain(route);
    });
  });
});
