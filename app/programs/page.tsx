export default function ProgramsPage() {
  return (
    <main className="utility-main">
      <section className="utility-card">
        <p className="kicker">Future of Music programs</p>
        <h1>Choose your pathway.</h1>
        <p>Explore free music and mentorship opportunities for young people.</p>
        <div className="action-row" style={{ justifyContent: "center" }}>
          <a className="btn" href="/programs/dj/">Youth DJ Program</a>
          <a className="btn btn-secondary" href="/programs/mentorship/">Mentorship Program</a>
        </div>
      </section>
    </main>
  );
}
