import { LecturerLessonObjectivesCard } from "@/components/dashboard/lecturer/modules/preview/LecturerLessonObjectivesCard";
import { LecturerLessonPlaylistCard } from "@/components/dashboard/lecturer/modules/preview/LecturerLessonPlaylistCard";
import { LecturerLessonToolsCard } from "@/components/dashboard/lecturer/modules/preview/LecturerLessonToolsCard";
import type {
  LecturerLessonPreviewDetail,
  LecturerPreviewPlaylistItem,
} from "@/data/learning/lecturer/lecturer-content-preview";

interface LecturerLessonPreviewSidebarProps {
  lesson: LecturerLessonPreviewDetail;
  playlist: LecturerPreviewPlaylistItem[];
}

export function LecturerLessonPreviewSidebar({
  lesson,
  playlist,
}: LecturerLessonPreviewSidebarProps) {
  return (
    <aside className="space-y-6 lg:sticky lg:top-6 self-start">
      <LecturerLessonObjectivesCard objectives={lesson.objectives} />
      <LecturerLessonToolsCard tools={lesson.tools} />
      <LecturerLessonPlaylistCard
        playlist={playlist}
        currentLessonId={lesson.id}
      />
    </aside>
  );
}