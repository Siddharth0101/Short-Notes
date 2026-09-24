// Run before the app and styles load so a saved dark theme does not flash white.
(() => {
  let preference = 'system';
  try {
    const saved = localStorage.getItem('shortnotes.theme');
    if (saved === 'light' || saved === 'dark') preference = saved;
  } catch { /* System preference still works when storage is blocked. */ }
  const dark = preference === 'dark' || (preference === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  const theme = dark ? 'dark' : 'light';
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#10121b' : '#f7f7fb');
})();
