const themeBtn = document.getElementById('theme-toggle');
const langBtn = document.getElementById('lang-toggle');
const menuBtn = document.getElementById('menu-toggle');
const navMain = document.getElementById('nav-main');

const root = document.documentElement;

const themeLabels = {
  pl: { light: 'Tryb dzienny', dark: 'Tryb nocny' },
  en: { light: 'Light mode', dark: 'Dark mode' }
};

const langLabels = {
  pl: 'EN',
  en: 'PL'
};

const getStoredTheme = () => {
  try {
    return localStorage.getItem('theme');
  } catch (error) {
    return null;
  }
};

const getStoredLang = () => {
  try {
    return localStorage.getItem('lang');
  } catch (error) {
    return null;
  }
};

const setStoredTheme = (value) => {
  try {
    localStorage.setItem('theme', value);
  } catch (error) {
    // Ignore storage errors (e.g. file:// or strict privacy settings).
  }
};

const setStoredLang = (value) => {
  try {
    localStorage.setItem('lang', value);
  } catch (error) {
    // Ignore storage errors (e.g. file:// or strict privacy settings).
  }
};

const getPreferredTheme = () => {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
};

const getCurrentLang = () => {
  const lang = (document.documentElement.lang || 'pl').toLowerCase();
  return lang.startsWith('en') ? 'en' : 'pl';
};

const getCurrentFile = () => {
  return window.location.pathname.split('/').pop() || 'index.html';
};

const pageMap = {
  'index.html': 'index-en.html',
  'about.html': 'about-en.html',
  'staff.html': 'staff-en.html',
  'index-en.html': 'index.html',
  'about-en.html': 'about.html',
  'staff-en.html': 'staff.html'
};

const getTargetFile = (targetLang) => {
  const currentFile = getCurrentFile();
  const mappedFile = pageMap[currentFile];
  if (!mappedFile) {
    return targetLang === 'en' ? 'index-en.html' : 'index.html';
  }
  const isCurrentEn = currentFile.endsWith('-en.html');
  if (targetLang === 'en' && !isCurrentEn) {
    return mappedFile;
  }
  if (targetLang === 'pl' && isCurrentEn) {
    return mappedFile;
  }
  return currentFile;
};

const goToLang = (targetLang) => {
  const targetFile = getTargetFile(targetLang);
  const targetUrl = `${targetFile}${window.location.hash}`;
  if (targetFile !== getCurrentFile()) {
    window.location.href = targetUrl;
  }
};

const applyTheme = (theme) => {
  const isDark = theme === 'dark';
  document.body.classList.toggle('dark-theme', isDark);
  root.classList.toggle('dark-theme', isDark);
  if (themeBtn) {
    const currentLang = getCurrentLang();
    const labels = themeLabels[currentLang] || themeLabels.pl;
    themeBtn.textContent = isDark ? labels.light : labels.dark;
  }
};

const storedLang = getStoredLang();
const currentLang = getCurrentLang();
if (storedLang && storedLang !== currentLang) {
  const targetFile = getTargetFile(storedLang);
  if (targetFile !== getCurrentFile()) {
    window.location.replace(`${targetFile}${window.location.hash}`);
  }
}

if (themeBtn) {
  const storedTheme = getStoredTheme();
  applyTheme(storedTheme || getPreferredTheme());

  themeBtn.addEventListener('click', () => {
    const isDark = !document.body.classList.contains('dark-theme');
    applyTheme(isDark ? 'dark' : 'light');
    setStoredTheme(isDark ? 'dark' : 'light');
  });
}

if (langBtn) {
  langBtn.addEventListener('click', () => {
    const nextLang = getCurrentLang() === 'en' ? 'pl' : 'en';
    setStoredLang(nextLang);
    goToLang(nextLang);
  });

  langBtn.textContent = langLabels[getCurrentLang()] || 'EN';
}

if (menuBtn && navMain) {
  menuBtn.addEventListener('click', () => {
    const isOpen = document.body.classList.toggle('nav-open');
    menuBtn.setAttribute('aria-expanded', String(isOpen));
  });

  navMain.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      document.body.classList.remove('nav-open');
      menuBtn.setAttribute('aria-expanded', 'false');
    });
  });
}

const revealItems = document.querySelectorAll('[data-reveal]');
if (revealItems.length > 0) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  revealItems.forEach((element) => {
    const delay = element.getAttribute('data-delay');
    if (delay) {
      element.style.transitionDelay = `${delay}s`;
    }
    observer.observe(element);
  });
}
