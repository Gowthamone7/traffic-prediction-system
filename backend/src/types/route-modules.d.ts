// src/types/route-modules.d.ts
// Local module declarations for route files so TypeScript recognizes their default export.
import { Router } from 'express';

declare module './routes/traffic.routes' {
  const router: Router;
  export default router;
}

declare module './routes/prediction.routes' {
  const router: Router;
  export default router;
}

declare module './routes/route.routes' {
  const router: Router;
  export default router;
}

declare module './routes/analytics.routes' {
  const router: Router;
  export default router;
}
