/*
 * hexo theme meow
 * menu (header) scripts
 */

const initMenu = () => {
  const headerElement = document.querySelector('header');

  // 仅在页面存在原版 header 时执行
  if (headerElement) {
    const scroll_y =
      window.scrollY ||
      window.pageYOffset ||
      document.body.scrollTop;

    const bg_color =
      document.body.getAttribute('data-mode') == 'light'
        ? 'rgba(255,255,255,0.8)'
        : 'rgba(45, 45, 45, 0.85)';

    let new_color = 'transparent';

    if (scroll_y < window.innerHeight * 0.6) {
      headerElement.setAttribute('custom', '');
    } else {
      headerElement.removeAttribute('custom');
      new_color = bg_color;
    }

    requestAnimationFrame(() => {
      headerElement.style.background = new_color;
    });
  }

  // 原版 Meow 手机菜单（如果存在才初始化）
  const menuAside = document.getElementById('menu-aside');
  const menuBtn = document.getElementById('menu-btn');

  if (menuAside && menuBtn) {
    menuBtn.addEventListener('click', () => {
      menuAside.setAttribute('open', '');
    });

    menuAside.addEventListener('click', event => {
      if (event.target === menuAside) {
        menuAside.removeAttribute('open');
      }
    });
  }
};

export default initMenu;