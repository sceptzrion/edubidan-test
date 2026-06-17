import { Objectives } from "@/components/dashboard/student/modules/lesson/Objectives";
import { Playlist } from "@/components/dashboard/student/modules/lesson/Playlist";
import { Tools } from "@/components/dashboard/student/modules/lesson/Tools";
import type { LearningItem } from "@/types/learning";

interface LessonPlaylistItem {
  id: number;
  kind: "materi" | "kuis";
  title: string;
  duration: string;
  completed: boolean;
}

interface LessonSidebarProps {
  item: LearningItem;
  playlistItems: LessonPlaylistItem[];
  activeIndex: number;
  onNavigate: (targetItem: LessonPlaylistItem) => void;
}

export function LessonSidebar({
  item,
  playlistItems,
  activeIndex,
  onNavigate,
}: LessonSidebarProps) {
  return (
    <div className="flex flex-col gap-4 sm:gap-6 lg:sticky lg:top-6 self-start">
      {item.kind === "materi" && (
        <>
          <Objectives objectives={item.objectives ?? []} />
          <Tools tools={item.tools ?? []} />
        </>
      )}

      <Playlist
        items={playlistItems}
        activeIndex={activeIndex}
        onNavigate={onNavigate}
      />
    </div>
  );
}