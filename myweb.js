// 🧠 Element references
const searchBtn = document.querySelector("#searchBtn");
const searchInput = document.querySelector("#searchInput");
const olLinks = document.querySelectorAll("ol li a");
const sections = document.querySelectorAll("section");

// ⚙️ Debounce utility
const debounce = (fn, delay = 300) => {
  let controller;
  return (...args) => {
    if (controller) controller.abort();
    controller = new AbortController();
    setTimeout(() => fn.apply(null, args), delay);
  };
};

document.getElementById("themeToggle").addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});

// ✨ Highlight matched text safely
const highlightText = (section, query) => {
  const text = section.textContent;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  section.innerHTML = text.replace(regex, "<mark>$1</mark>");
};

// 🧹 Remove highlights
const clearHighlights = () => {
  sections.forEach(section => {
    section.classList.remove("highlight");
    section.textContent = section.textContent;
  });
};

// 🔍 Perform search
const performSearch = query => {
  clearHighlights();
  if (!query) return;

  let found = false;

  for (const section of sections) {
    if (section.textContent.toLowerCase().includes(query)) {
      section.classList.add("highlight");
      highlightText(section, query);
      section.scrollIntoView({ behavior: "smooth", block: "center" });
      found = true;
    }
  }

  if (!found) showAlert(`No results found for "${query}".`);
};

// 💬 Custom alert box
const showAlert = msg => {
  let alertBox = document.querySelector("#customAlert");

  if (!alertBox) {
    alertBox = document.createElement("div");
    alertBox.id = "customAlert";
    alertBox.className = "custom-alert";
    document.body.append(alertBox);
  }

  alertBox.textContent = msg;
  alertBox.classList.add("show");

  setTimeout(() => alertBox.classList.remove("show"), 2000);
};

// 🎧 Event listeners
searchBtn.addEventListener("click", () => performSearch(searchInput.value.trim().toLowerCase()));
searchInput.addEventListener("keydown", e => {
  if (e.key === "Enter") performSearch(searchInput.value.trim().toLowerCase());
});
searchInput.addEventListener("input", debounce(() => {
  performSearch(searchInput.value.trim().toLowerCase());
}, 300));

// 🔗 Active link state
olLinks.forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    olLinks.forEach(l => l.classList.remove("active"));
    link.classList.add("active");

    const targetId = link.getAttribute("href")?.slice(1);
    const targetSection = document.getElementById(targetId);
    targetSection?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

// 🌗 Dark/Light mode toggle
const createThemeToggle = () => {
  const toggleBtn = document.createElement("button");
  toggleBtn.id = "themeToggle";
  toggleBtn.innerHTML = "dark";
  document.body.append(toggleBtn);

  const setTheme = theme => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    toggleBtn.innerHTML = theme === "dark" ? "light" : "dark";
  };

  // Load saved theme or match system
  const savedTheme = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  setTheme(savedTheme || (prefersDark ? "dark" : "light"));

  // Toggle theme
  toggleBtn.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    setTheme(currentTheme === "dark" ? "light" : "dark");
  });
};

// Initialize theme toggle
createThemeToggle();

// 🎨 Inject Styles
if (!document.querySelector("#customAlertStyle")) {
  const style = document.createElement("style");
  style.id = "customAlertStyle";
  style.textContent = `
    :root {
      --bg-color: #fdfdfd;
      --text-color: #222;
      --highlight-bg: #fff176;
      --section-bg: rgba(255, 255, 0, 0.05);
      --alert-bg: #ffebeb;
    }

    [data-theme="dark"] {
      --bg-color: #121212;
      --text-color: #e0e0e0;
      --highlight-bg: #f1c40f;
      --section-bg: rgba(255, 255, 255, 0.08);
      --alert-bg: #2a2a2a;
    }

    body {
      background-color: var(--bg-color);
      color: var(--text-color);
      transition: background 0.3s ease, color 0.3s ease;
      font-family: 'Poppins', system-ui, sans-serif;
    }

    section.highlight {
      background: var(--section-bg);
      transition: background 0.3s ease;
    }

    mark {
      background: var(--highlight-bg);
      color: inherit;
      border-radius: 3px;
      padding: 0 2px;
    }

    .custom-alert {
      position: fixed;
      top: 20px;
      right: 20px;
      background: var(--alert-bg);
      color: var(--text-color);
      padding: 0.75rem 1.25rem;
      border-radius: 0.5rem;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      z-index: 10000;
      opacity: 0;
      transform: translateY(-10px);
      transition: opacity 0.3s ease, transform 0.3s ease;
    }

    .custom-alert.show {
      opacity: 1;
      transform: translateY(0);
    }

    ol li a.active {
      color: #0078ff;
      font-weight: 600;
      text-decoration: underline;
    }

    #themeToggle {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: var(--alert-bg);
      border: none;
      border-radius: 50%;
      font-size: 1.3rem;
      width: 45px;
      height: 45px;
      cursor: pointer;
      box-shadow: 0 3px 10px rgba(0,0,0,0.2);
      transition: transform 0.3s ease;
    }

    #themeToggle:hover {
      transform: scale(1.1);
    }
  `;
  document.head.append(style);
}

