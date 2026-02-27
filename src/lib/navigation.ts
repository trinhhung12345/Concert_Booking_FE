// Simple global navigation helper so non-React code (like axios interceptors)
// can trigger client-side navigation without reloading the page.

let navigateFn: ((path: string) => void) | null = null;

export const setNavigator = (fn: (path: string) => void) => {
  navigateFn = fn;
};

export const navigateTo = (path: string) => {
  if (navigateFn) {
    navigateFn(path);
  } else {
    // Fallback if navigator chưa sẵn sàng
    window.location.href = path;
  }
};
