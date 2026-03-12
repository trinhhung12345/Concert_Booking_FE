// Simple global navigation helper so non-React code (like axios interceptors)
// can trigger client-side navigation without reloading the page.

type NavigateOptions = {
  replace?: boolean;
};

let navigateFn: ((path: string, options?: NavigateOptions) => void) | null = null;

export const setNavigator = (fn: (path: string, options?: NavigateOptions) => void) => {
  navigateFn = fn;
};

export const navigateTo = (path: string, options?: NavigateOptions) => {
  if (navigateFn) {
    navigateFn(path, options);
  } else {
    // Fallback if navigator chưa sẵn sàng
    if (options?.replace) {
      window.location.replace(path);
    } else {
      window.location.href = path;
    }
  }
};
