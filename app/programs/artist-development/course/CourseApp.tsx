"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  courseModules,
  totalLessons,
  totalMinutes,
  type ActivityField,
  type CourseModule,
} from "./course-data";

type Panel = "dashboard" | "lesson" | "workbook" | "quiz" | "portfolio" | "certificate";

type QuizResult = {
  score: number;
  passed: boolean;
  attempts: number;
};

type CourseProgress = {
  completedLessons: string[];
  responses: Record<string, string>;
  quizAnswers: Record<string, Record<string, number>>;
  quizResults: Record<string, QuizResult>;
  currentModuleId: string;
  currentLessonId: string;
  currentPanel: Panel;
  studentName: string;
  startedAt: string;
  certificateId: string;
  completionDate: string;
};

const STORAGE_KEY = "fom-artist-academy-progress-v1";

function createProgress(): CourseProgress {
  return {
    completedLessons: [],
    responses: {},
    quizAnswers: {},
    quizResults: {},
    currentModuleId: courseModules[0].id,
    currentLessonId: courseModules[0].lessons[0].id,
    currentPanel: "dashboard",
    studentName: "",
    startedAt: new Date().toISOString(),
    certificateId: "",
    completionDate: "",
  };
}

function responseKey(moduleId: string, fieldId: string) {
  return `${moduleId}:${fieldId}`;
}

function fieldIsComplete(field: ActivityField, value = "") {
  if (!field.required) return true;
  if (field.type === "check") return value === "true";
  return value.trim().length > 0;
}

function moduleActivityComplete(module: CourseModule, progress: CourseProgress) {
  return module.activity.fields.every((field) =>
    fieldIsComplete(field, progress.responses[responseKey(module.id, field.id)]),
  );
}

function moduleIsComplete(module: CourseModule, progress: CourseProgress) {
  const lessonsDone = module.lessons.every((lesson) => progress.completedLessons.includes(lesson.id));
  const activityDone = moduleActivityComplete(module, progress);
  const quizDone = module.quiz ? progress.quizResults[module.id]?.passed === true : true;
  return lessonsDone && activityDone && quizDone;
}

function cleanFilename(value: string) {
  return value.trim().replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase() || "artist";
}

export default function CourseApp() {
  const [progress, setProgress] = useState<CourseProgress>(createProgress);
  const [hydrated, setHydrated] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceName, setVoiceName] = useState("");
  const [speechRate, setSpeechRate] = useState("1");
  const [speechState, setSpeechState] = useState<"idle" | "playing" | "paused">("idle");
  const [speechSupported, setSpeechSupported] = useState(false);
  const [quizNotice, setQuizNotice] = useState("");
  const loadedRef = useRef(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      try {
        const saved = window.localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved) as Partial<CourseProgress>;
          setProgress({ ...createProgress(), ...parsed });
        }
      } catch {
        // A damaged local draft should not prevent a student from using the course.
      }
      loadedRef.current = true;
      setHydrated(true);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!loadedRef.current) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    if (!("speechSynthesis" in window)) return;
    const loadVoices = () => {
      setSpeechSupported(true);
      const available = window.speechSynthesis.getVoices();
      setVoices(available);
      setVoiceName((current) => current || available.find((voice) => voice.lang.startsWith("en"))?.name || available[0]?.name || "");
    };
    const frame = window.requestAnimationFrame(loadVoices);
    window.speechSynthesis.addEventListener("voiceschanged", loadVoices);
    return () => {
      window.cancelAnimationFrame(frame);
      window.speechSynthesis.cancel();
      window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
    };
  }, []);

  const activeModule = courseModules.find((module) => module.id === progress.currentModuleId) ?? courseModules[0];
  const activeLesson = activeModule.lessons.find((lesson) => lesson.id === progress.currentLessonId) ?? activeModule.lessons[0];
  const activeLessonIndex = activeModule.lessons.findIndex((lesson) => lesson.id === activeLesson.id);
  const moduleIndex = courseModules.findIndex((module) => module.id === activeModule.id);

  const trainingQuizResults = courseModules
    .filter((module) => module.quiz && module.id !== "final")
    .map((module) => progress.quizResults[module.id])
    .filter(Boolean);
  const quizAverage = trainingQuizResults.length
    ? Math.round(trainingQuizResults.reduce((sum, result) => sum + result.score, 0) / trainingQuizResults.length)
    : 0;

  const checkpointStats = useMemo(() => {
    const lessonTotal = totalLessons;
    const activityTotal = courseModules.length;
    const quizTotal = courseModules.filter((module) => module.quiz).length;
    const lessonDone = courseModules.flatMap((module) => module.lessons).filter((lesson) => progress.completedLessons.includes(lesson.id)).length;
    const activityDone = courseModules.filter((module) => moduleActivityComplete(module, progress)).length;
    const quizDone = courseModules.filter((module) => !module.quiz || progress.quizResults[module.id]?.passed).length - 1;
    const total = lessonTotal + activityTotal + quizTotal;
    const complete = lessonDone + activityDone + Math.max(0, quizDone);
    return { total, complete, percent: Math.round((complete / total) * 100) };
  }, [progress]);

  const completedModuleCount = courseModules.filter((module) => moduleIsComplete(module, progress)).length;
  const certificateEligible = completedModuleCount === courseModules.length;

  useEffect(() => {
    if (!certificateEligible || progress.certificateId) return;
    const frame = window.requestAnimationFrame(() => {
      const now = new Date();
      const unique = Math.floor(100000 + Math.random() * 900000);
      setProgress((current) => ({
        ...current,
        certificateId: `FOM-ADA-${now.getFullYear()}-${unique}`,
        completionDate: now.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
      }));
    });
    return () => window.cancelAnimationFrame(frame);
  }, [certificateEligible, progress.certificateId]);

  function stopNarration() {
    if (speechSupported) window.speechSynthesis.cancel();
    setSpeechState("idle");
  }

  function navigate(moduleId: string, panel: Panel, lessonId?: string) {
    stopNarration();
    setQuizNotice("");
    const selectedModule = courseModules.find((item) => item.id === moduleId) ?? courseModules[0];
    setProgress((current) => ({
      ...current,
      currentModuleId: selectedModule.id,
      currentLessonId: lessonId ?? selectedModule.lessons[0].id,
      currentPanel: panel,
    }));
    window.requestAnimationFrame(() => document.querySelector(".course-workspace")?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  function startNarration() {
    if (!speechSupported) return;
    if (speechState === "paused") {
      window.speechSynthesis.resume();
      setSpeechState("playing");
      return;
    }
    window.speechSynthesis.cancel();
    const text = `${activeLesson.title}. ${activeLesson.narration} Remember. ${activeLesson.remember.join(" ")}`;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = Number(speechRate);
    utterance.voice = voices.find((voice) => voice.name === voiceName) ?? null;
    utterance.onend = () => setSpeechState("idle");
    utterance.onerror = () => setSpeechState("idle");
    window.speechSynthesis.speak(utterance);
    setSpeechState("playing");
  }

  function pauseNarration() {
    if (!speechSupported || speechState !== "playing") return;
    window.speechSynthesis.pause();
    setSpeechState("paused");
  }

  function markLessonComplete() {
    setProgress((current) => ({
      ...current,
      completedLessons: current.completedLessons.includes(activeLesson.id)
        ? current.completedLessons
        : [...current.completedLessons, activeLesson.id],
    }));
  }

  function continueFromLesson() {
    markLessonComplete();
    const nextLesson = activeModule.lessons[activeLessonIndex + 1];
    if (nextLesson) navigate(activeModule.id, "lesson", nextLesson.id);
    else navigate(activeModule.id, "workbook");
  }

  function updateResponse(moduleId: string, fieldId: string, value: string) {
    const key = responseKey(moduleId, fieldId);
    setProgress((current) => ({ ...current, responses: { ...current.responses, [key]: value } }));
  }

  function selectQuizAnswer(moduleId: string, questionIndex: number, optionIndex: number) {
    setQuizNotice("");
    setProgress((current) => {
      const nextResults = { ...current.quizResults };
      delete nextResults[moduleId];
      return {
        ...current,
        quizAnswers: {
          ...current.quizAnswers,
          [moduleId]: { ...(current.quizAnswers[moduleId] ?? {}), [String(questionIndex)]: optionIndex },
        },
        quizResults: nextResults,
      };
    });
  }

  function submitQuiz(module: CourseModule) {
    if (!module.quiz) return;
    const answers = progress.quizAnswers[module.id] ?? {};
    if (Object.keys(answers).length !== module.quiz.questions.length) {
      setQuizNotice("Answer every question before checking your score.");
      return;
    }
    const correct = module.quiz.questions.reduce(
      (sum, question, index) => sum + (answers[String(index)] === question.answer ? 1 : 0),
      0,
    );
    const score = Math.round((correct / module.quiz.questions.length) * 100);
    const passed = correct >= Math.ceil(module.quiz.questions.length * 0.8);
    setProgress((current) => ({
      ...current,
      quizResults: {
        ...current.quizResults,
        [module.id]: {
          score,
          passed,
          attempts: (current.quizResults[module.id]?.attempts ?? 0) + 1,
        },
      },
    }));
    setQuizNotice(passed ? `Passed with ${score}%.` : `You scored ${score}%. Review the explanations and try again.`);
  }

  function retryQuiz(moduleId: string) {
    setQuizNotice("");
    setProgress((current) => {
      const nextAnswers = { ...current.quizAnswers };
      const nextResults = { ...current.quizResults };
      delete nextAnswers[moduleId];
      delete nextResults[moduleId];
      return { ...current, quizAnswers: nextAnswers, quizResults: nextResults };
    });
  }

  function downloadWorkbook() {
    const lines = [
      "FUTURE OF MUSIC — ARTIST DEVELOPMENT ACADEMY",
      "Artist Workbook + Portfolio",
      `Artist: ${progress.studentName || "Name not added"}`,
      `Saved: ${new Date().toLocaleString()}`,
      "",
      "This workbook was exported from the open beta. Review it before sharing and remove private information.",
      "",
    ];
    courseModules.forEach((module) => {
      lines.push(`${module.number} — ${module.title}`, `Portfolio product: ${module.product}`, "");
      module.activity.fields.forEach((field) => {
        const value = progress.responses[responseKey(module.id, field.id)] ?? "";
        lines.push(field.label, field.type === "check" ? (value === "true" ? "Confirmed" : "Not confirmed") : value || "[Not completed]", "");
      });
      if (module.quiz) {
        const result = progress.quizResults[module.id];
        lines.push(`${module.quiz.title}: ${result ? `${result.score}% — ${result.passed ? "Passed" : "Keep working"}` : "Not completed"}`, "");
      }
      lines.push("—".repeat(24), "");
    });
    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${cleanFilename(progress.studentName)}-artist-development-workbook.txt`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  function resetProgress() {
    if (!window.confirm("Reset every lesson, response, quiz, and certificate on this device? This cannot be undone.")) return;
    stopNarration();
    window.localStorage.removeItem(STORAGE_KEY);
    setProgress(createProgress());
  }

  function printCertificate() {
    const cleanup = () => document.body.classList.remove("is-printing-certificate");
    document.body.classList.add("is-printing-certificate");
    window.addEventListener("afterprint", cleanup, { once: true });
    window.print();
    window.setTimeout(cleanup, 1500);
  }

  function nextModule() {
    const next = courseModules[Math.min(moduleIndex + 1, courseModules.length - 1)];
    navigate(next.id, "lesson", next.lessons[0].id);
  }

  const currentResult = activeModule.quiz ? progress.quizResults[activeModule.id] : undefined;
  const activityComplete = moduleActivityComplete(activeModule, progress);

  return (
    <>
      <section className="course-intro">
        <div>
          <p className="course-beta">OPEN BETA • FREE • SELF-PACED</p>
          <h1>Artist Development<br /><em>Academy.</em></h1>
          <p>Find your sound. Build your brand. Prepare for the industry through 27 narrated lessons, practical projects, quizzes, and a personal portfolio.</p>
          <div className="course-intro-actions">
            <button className="course-primary" type="button" onClick={() => navigate(progress.currentModuleId, progress.currentPanel === "dashboard" ? "lesson" : progress.currentPanel, progress.currentLessonId)}>
              {checkpointStats.complete ? "Continue where I left off" : "Start the course"} <span>→</span>
            </button>
            <button className="course-quiet" type="button" onClick={downloadWorkbook}>Download workbook backup ↓</button>
          </div>
        </div>
        <div className="course-intro-stats" aria-label="Course facts">
          <article><strong>{Math.floor(totalMinutes / 60)}h {totalMinutes % 60}m</strong><span>estimated learning time</span></article>
          <article><strong>{totalLessons}</strong><span>narrated lessons</span></article>
          <article><strong>8</strong><span>course modules + orientation</span></article>
          <article><strong>Local</strong><span>private on-device progress</span></article>
        </div>
      </section>

      <div className="course-layout">
        <aside className="course-sidebar" aria-label="Course navigation">
          <div className="course-sidebar-head">
            <button type="button" onClick={() => navigate(progress.currentModuleId, "dashboard", progress.currentLessonId)}>Course dashboard</button>
            <div className="course-progress-label"><span>{checkpointStats.percent}% complete</span><strong>{completedModuleCount}/{courseModules.length} sections</strong></div>
            <div className="course-progress-track" aria-label={`${checkpointStats.percent}% course complete`}><i style={{ width: `${checkpointStats.percent}%` }} /></div>
          </div>

          <ol className="course-module-nav">
            {courseModules.map((module) => {
              const complete = moduleIsComplete(module, progress);
              const active = module.id === activeModule.id && ["lesson", "workbook", "quiz"].includes(progress.currentPanel);
              return (
                <li key={module.id}>
                  <button className={active ? "is-active" : ""} type="button" onClick={() => navigate(module.id, "lesson", module.lessons[0].id)} aria-current={active ? "step" : undefined}>
                    <span style={{ background: module.accent }}>{complete ? "✓" : module.number}</span>
                    <div><strong>{module.shortTitle}</strong><small>{module.minutes} min • {complete ? "Complete" : "Open"}</small></div>
                  </button>
                </li>
              );
            })}
          </ol>

          <div className="course-sidebar-tools">
            <button type="button" onClick={() => navigate(progress.currentModuleId, "portfolio", progress.currentLessonId)}>Artist Workbook <span>→</span></button>
            <button type="button" onClick={() => navigate(progress.currentModuleId, "certificate", progress.currentLessonId)}>Certificate <span>→</span></button>
            <button className="course-reset" type="button" onClick={resetProgress}>Reset local progress</button>
          </div>
        </aside>

        <main className="course-workspace" id="course-workspace" tabIndex={-1}>
          <header className="course-workspace-head">
            <div><p>Future of Music • Open course beta</p><strong>Your work saves automatically on this device.</strong></div>
            <span className="course-save-state" aria-live="polite">{hydrated ? "● Saved locally" : "● Loading local work"}</span>
          </header>

          {progress.currentPanel === "dashboard" && (
            <section className="course-dashboard">
              <div className="course-dashboard-heading">
                <p className="course-overline">YOUR COURSE HOME</p>
                <h2>{checkpointStats.complete ? "Welcome back." : "Let’s build the artist behind the music."}</h2>
                <p>Everything is open during the beta. Move in order or explore any section, and use the workbook download to keep a backup.</p>
              </div>
              <div className="course-dashboard-stats">
                <article><span>Overall progress</span><strong>{checkpointStats.percent}%</strong><small>{checkpointStats.complete} of {checkpointStats.total} checkpoints</small></article>
                <article><span>Quiz average</span><strong>{quizAverage}%</strong><small>{trainingQuizResults.length} of 7 module quizzes attempted</small></article>
                <article><span>Portfolio</span><strong>{courseModules.filter((module) => moduleActivityComplete(module, progress)).length}/9</strong><small>guided sections complete</small></article>
              </div>
              <div className="course-continue-card">
                <div><span>CONTINUE</span><h3>{activeModule.number} — {activeModule.title}</h3><p>{activeLesson.title}</p></div>
                <button className="course-primary" type="button" onClick={() => navigate(activeModule.id, "lesson", activeLesson.id)}>Open lesson <span>→</span></button>
              </div>
              <div className="course-privacy-card">
                <strong>Private beta workspace</strong>
                <p>No account, public posting, or upload is required. Responses remain in this browser. Switching devices, using private browsing, or clearing site data can erase them, so download a backup regularly.</p>
              </div>
              <div className="course-dashboard-modules">
                {courseModules.map((module) => {
                  const complete = moduleIsComplete(module, progress);
                  return <button type="button" key={module.id} onClick={() => navigate(module.id, "lesson", module.lessons[0].id)}><span style={{ background: module.accent }}>{complete ? "✓" : module.number}</span><strong>{module.title}</strong><small>{module.product}</small><i>{complete ? "Complete" : "Open module"} →</i></button>;
                })}
              </div>
            </section>
          )}

          {progress.currentPanel === "lesson" && (
            <article className="course-lesson-view">
              <nav className="course-step-tabs" aria-label="Current module sections">
                {activeModule.lessons.map((lesson, index) => <button className={lesson.id === activeLesson.id ? "is-current" : ""} type="button" key={lesson.id} onClick={() => navigate(activeModule.id, "lesson", lesson.id)}>{progress.completedLessons.includes(lesson.id) ? "✓" : index + 1} <span>Lesson</span></button>)}
                <button type="button" onClick={() => navigate(activeModule.id, "workbook")}>✎ <span>Build</span></button>
                {activeModule.quiz && <button type="button" onClick={() => navigate(activeModule.id, "quiz")}>? <span>Check</span></button>}
              </nav>

              <div className="course-lesson-heading">
                <p className="course-overline">MODULE {activeModule.number} • LESSON {activeLessonIndex + 1} OF {activeModule.lessons.length} • {activeLesson.minutes} MIN</p>
                <h2>{activeLesson.title}</h2>
                <p>{activeModule.goal}</p>
              </div>

              <section className="narration-player" aria-label="Lesson narration controls">
                <div className="narration-title"><span aria-hidden="true">♫</span><div><strong>Listen to this lesson</strong><small>Uses the voice built into your device</small></div></div>
                <div className="narration-actions">
                  <button type="button" onClick={startNarration} disabled={!speechSupported}>{speechState === "paused" ? "Resume" : speechState === "playing" ? "Restart" : "Play narration"}</button>
                  <button type="button" onClick={pauseNarration} disabled={speechState !== "playing"}>Pause</button>
                  <button type="button" onClick={stopNarration} disabled={speechState === "idle"}>Stop</button>
                </div>
                <div className="narration-settings">
                  <label>Voice<select value={voiceName} onChange={(event) => setVoiceName(event.target.value)} disabled={!speechSupported}>{voices.map((voice) => <option key={`${voice.name}-${voice.lang}`} value={voice.name}>{voice.name} ({voice.lang})</option>)}</select></label>
                  <label>Speed<select value={speechRate} onChange={(event) => setSpeechRate(event.target.value)}><option value="0.8">0.8×</option><option value="1">1×</option><option value="1.15">1.15×</option><option value="1.25">1.25×</option></select></label>
                </div>
                {!speechSupported && <p className="narration-warning">Narration is not supported in this browser. The complete readable lesson is below.</p>}
              </section>

              <section className="course-reading">
                <p className="course-overline">READ ALONG</p>
                {activeLesson.narration.split("\n\n").map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </section>

              <section className="course-remember">
                <p className="course-overline">REMEMBER</p>
                <ul>{activeLesson.remember.map((point) => <li key={point}>{point}</li>)}</ul>
              </section>

              {activeLesson.tryIt && <section className="course-try"><p className="course-overline">TRY IT</p><p>{activeLesson.tryIt}</p></section>}

              <footer className="course-lesson-footer">
                <button className="course-complete-button" type="button" onClick={continueFromLesson}>{progress.completedLessons.includes(activeLesson.id) ? "Completed — continue" : "Mark complete + continue"} <span>→</span></button>
                <p>Completion is saved automatically.</p>
              </footer>
            </article>
          )}

          {progress.currentPanel === "workbook" && (
            <section className="course-workbook-view">
              <div className="course-lesson-heading">
                <p className="course-overline">MODULE {activeModule.number} • BUILD IT</p>
                <h2>{activeModule.activity.title}</h2>
                <p>{activeModule.activity.intro}</p>
              </div>
              <div className="course-autosave-note"><span>●</span><p><strong>Auto-saving locally</strong><br />Avoid addresses, passwords, school schedules, private contact details, or banking information.</p></div>
              <div className="course-fields">
                {activeModule.activity.fields.map((field) => {
                  const key = responseKey(activeModule.id, field.id);
                  const value = progress.responses[key] ?? "";
                  return <ActivityInput key={field.id} field={field} value={value} onChange={(nextValue) => updateResponse(activeModule.id, field.id, nextValue)} />;
                })}
              </div>
              <div className={`course-activity-status ${activityComplete ? "is-complete" : ""}`}>
                <div><span>{activityComplete ? "✓" : "…"}</span><p><strong>{activityComplete ? "Portfolio section complete" : "Keep building"}</strong><br />{activityComplete ? `${activeModule.product} has been added to your workbook.` : "Complete every required prompt to finish this section."}</p></div>
                {activeModule.quiz ? <button className="course-primary" type="button" onClick={() => navigate(activeModule.id, "quiz")}>Take the module quiz <span>→</span></button> : <button className="course-primary" type="button" onClick={nextModule}>Start the next module <span>→</span></button>}
              </div>
            </section>
          )}

          {progress.currentPanel === "quiz" && activeModule.quiz && (
            <section className="course-quiz-view">
              <div className="course-lesson-heading">
                <p className="course-overline">MODULE {activeModule.number} • CHECK IT</p>
                <h2>{activeModule.quiz.title}</h2>
                <p>{activeModule.quiz.intro}</p>
              </div>
              <div className="course-quiz-list">
                {activeModule.quiz.questions.map((question, questionIndex) => {
                  const answer = progress.quizAnswers[activeModule.id]?.[String(questionIndex)];
                  const answered = typeof answer === "number";
                  const correct = currentResult ? answer === question.answer : false;
                  return (
                    <fieldset className={`course-question ${currentResult ? (correct ? "is-correct" : "is-wrong") : ""}`} key={question.question}>
                      <legend><span>{String(questionIndex + 1).padStart(2, "0")}</span>{question.question}</legend>
                      <div className="course-options">
                        {question.options.map((option, optionIndex) => (
                          <label key={option} className={answered && answer === optionIndex ? "is-selected" : ""}>
                            <input type="radio" name={`${activeModule.id}-q-${questionIndex}`} checked={answer === optionIndex} onChange={() => selectQuizAnswer(activeModule.id, questionIndex, optionIndex)} />
                            <span>{String.fromCharCode(65 + optionIndex)}</span>{option}
                          </label>
                        ))}
                      </div>
                      {currentResult && <div className="course-explanation"><strong>{correct ? "Correct." : `Not quite. The best answer is ${String.fromCharCode(65 + question.answer)}.`}</strong> {question.explanation}</div>}
                    </fieldset>
                  );
                })}
              </div>
              <div className={`course-quiz-submit ${currentResult?.passed ? "is-passed" : ""}`}>
                <div aria-live="polite"><strong>{quizNotice || (currentResult ? `${currentResult.score}%` : "Ready to check your work?")}</strong><p>{currentResult?.passed ? "This assessment is complete." : "You can retake this assessment without penalty."}</p></div>
                {!currentResult && <button className="course-primary" type="button" onClick={() => submitQuiz(activeModule)}>Check my answers <span>→</span></button>}
                {currentResult && !currentResult.passed && <button className="course-primary" type="button" onClick={() => retryQuiz(activeModule.id)}>Try again <span>↻</span></button>}
                {currentResult?.passed && moduleIndex < courseModules.length - 1 && <button className="course-primary" type="button" onClick={nextModule}>Next module <span>→</span></button>}
                {currentResult?.passed && activeModule.id === "final" && <button className="course-primary" type="button" onClick={() => navigate(activeModule.id, "certificate")}>View certificate status <span>→</span></button>}
              </div>
            </section>
          )}

          {progress.currentPanel === "portfolio" && (
            <section className="course-portfolio-view">
              <div className="course-lesson-heading">
                <p className="course-overline">YOUR ARTIST WORKBOOK</p>
                <h2>Everything you are building, in one place.</h2>
                <p>Review your work, return to any unfinished section, and download a plain-text backup you can open on almost any device.</p>
              </div>
              <label className="course-name-field">Your name for workbook + certificate<input value={progress.studentName} onChange={(event) => setProgress((current) => ({ ...current, studentName: event.target.value }))} placeholder="Type your name" autoComplete="name" /></label>
              <div className="course-portfolio-actions"><button className="course-primary" type="button" onClick={downloadWorkbook}>Download my workbook <span>↓</span></button><button className="course-quiet dark" type="button" onClick={() => navigate(progress.currentModuleId, "certificate")}>Check certificate status →</button></div>
              <div className="course-portfolio-sections">
                {courseModules.map((module) => {
                  const complete = moduleActivityComplete(module, progress);
                  return (
                    <details key={module.id} open={module.id === activeModule.id}>
                      <summary><span style={{ background: module.accent }}>{complete ? "✓" : module.number}</span><div><strong>{module.product}</strong><small>{module.title}</small></div><i>{complete ? "Complete" : "In progress"}</i></summary>
                      <div className="course-portfolio-responses">
                        {module.activity.fields.map((field) => {
                          const value = progress.responses[responseKey(module.id, field.id)] ?? "";
                          return <div key={field.id}><strong>{field.label}</strong><p>{field.type === "check" ? (value === "true" ? "Confirmed" : "Not confirmed") : value || "Not completed yet."}</p></div>;
                        })}
                        <button className="course-text-button" type="button" onClick={() => navigate(module.id, "workbook")}>Edit this section →</button>
                      </div>
                    </details>
                  );
                })}
              </div>
            </section>
          )}

          {progress.currentPanel === "certificate" && (
            <section className="course-certificate-view">
              <div className="course-lesson-heading no-print">
                <p className="course-overline">COMPLETION STATUS</p>
                <h2>{certificateEligible ? "You completed the Academy." : "Your certificate is taking shape."}</h2>
                <p>Complete every lesson, guided portfolio section, seven module quizzes, the final assessment, and closing reflection.</p>
              </div>
              {!certificateEligible && (
                <div className="certificate-requirements no-print">
                  {courseModules.map((module) => {
                    const lessonsDone = module.lessons.every((lesson) => progress.completedLessons.includes(lesson.id));
                    const workDone = moduleActivityComplete(module, progress);
                    const quizDone = !module.quiz || progress.quizResults[module.id]?.passed;
                    return <article key={module.id}><span style={{ background: module.accent }}>{module.number}</span><div><strong>{module.title}</strong><p>{lessonsDone ? "✓ Lessons" : "○ Lessons"} • {workDone ? "✓ Portfolio" : "○ Portfolio"}{module.quiz ? ` • ${quizDone ? "✓ Assessment" : "○ Assessment"}` : ""}</p></div><button type="button" onClick={() => navigate(module.id, lessonsDone ? (workDone ? "quiz" : "workbook") : "lesson")}>Continue →</button></article>;
                  })}
                </div>
              )}
              {certificateEligible && (
                <>
                  <label className="course-name-field no-print">Name shown on the certificate<input value={progress.studentName} onChange={(event) => setProgress((current) => ({ ...current, studentName: event.target.value }))} placeholder="Type your full name" autoComplete="name" /></label>
                  <div className="academy-certificate" id="academy-certificate">
                    <div className="certificate-border">
                      <img src="/images/logo.png" alt="Future of Music" />
                      <p className="certificate-kicker">CERTIFICATE OF COMPLETION</p>
                      <p>This certifies that</p>
                      <h2>{progress.studentName || "Your Name"}</h2>
                      <p>successfully completed the</p>
                      <h3>Future of Music<br />Artist Development Academy</h3>
                      <p className="certificate-description">A self-paced online learning experience covering artist identity, sound development, songwriting, branding, public relations and media training, music-industry fundamentals, release planning, and professional readiness.</p>
                      <div className="certificate-meta"><span><strong>4.5 hours</strong> Estimated instruction</span><span><strong>{progress.completionDate}</strong> Completion date</span><span><strong>{progress.certificateId}</strong> Certificate ID</span></div>
                      <div className="certificate-signature"><strong>Aereon Robinson</strong><span>Founder &amp; Executive Director</span></div>
                      <p className="certificate-beta-note">Issued through the Future of Music open course beta.</p>
                    </div>
                  </div>
                  <div className="certificate-actions no-print"><button className="course-primary" type="button" disabled={!progress.studentName.trim()} onClick={printCertificate}>Print or save certificate <span>↓</span></button><button className="course-quiet dark" type="button" onClick={downloadWorkbook}>Download portfolio backup ↓</button>{!progress.studentName.trim() && <p>Add your name before printing.</p>}</div>
                </>
              )}
            </section>
          )}
        </main>
      </div>

      <section className="course-help">
        <div><p className="course-overline">HELP + SAFETY</p><h2>You should never have to handle an industry decision alone.</h2></div>
        <div><p>This course offers general education, not legal, financial, tax, or contract advice. Never sign a real agreement as an assignment. If you are under 18, involve a parent, guardian, or trusted adult in formal opportunities, unfamiliar meetings, payment, travel, and contracts.</p><a href="mailto:info@fomusic.org?subject=Artist%20Development%20Academy%20Help">Ask Future of Music for help →</a></div>
      </section>
    </>
  );
}

function ActivityInput({ field, value, onChange }: { field: ActivityField; value: string; onChange: (value: string) => void }) {
  const id = `activity-${field.id}`;
  if (field.type === "check") {
    return (
      <label className="course-check-field" htmlFor={id}>
        <input id={id} type="checkbox" checked={value === "true"} onChange={(event) => onChange(event.target.checked ? "true" : "")} />
        <span aria-hidden="true">✓</span><div><strong>{field.label}</strong>{field.hint && <small>{field.hint}</small>}</div>
      </label>
    );
  }
  if (field.type === "rating") {
    return (
      <fieldset className="course-rating-field">
        <legend>{field.label}</legend>
        <div>{[1, 2, 3, 4, 5].map((rating) => <label key={rating}><input type="radio" name={id} checked={value === String(rating)} onChange={() => onChange(String(rating))} /><span>{rating}</span></label>)}</div>
        <small><span>1 — Not true yet</span><span>5 — Very true</span></small>
      </fieldset>
    );
  }
  return (
    <label className="course-text-field" htmlFor={id}>
      <strong>{field.label}</strong>
      {field.hint && <small>{field.hint}</small>}
      {field.type === "short"
        ? <input id={id} value={value} onChange={(event) => onChange(event.target.value)} placeholder={field.placeholder ?? "Type your response"} />
        : <textarea id={id} value={value} onChange={(event) => onChange(event.target.value)} placeholder={field.placeholder ?? "Type your response"} rows={5} />}
    </label>
  );
}
