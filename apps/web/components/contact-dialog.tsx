"use client";

import { Cross1Icon } from "@radix-ui/react-icons";
import * as React from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import styles from "./contact-dialog.module.css";

const DRAFT_KEY = "fedor-studio:inquiry-draft";
const MAX_MESSAGE_LENGTH = 5000;

interface Draft {
  email: string;
  message: string;
}

const emptyDraft: Draft = { email: "", message: "" };

function readDraft(): Draft {
  try {
    const stored = localStorage.getItem(DRAFT_KEY);
    if (!stored) return emptyDraft;

    const value: unknown = JSON.parse(stored);
    if (!value || typeof value !== "object") return emptyDraft;

    const email = "email" in value && typeof value.email === "string" ? value.email : "";
    const message =
      "message" in value && typeof value.message === "string" ? value.message : "";

    return {
      email: email.slice(0, 254),
      message: message.slice(0, MAX_MESSAGE_LENGTH),
    };
  } catch {
    return emptyDraft;
  }
}

export function ContactDialog() {
  const dialogRef = React.useRef<HTMLDialogElement>(null);
  const emailInputRef = React.useRef<HTMLInputElement>(null);
  const titleId = React.useId();
  const emailErrorId = React.useId();
  const [draft, setDraft] = React.useState<Draft>(emptyDraft);
  const [draftLoaded, setDraftLoaded] = React.useState(false);
  const [isSending, setIsSending] = React.useState(false);
  const [emailError, setEmailError] = React.useState("");
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    setDraft(readDraft());
    setDraftLoaded(true);
  }, []);

  React.useEffect(() => {
    if (!draftLoaded) return;

    try {
      if (draft.email || draft.message) {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
      } else {
        localStorage.removeItem(DRAFT_KEY);
      }
    } catch {
      // Draft persistence is optional when storage is unavailable.
    }
  }, [draft, draftLoaded]);

  function openDialog() {
    setDraft(readDraft());
    setEmailError("");
    setError("");
    dialogRef.current?.showModal();
    requestAnimationFrame(() => emailInputRef.current?.focus());
  }

  function closeDialog() {
    if (!isSending) dialogRef.current?.close();
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!draft.email.trim()) {
      setEmailError("Enter your email.");
      emailInputRef.current?.focus();
      return;
    }

    if (!emailInputRef.current?.validity.valid) {
      setEmailError("Enter a valid email.");
      emailInputRef.current?.focus();
      return;
    }

    setEmailError("");
    setIsSending(true);

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: draft.email,
          message: draft.message,
          company: formData.get("company"),
          submissionId: crypto.randomUUID(),
        }),
      });

      if (!response.ok) {
        const result: unknown = await response.json().catch(() => null);
        const message =
          result &&
          typeof result === "object" &&
          "error" in result &&
          typeof result.error === "string"
            ? result.error
            : "Message could not be sent. Please try again.";
        throw new Error(message);
      }

      setDraft(emptyDraft);
      try {
        localStorage.removeItem(DRAFT_KEY);
      } catch {
        // Draft was already cleared in state.
      }
      dialogRef.current?.close();
      toast.success("Got your message! Get back soon.");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Message could not be sent. Please try again.",
      );
    } finally {
      setIsSending(false);
    }
  }

  return (
    <>
      <Button
        className={styles.trigger}
        type="button"
        variant="link"
        size="inline"
        onClick={openDialog}
      >
        <span className={styles.triggerText}>Discuss a project</span>
      </Button>

      <dialog
        ref={dialogRef}
        className={styles.dialog}
        aria-labelledby={titleId}
        onCancel={(event) => {
          if (isSending) event.preventDefault();
        }}
        onPointerDown={(event) => {
          if (event.target === event.currentTarget) closeDialog();
        }}
      >
        <div className={styles.panel}>
          <header className={styles.header}>
            <h2 id={titleId} className={styles.title}>
              Discuss a project
            </h2>
            <button
              className={styles.close}
              type="button"
              aria-label="Close inquiry"
              onClick={closeDialog}
              disabled={isSending}
            >
              <Cross1Icon aria-hidden="true" />
            </button>
          </header>

          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <label className={styles.field}>
              <span className={styles.visuallyHidden}>Your email</span>
              <input
                ref={emailInputRef}
                className={styles.input}
                type="email"
                name="email"
                placeholder="Your email"
                autoComplete="email"
                inputMode="email"
                maxLength={254}
                required
                aria-invalid={Boolean(emailError)}
                aria-describedby={emailError ? emailErrorId : undefined}
                value={draft.email}
                onChange={(event) => {
                  setEmailError("");
                  setDraft((current) => ({
                    ...current,
                    email: event.target.value,
                  }));
                }}
              />
              {emailError ? (
                <span
                  id={emailErrorId}
                  className={styles.fieldError}
                  role="alert"
                >
                  {emailError}
                </span>
              ) : null}
            </label>

            <div className={styles.composer}>
              <label className={styles.field}>
                <span className={styles.visuallyHidden}>Message</span>
                <textarea
                  className={styles.textarea}
                  name="message"
                  placeholder="Tell me about your project, or just leave your email. I’ll get back to you."
                  maxLength={MAX_MESSAGE_LENGTH}
                  value={draft.message}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      message: event.target.value,
                    }))
                  }
                  onKeyDown={(event) => {
                    if (
                      event.key === "Enter" &&
                      !event.shiftKey &&
                      !event.nativeEvent.isComposing
                    ) {
                      event.preventDefault();
                      event.currentTarget.form?.requestSubmit();
                    }
                  }}
                />
              </label>

            </div>

            <div className={styles.formFooter}>
              <p
                className={[styles.status, error ? styles.error : ""]
                  .filter(Boolean)
                  .join(" ")}
                role="status"
                aria-live="polite"
              >
                {error || (isSending ? "Sending…" : "")}
              </p>
              <button
                className={styles.send}
                type="submit"
                aria-label={isSending ? "Sending inquiry" : "Send inquiry"}
                disabled={isSending}
              >
                <span className={styles.sendText}>Send</span>
              </button>
            </div>

            <label className={styles.honeypot} aria-hidden="true">
              Company
              <input
                type="text"
                name="company"
                tabIndex={-1}
                autoComplete="off"
              />
            </label>
          </form>
        </div>
      </dialog>
    </>
  );
}
