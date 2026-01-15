import { Stage } from '@/components/stage/Stage';
import { ActIIStage } from '@/components/stage/ActIIStage';
import { ActIIICloser } from '@/components/stage/ActIIICloser';

export default function HomePage() {
  return (
    <main className="bg-white">
      {/* ═══════════════════════════════════════════════════════════════
          SCROLLYTELLING ARCHITECTURE
          
          Stage (Act 0 → Act I):
          - Globe → Face morph
          - "Remilia" → "Remilia is a Network State" → "It began as..."
          - Single morph object, transforms only
          
          ActIIStage (Act II):
          - "It produces artifacts."
          - Archive tray (3-card stack)
          - Transition hinge: "The network began to resolve into identity"
          
          ActIIICloser (Act III):
          - "Project directory."
          - PROJECT DIRECTORY — RML plate
          - Mirrors Remilia.org information architecture
          
          CRITICAL: Each stage mounts ONCE. No duplicates.
          Acts are STATE TRANSITIONS via scroll progress, not remounts.
          ═══════════════════════════════════════════════════════════════ */}
      <Stage />
      
      {/* Act II — "It produces artifacts." + card stack */}
      <ActIIStage />
      
      {/* Act III — "Project directory." + directory plate */}
      <ActIIICloser />
    </main>
  );
}
