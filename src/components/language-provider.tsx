"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  languageLabels,
  translateText,
  type Language,
} from "@/lib/i18n";

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
  t: (text: string) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);
const storageKey = "morales-language";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    const storedLanguage = window.localStorage.getItem(storageKey);

    if (storedLanguage === "en" || storedLanguage === "es") {
      setLanguageState(storedLanguage);
    }
  }, []);

  const setLanguage = useCallback((nextLanguage: Language) => {
    setLanguageState(nextLanguage);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language === "es" ? "es" : "en";
    window.localStorage.setItem(storageKey, language);
  }, [language]);

  const t = useCallback((text: string) => translateText(text, language), [language]);

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      toggleLanguage: () => setLanguageState((current) => (current === "en" ? "es" : "en")),
      t,
    }),
    [language, setLanguage, t],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useI18n must be used within LanguageProvider");
  }

  return context;
}

export function LanguageToggle({ className = "" }: { className?: string }) {
  const { language, toggleLanguage, t } = useI18n();
  const nextLanguage = language === "en" ? "es" : "en";

  return (
    <button
      type="button"
      className={`language-toggle ${className}`.trim()}
      aria-label={t(language === "en" ? "Switch to Spanish" : "Switch to English")}
      onClick={toggleLanguage}
    >
      <span aria-hidden="true">Aa</span>
      <strong>{nextLanguage.toUpperCase()}</strong>
      <small>{languageLabels[nextLanguage]}</small>
    </button>
  );
}

export function translateDocumentSurface(language: Language) {
  if (typeof document === "undefined") return;

  document.documentElement.lang = language === "es" ? "es" : "en";

  if (language === "en") return;

  const skipTags = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "TEXTAREA"]);
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode(node) {
        const parent = node.parentElement;

        if (!parent || skipTags.has(parent.tagName) || !node.textContent?.trim()) {
          return NodeFilter.FILTER_REJECT;
        }

        return NodeFilter.FILTER_ACCEPT;
      },
    },
  );

  const nodes: Text[] = [];
  let currentNode = walker.nextNode();

  while (currentNode) {
    nodes.push(currentNode as Text);
    currentNode = walker.nextNode();
  }

  for (const node of nodes) {
    const original = node.data;
    const leading = original.match(/^\s*/)?.[0] ?? "";
    const trailing = original.match(/\s*$/)?.[0] ?? "";
    const normalized = original.trim().replace(/\s+/g, " ");
    const translated = translateText(normalized, language);

    if (translated !== normalized) {
      node.data = `${leading}${translated}${trailing}`;
    }
  }

  const translatedAttributes = ["aria-label", "placeholder", "title"];

  for (const element of Array.from(document.body.querySelectorAll<HTMLElement>("*"))) {
    for (const attribute of translatedAttributes) {
      const value = element.getAttribute(attribute);
      if (!value) continue;

      const translated = translateText(value.trim().replace(/\s+/g, " "), language);

      if (translated !== value) {
        element.setAttribute(attribute, translated);
      }
    }
  }
}
