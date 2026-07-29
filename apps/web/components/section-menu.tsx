"use client";

import * as React from "react";

import styles from "./section-menu.module.css";

const sectionIds = [
  "top",
  "selected-work",
  "principles",
  "background",
  "services",
  "process",
  "nazare",
  "contact",
];

export function SectionMenu() {
  const menuRef = React.useRef<HTMLElement>(null);
  const [activeId, setActiveId] = React.useState("top");
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible?.target.id) setActiveId(visible.target.id);
      },
      { rootMargin: "-20% 0px -70% 0px" },
    );

    for (const section of sections) observer.observe(section);
    return () => observer.disconnect();
  }, []);

  React.useEffect(() => {
    if (!isOpen) return;

    function closeOnOutsidePress(event: PointerEvent) {
      if (!menuRef.current?.contains(event.target as Node)) setIsOpen(false);
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }

    document.addEventListener("pointerdown", closeOnOutsidePress);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("pointerdown", closeOnOutsidePress);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen]);

  function handlePointerEnter() {
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      setIsOpen(true);
    }
  }

  function handlePointerLeave() {
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      setIsOpen(false);
    }
  }

  function handleNavigation(id: string) {
    document.getElementById(id)?.scrollIntoView();
    history.replaceState(null, "", `#${id}`);
    setActiveId(id);
    setIsOpen(false);
  }

  return (
    <nav
      ref={menuRef}
      className={styles.menu}
      data-open={isOpen}
      aria-label="Page sections"
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    >
      <button
        className={styles.rail}
        type="button"
        aria-label={isOpen ? "Close section menu" : "Open section menu"}
        aria-expanded={isOpen}
        aria-controls="section-menu-links"
        onClick={() => setIsOpen((current) => !current)}
      >
        <span
          className={[styles.bar, activeId === "top" ? styles.activeBar : ""]
            .filter(Boolean)
            .join(" ")}
        />
        <span
          className={[
            styles.bar,
            activeId === "selected-work" ? styles.activeBar : "",
          ]
            .filter(Boolean)
            .join(" ")}
        />
        <span
          className={[
            styles.bar,
            activeId === "principles" ? styles.activeBar : "",
          ]
            .filter(Boolean)
            .join(" ")}
        />
        <span
          className={[
            styles.bar,
            activeId === "background" ? styles.activeBar : "",
          ]
            .filter(Boolean)
            .join(" ")}
        />
        <span
          className={[
            styles.bar,
            activeId === "services" ? styles.activeBar : "",
          ]
            .filter(Boolean)
            .join(" ")}
        />
        <span
          className={[
            styles.bar,
            activeId === "process" ? styles.activeBar : "",
          ]
            .filter(Boolean)
            .join(" ")}
        />
        <span
          className={[
            styles.bar,
            activeId === "nazare" ? styles.activeBar : "",
          ]
            .filter(Boolean)
            .join(" ")}
        />
        <span
          className={[
            styles.bar,
            activeId === "contact" ? styles.activeBar : "",
          ]
            .filter(Boolean)
            .join(" ")}
        />
      </button>

      <div
        id="section-menu-links"
        className={styles.list}
        inert={!isOpen ? true : undefined}
      >
        <button
          className={[styles.link, activeId === "top" ? styles.activeLink : ""]
            .filter(Boolean)
            .join(" ")}
          type="button"
          onClick={() => handleNavigation("top")}
        >
          <span className={styles.label}>Fedor Studio</span>
        </button>
        <button
          className={[
            styles.link,
            activeId === "selected-work" ? styles.activeLink : "",
          ]
            .filter(Boolean)
            .join(" ")}
          type="button"
          onClick={() => handleNavigation("selected-work")}
        >
          <span className={styles.label}>Selected work</span>
        </button>
        <button
          className={[
            styles.link,
            activeId === "principles" ? styles.activeLink : "",
          ]
            .filter(Boolean)
            .join(" ")}
          type="button"
          onClick={() => handleNavigation("principles")}
        >
          <span className={styles.label}>
            Builds that stay cheap to use and change
          </span>
        </button>
        <button
          className={[
            styles.link,
            activeId === "background" ? styles.activeLink : "",
          ]
            .filter(Boolean)
            .join(" ")}
          type="button"
          onClick={() => handleNavigation("background")}
        >
          <span className={styles.label}>Engineering grounded in Design</span>
        </button>
        <button
          className={[
            styles.link,
            activeId === "services" ? styles.activeLink : "",
          ]
            .filter(Boolean)
            .join(" ")}
          type="button"
          onClick={() => handleNavigation("services")}
        >
          <span className={styles.label}>Ways to work together</span>
        </button>
        <button
          className={[
            styles.link,
            activeId === "process" ? styles.activeLink : "",
          ]
            .filter(Boolean)
            .join(" ")}
          type="button"
          onClick={() => handleNavigation("process")}
        >
          <span className={styles.label}>Result-focused process</span>
        </button>
        <button
          className={[
            styles.link,
            activeId === "nazare" ? styles.activeLink : "",
          ]
            .filter(Boolean)
            .join(" ")}
          type="button"
          onClick={() => handleNavigation("nazare")}
        >
          <span className={styles.label}>
            Better infrastructure for Shopify themes
          </span>
        </button>
        <button
          className={[
            styles.link,
            activeId === "contact" ? styles.activeLink : "",
          ]
            .filter(Boolean)
            .join(" ")}
          type="button"
          onClick={() => handleNavigation("contact")}
        >
          <span className={styles.label}>Have a storefront to build?</span>
        </button>
      </div>
    </nav>
  );
}
