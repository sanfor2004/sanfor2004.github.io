/**
 * Inline email subscribe form.
 *
 * THE ONLY REACT COMPONENT IN THE KIT. It earns the island because it holds
 * real client state that changes over time in response to an async call:
 * idle -> loading -> success | error, plus the message that comes back. Every
 * other interactive component here (accordion, tabs, tooltip, see-more,
 * marquee, reveal, toast) is driven by a class or attribute toggle, which
 * vanilla JS does at a fraction of the cost.
 *
 * Provider-agnostic: it POSTs `email` to whatever `action` URL it is given, and
 * treats any 2xx as success. With no `action` it falls back to native form
 * submission so it still works if JavaScript never loads.
 *
 * Mount with `client:visible` - nothing above the fold needs it eagerly.
 */
import { useId, useRef, useState, type FormEvent } from "react";

type Status = "idle" | "loading" | "success" | "error";

export interface SubscribeFormProps {
  /** Endpoint to POST to. Omit to fall back to a plain form submission. */
  action?: string;
  method?: "POST" | "GET";
  /** Field name the endpoint expects. */
  name?: string;
  label?: string;
  placeholder?: string;
  buttonLabel?: string;
  successMessage?: string;
  errorMessage?: string;
  /** Small print under the field. */
  hint?: string;
  className?: string;
}

export default function SubscribeForm({
  action,
  method = "POST",
  name = "email",
  label = "Email address",
  placeholder = "you@example.com",
  buttonLabel = "Subscribe",
  successMessage = "You're on the list. Check your inbox to confirm.",
  errorMessage = "That didn't go through. Try again in a moment.",
  hint,
  className = "",
}: SubscribeFormProps) {
  const id = useId();
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const fieldId = `${id}-email`;
  const hintId = hint ? `${id}-hint` : undefined;
  const statusId = `${id}-status`;

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    if (!action) return; // Let the browser submit natively.
    event.preventDefault();

    const email = inputRef.current?.value.trim() ?? "";
    if (!email) {
      setStatus("error");
      setMessage("Enter an email address.");
      inputRef.current?.focus();
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const body = new FormData();
      body.append(name, email);
      const response = await fetch(action, {
        method,
        body,
        headers: { Accept: "application/json" },
      });
      if (!response.ok) throw new Error(String(response.status));
      setStatus("success");
      setMessage(successMessage);
      if (inputRef.current) inputRef.current.value = "";
    } catch {
      setStatus("error");
      setMessage(errorMessage);
    }
  }

  const loading = status === "loading";
  const invalid = status === "error";

  return (
    <form
      className={`ui-subscribe ${className}`.trim()}
      action={action}
      method={method}
      onSubmit={onSubmit}
      noValidate={Boolean(action)}
    >
      <label className="ui-formfield-label" htmlFor={fieldId}>
        {label}
      </label>

      <div className="ui-subscribe-row">
        <input
          ref={inputRef}
          className="ui-field"
          id={fieldId}
          name={name}
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder={placeholder}
          required
          disabled={loading || status === "success"}
          aria-invalid={invalid || undefined}
          aria-describedby={[hintId, message ? statusId : undefined]
            .filter(Boolean)
            .join(" ") || undefined}
        />

        <button
          type="submit"
          className="ui-btn ui-btn--primary ui-btn--md ui-subscribe-button"
          disabled={loading || status === "success"}
          aria-busy={loading || undefined}
        >
          {loading && <span className="ui-btn-spinner" aria-hidden="true" />}
          <span className="ui-btn-label">
            {status === "success" ? "Subscribed" : buttonLabel}
          </span>
        </button>
      </div>

      {hint && !message && (
        <p className="ui-formfield-hint" id={hintId}>
          {hint}
        </p>
      )}

      {/* Polite live region: announced when it fills, never interrupts typing. */}
      <p
        className={
          status === "success" ? "ui-subscribe-success" : "ui-formfield-error"
        }
        id={statusId}
        role="status"
        aria-live="polite"
        hidden={!message}
      >
        {message}
      </p>
    </form>
  );
}
