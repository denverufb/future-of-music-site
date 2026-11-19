"use client";

import { useState, type FormEvent } from "react";
import { getMentorshipClient } from "../mentorship/client";
import styles from "./team.module.css";

export function YouthDevelopmentMentorApplication() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setStatus("sending");
    setMessage("");

    const { error } = await getMentorshipClient().from("mentorship_mentor_applications").insert({
      full_name: String(form.get("full_name") || "").trim(),
      date_of_birth: String(form.get("date_of_birth") || ""),
      phone: String(form.get("phone") || "").trim(),
      email: String(form.get("email") || "").trim().toLowerCase(),
      school: String(form.get("school") || "").trim(),
      salutation: String(form.get("salutation") || "").trim(),
      career_path: String(form.get("career_path") || "").trim(),
      why_mentor: String(form.get("why_mentor") || "").trim(),
    });

    if (error) {
      setStatus("error");
      setMessage("We could not send your application. Please check each answer and try again.");
      return;
    }

    event.currentTarget.reset();
    setStatus("sent");
    setMessage("Thank you—your Youth Development Mentor application was received securely.");
  }

  return <section className={styles.mentorApplication} aria-labelledby="mentor-application-title">
    <div className={styles.applicationIntro}>
      <p>Apply now</p>
      <h3 id="mentor-application-title">Bring your time,<br />care, and perspective.</h3>
      <span>Every field is required except salutation. Applications are reviewed privately by Future of Music.</span>
    </div>
    <form className={styles.mentorForm} onSubmit={submit}>
      <label>Full name<input required name="full_name" autoComplete="name" maxLength={200} /></label>
      <label>Date of birth<input required name="date_of_birth" type="date" autoComplete="bday" /></label>
      <label>Phone number<input required name="phone" type="tel" autoComplete="tel" maxLength={40} /></label>
      <label>Email address<input required name="email" type="email" autoComplete="email" maxLength={320} /></label>
      <label>School<input required name="school" maxLength={240} /></label>
      <label>Salutation <small>(if any)</small><input name="salutation" autoComplete="honorific-prefix" maxLength={50} /></label>
      <label className={styles.wideField}>Intended career path<input required name="career_path" maxLength={500} /></label>
      <label className={styles.wideField}>Why would you be a strong Youth Development Mentor?<textarea required name="why_mentor" minLength={20} maxLength={2000} /></label>
      {message && <p className={status === "sent" ? styles.formSuccess : styles.formError} role="status">{message}</p>}
      <button type="submit" className={styles.submitApplication} disabled={status === "sending"}>{status === "sending" ? "Sending application…" : "Submit application"}<span aria-hidden="true">→</span></button>
    </form>
  </section>;
}
