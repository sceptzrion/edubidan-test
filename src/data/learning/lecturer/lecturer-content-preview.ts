export type LecturerPreviewItemKind = "materi" | "kuis";

export interface LecturerPreviewPlaylistItem {
  id: number;
  kind: LecturerPreviewItemKind;
  title: string;
  duration: string;
}

export interface LecturerLessonPreviewDetail {
  id: number;
  title: string;
  videoSource: "upload" | "embed";
  videoUrl?: string;
  duration: string;
  summary: string;
  objectives: string[];
  tools: string[];
  thumbnailUrl: string;
}

export interface LecturerLessonPreviewData {
  lesson: LecturerLessonPreviewDetail;
  playlist: LecturerPreviewPlaylistItem[];
}