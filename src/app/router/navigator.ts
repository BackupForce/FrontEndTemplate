import type { NavigateFunction, NavigateOptions, To } from 'react-router-dom';

let navigateRef: NavigateFunction | null = null;

export const setNavigator = (navigateFn: NavigateFunction): void => {
  navigateRef = navigateFn;
};

export const navigate = (to: To, options?: NavigateOptions): void => {
  if (navigateRef) {
    navigateRef(to, options);
  }
};
