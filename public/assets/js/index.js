document.addEventListener('DOMContentLoaded', async () => {
  console.log(`loaded in ${Date.now() - performance.timing.navigationStart}ms`);

  const html = document.querySelector('html');
  const menu = document.querySelector('#menu');
  const drawer = document.querySelector('#drawer');

  const force_dark = document.querySelector('#force_dark');
  const force_light = document.querySelector('#force_light');
  const force_system = document.querySelector('#force_system');

  if (!html || !menu || !drawer || !force_dark || !force_light || !force_system) {
    throw new Error('Failed to find elements');
  }

  force_dark.addEventListener('click', () => {
    html.classList.remove('mdui-theme-light');
    html.classList.remove('mdui-theme-auto');
    html.classList.add('mdui-theme-dark');
  });

  force_light.addEventListener('click', () => {
    html.classList.remove('mdui-theme-dark');
    html.classList.remove('mdui-theme-auto');
    html.classList.add('mdui-theme-light');
  });

  force_system.addEventListener('click', () => {
    html.classList.remove('mdui-theme-dark');
    html.classList.remove('mdui-theme-light');
    html.classList.add('mdui-theme-auto');
  });

  menu.addEventListener('click', () => {
    drawer.setAttribute('open', '');
  });
});
