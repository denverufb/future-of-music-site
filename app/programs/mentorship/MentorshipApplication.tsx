"use client";

import { useState, type FormEvent } from "react";
import { getMentorshipClient } from "../../mentorship/client";
import styles from "./mentorship-application.module.css";

export function MentorshipApplication() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setStatus("sending");
    setMessage("");

    const payload = {
      full_name: String(form.get("full_name") || "").trim(),
      student_phone: String(form.get("student_phone") || "").trim(),
      student_email: String(form.get("student_email") || "").trim().toLowerCase(),
      school: String(form.get("school") || "").trim(),
      guardian_name: String(form.get("guardian_name") || "").trim(),
      guardian_phone: String(form.get("guardian_phone") || "").trim(),
      why_participate: String(form.get("why_participate") || "").trim(),
    };

    const { error } = await getMentorshipClient().from("mentorship_applications").insert(payload);
    if (error) {
      setStatus("error");
      setMessage("We could not send your application. Please check each answer and try again.");
      return;
    }

    event.currentTarget.reset();
    setStatus("sent");
    setMessage("Your application is now in Future of Music’s private application inbox. We will follow up using the contact information you provided.");
  }

  return <section id="apply" className={styles.section} aria-labelledby="application-heading">
    <div className={styles.intro}>
      <p>MENTORSHIP APPLICATION</p>
      <h2 id="application-heading">Ready to<br /><em>grow with us?</em></h2>
      <span>For St. Louis youth in grades 5–12. Every field below is required. Your completed form goes directly to Future of Music&apos;s private application inbox.</span>
      <div className={styles.facts}><div><strong>3 months</strong><small>program cycle</small></div><div><strong>30 min</strong><small>weekly meeting</small></div><div><strong>$50</strong><small>completion stipend</small></div></div>
    </div>
    <form className={styles.form} onSubmit={submit}>
      <label>Your full name<input required name="full_name" autoComplete="name" maxLength={200} /></label>
      <label>Your phone number<input required name="student_phone" type="tel" autoComplete="tel" maxLength={40} /></label>
      <label>Your email<input required name="student_email" type="email" autoComplete="email" maxLength={320} /></label>
      <label>School you attend<input required name="school" maxLength={240} /></label>
      <label>Parent or guardian&apos;s name<input required name="guardian_name" autoComplete="name" maxLength={200} /></label>
      <label>Parent or guardian&apos;s phone number<input required name="guardian_phone" type="tel" autoComplete="tel" maxLength={40} /></label>
      <label className={styles.full}>Why do you want to participate in mentorship?<textarea required name="why_participate" minLength={10} maxLength={5000} /></label>
      {message && <p className={status === "sent" ? styles.success : styles.error} role="status">{message}</p>}
      <button className="button button-yellow" disabled={status === "sending"}>{status === "sending" ? "Sending application…" : "Send application"}<span>→</span></button>
    </form>
  </section>;
}
