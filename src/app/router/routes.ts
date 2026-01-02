export interface AppRoute {
  key: string;
  path: string;
  titleKey: string;
}

export const APP_ROUTES: AppRoute[] = [
  { key: 'dashboard', path: '/', titleKey: 'dashboard' },
  { key: 'users', path: '/users', titleKey: 'users' },
  { key: 'settings', path: '/settings', titleKey: 'settings' }
];
