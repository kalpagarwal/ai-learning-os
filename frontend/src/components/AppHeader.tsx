import Link from "next/link";

export function AppHeader() {
  return (
    <div className="header">
      <div>
        <h1 style={{ margin: 0 }}>AI Learning OS</h1>
        <small>Educational AI engineering playground</small>
      </div>
      <nav className="nav">
        <Link href="/">Dashboard</Link>
        <Link href="/chat">Chat</Link>
        <Link href="/upload">Upload</Link>
        <Link href="/roadmap">Roadmap</Link>
        <Link href="/quiz">Quiz</Link>
      </nav>
    </div>
  );
}
