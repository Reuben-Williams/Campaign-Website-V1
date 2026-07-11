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
const originalTextByNode = new WeakMap<Text, string>();
const originalAttributesByElement = new WeakMap<HTMLElement, Map<string, string>>();

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

export function translateSurfaceValue(
  value: string,
  language: Language,
  originalValue?: string,
) {
  const leading = value.match(/^\s*/)?.[0] ?? "";
  const trailing = value.match(/\s*$/)?.[0] ?? "";
  const normalized = value.trim().replace(/\s+/g, " ");

  if (language === "en") {
    return {
      value: originalValue ?? value,
      original: originalValue,
    };
  }

  const source = translateText(normalized, "es") !== normalized
    ? normalized
    : originalValue;

  if (!source) {
    return {
      value,
      original: originalValue,
    };
  }

  return {
    value: `${leading}${translateText(source, "es")}${trailing}`,
    original: source,
  };
}

export function translateDocumentSurface(language: Language) {
  if (typeof document === "undefined") return;

  document.documentElement.lang = language === "es" ? "es" : "en";

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
    const result = translateSurfaceValue(
      node.data,
      language,
      originalTextByNode.get(node),
    );

    if (result.original) {
      originalTextByNode.set(node, result.original);
    }

    if (node.data !== result.value) {
      node.data = result.value;
    }
  }

  const translatedAttributes = ["aria-label", "placeholder", "title"];

  for (const element of Array.from(document.body.querySelectorAll<HTMLElement>("*"))) {
    for (const attribute of translatedAttributes) {
      const value = element.getAttribute(attribute);
      if (!value) continue;

      const originalAttributes =
        originalAttributesByElement.get(element) ?? new Map<string, string>();
      const result = translateSurfaceValue(
        value,
        language,
        originalAttributes.get(attribute),
      );

      if (result.original) {
        originalAttributes.set(attribute, result.original);
        originalAttributesByElement.set(element, originalAttributes);
      }

      if (result.value !== value) {
        element.setAttribute(attribute, result.value);
      }
    }
  }
}
