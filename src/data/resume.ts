// src/data/resume.ts

export interface ExperienceData {
  id: string;
  company: string;
  period: string;
  location: string;
  role: string;
  projectLink?: string;
  techStack: string[];
  achievements: string[];
}

export interface ProjectData {
  id: string;
  name: string;
  teamInfo: string;
  year: string;
  location: string;
  description: string;
  projectLink?: string;
  techStack: string[];
  achievements: string[];
}

export const personalInfo = {
  name: "Голубев Артём Эдуардович",
  title: "Junior Frontend Developer",
  contacts: {
    phone: "+7 (915) 293-29-30",
    email: "agolubev04@mail.ru",
    github: "github.com/Xyzdat",
    telegram: "t.me/agolubev04"
  }
};

export const experience: ExperienceData[] = [
  {
    id: "vk-boardgames",
    company: "VK",
    projectLink: "https://tumladen.online/",
    period: "март — июнь 2026",
    location: "Москва 2026",
    role: "Frontend Developer",
    techStack: ["React", "TypeScript", "Vite", "WebSocket", "SCSS"],
    achievements: [
      "Разработал интерактивное игровое поле на базе HTML5 Canvas (react-konva), внедрив поддержку мобильных жестов (pinch-to-zoom, drag-and-drop, панорамирование).",
      "Оптимизировал производительность отрисовки игрового поля с помощью Konva Node Caching, снизив нагрузку на CPU мобильных устройств.",
      "Интегрировал real-time синхронизацию игрового процесса через WebSocket с механизмом обработки ошибок и автоматического переподключения.",
      "Реализовал клиентскую анимацию перемещения игровых элементов с использованием requestAnimationFrame и bezier curves.",
      "Создал систему игрового лобби: боты для игры различной сложности, настройка таймеров ходов, приватности комнат и управления участниками.",
      "Организовал управление состоянием приложения с помощью Zustand, синхронизировав локальное состояние с серверными событиями."
    ]
  }
];

export const projects: ProjectData[] = [
  {
    id: "vk-education",
    name: "VK EDUCATION",
    teamInfo: "В команде из 4 человек",
    projectLink: "http://wave-music.ru/",
    year: "2025",
    location: "Москва",
    description: "Стриминговый сервис",
    techStack: ["TypeScript", "Vite", "Handlebars", "WebSocket"],
    achievements: [
      "Разработал полноценное SPA-приложение с нуля на чистом TypeScript без использования готовых фреймворков.",
      "Реализовал ключевые пользовательские сценарии: навигацию, плеер, модальные окна.",
      "Настроил сборку проекта и окружение разработки (Vite, ESLint, Prettier).",
      "Создал полностью адаптивный интерфейс.",
      "Обеспечил масштабируемость и изоляцию компонентов через событийную модель.",
      "Настроил офлайн-доступ с использованием Service Worker.",
      "Реализовал комментарии в режиме реального времени через WebSocket."
    ]
  }
];

export const skills = {
  languages: ["JavaScript (ES6+)", "TypeScript", "Python"],
  frontendCore: ["HTML5", "CSS3", "SCSS", "React", "Service Workers (PWA)", "WebSocket", "DOM API", "Handlebars"],
  tools: ["Vite", "NPM", "ESLint", "Prettier", "Postman", "PostgreSQL"],
  deploy: ["Nginx", "Linux", "CI/CD (GitHub/GitLab Pipelines)"],
  patterns: ["SPA", "OOP", "MVC", "Event-Driven Architecture"],
  foreignLanguages: ["Русский — родной", "Английский — B1"]
};

export const education = {
  university: "МГТУ им. Н.Э. Баумана",
  location: "Москва, Россия",
  faculty: "Информатика и вычислительная техника",
  specialization: "Робототехника и комплексная автоматизация",
  period: "Сентябрь 2022 – Июль 2026",
  degree: "Бакалавр"
};