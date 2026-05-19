import { AppHeader } from "../components/AppHeader";
import { ChatPanel } from "../components/ChatPanel";
import { DebugPanels } from "../components/DebugPanels";
import { PdfUploadPanel } from "../components/PdfUploadPanel";
import { QuizPanel } from "../components/QuizPanel";
import { RoadmapPanel } from "../components/RoadmapPanel";

export default function HomePage() {
  return (
    <main>
      <AppHeader />
      <div className="grid">
        <PdfUploadPanel />
        <ChatPanel />
        <RoadmapPanel />
        <QuizPanel />
        <DebugPanels />
      </div>
    </main>
  );
}
