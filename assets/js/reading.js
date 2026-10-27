/* Progressive article navigation: content remains usable without JavaScript. */
(() => {
  const article = document.querySelector('[data-reading-article]');
  if (!article) return;
  const zh = document.documentElement.lang.startsWith('zh');
  const sidebar = document.querySelector('[data-reading-sidebar]');
  const toc = document.querySelector('[data-reading-toc]');
  const progress = document.querySelector('[data-reading-progress]');
  const headings = [...article.querySelectorAll('.prose h2, .prose h3')];
  const links = [];
  const list = document.createElement('ul');
  headings.forEach((heading, index) => {
    if (!heading.id) {
      let id = `section-${index + 1}`;
      while (document.getElementById(id)) id += '-section';
      heading.id = id;
    }
    const item = document.createElement('li');
    item.classList.toggle('toc-subsection', heading.tagName === 'H3');
    const link = document.createElement('a');
    link.href = `#${encodeURIComponent(heading.id)}`;
    link.textContent = heading.textContent;
    link.addEventListener('click', () => { if (!wide.matches) toc.open = false; });
    item.append(link);
    list.append(item);
    links.push(link);
  });
  document.querySelector('[data-reading-links]').append(list);
  sidebar.hidden = headings.length < 2;
  document.querySelector('[data-reading-layout]').classList.toggle('has-toc', !sidebar.hidden);
  const wide = matchMedia('(min-width: 1100px)');
  const setToc = () => {
    toc.open = wide.matches;
    if (wide.matches) document.querySelector('[data-reading-layout]').append(sidebar);
    else article.querySelector('.post-heading').after(sidebar);
  };
  setToc();
  wide.addEventListener('change', setToc);
  toc.querySelector('summary').addEventListener('click', event => {
    if (wide.matches) event.preventDefault();
  });
  let queued = false;
  function update() {
    queued = false;
    const headerBottom = Math.max(0, document.querySelector('.site-header').getBoundingClientRect().bottom);
    document.documentElement.style.setProperty('--reading-header', `${headerBottom}px`);
    const rect = article.getBoundingClientRect();
    const available = Math.max(1, rect.height - (innerHeight - headerBottom));
    const fraction = Math.min(1, Math.max(0, (headerBottom - rect.top) / available));
    progress.firstElementChild.style.transform = `scaleX(${fraction})`;
    let current = -1;
    headings.forEach((heading, index) => {
      if (heading.getBoundingClientRect().top <= headerBottom + 48) current = index;
    });
    links.forEach((link, index) => {
      if (index === current) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }
  const schedule = () => {
    if (!queued) { queued = true; requestAnimationFrame(update); }
  };
  progress.hidden = false;
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule);
  new ResizeObserver(schedule).observe(article);
  new ResizeObserver(schedule).observe(document.querySelector('.site-header'));
  update();

  article.querySelectorAll('.prose pre').forEach(pre => {
    const code = pre.querySelector('code');
    if (!code) return;
    const wrapper = document.createElement('div');
    wrapper.className = 'reading-code';
    pre.before(wrapper);
    const toolbar = document.createElement('div');
    toolbar.className = 'code-toolbar';
    const label = document.createElement('span');
    const source = pre.closest('[class*="language-"]');
    const language = source?.className.match(/(?:^|\s)language-([\w+-]+)/)?.[1] || 'text';
    label.textContent = language;
    toolbar.append(label);
    if (navigator.clipboard?.writeText) {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = zh ? '复制' : 'Copy';
      button.setAttribute('aria-label', zh ? '复制代码' : 'Copy code');
      const status = document.createElement('span');
      status.className = 'code-copy-status';
      status.setAttribute('role', 'status');
      let timer;
      button.addEventListener('click', async () => {
        clearTimeout(timer);
        try {
          await navigator.clipboard.writeText(code.textContent);
          status.textContent = zh ? '已复制' : 'Copied';
        } catch {
          status.textContent = zh ? '复制失败，请手动选择代码' : 'Copy failed; select code manually';
        }
        timer = setTimeout(() => { status.textContent = ''; }, 3000);
      });
      toolbar.append(status, button);
    }
    wrapper.append(toolbar, pre);
  });
  // Toolbar insertion can shift the initial fragment target after native navigation.
  if (location.hash) {
    let target;
    try { target = document.getElementById(decodeURIComponent(location.hash.slice(1))); } catch { /* Invalid fragment: leave native behavior intact. */ }
    if (headings.includes(target)) requestAnimationFrame(() => target.scrollIntoView());
  }
})();
