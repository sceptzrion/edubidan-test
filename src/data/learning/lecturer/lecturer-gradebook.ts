export interface LecturerGradebookModule {
  id: number;
  title: string;
  studentCount: number;
  quizCount: number;
}

export interface LecturerGradebookStudent {
  name: string;
  nim: string;
  scores: (number | null)[];
}

export interface LecturerGradebookDetail {
  id: number;
  title: string;
  quizzes: string[];
  students: LecturerGradebookStudent[];
}

export interface LecturerGradebookRow extends LecturerGradebookStudent {
  average: number;
}

export const lecturerGradebookDetails: Record<string, LecturerGradebookDetail> =
  {
    "1": {
      id: 1,
      title: "ANC Terpadu Trimester 1",
      quizzes: ["Kuis Anamnesis", "Kuis Leopold", "Kuis Akhir Modul"],
      students: [
        { name: "Sari Dewi", nim: "2024010101", scores: [88, 92, 90] },
        { name: "Anisa Putri", nim: "2024010102", scores: [78, 82, 88] },
        { name: "Rina Lestari", nim: "2024010103", scores: [60, 65, 64] },
        { name: "Lina Marlina", nim: "2024010104", scores: [95, 90, 100] },
        { name: "Maya Sari", nim: "2024010105", scores: [70, 75, 71] },
        { name: "Dewi Anggraini", nim: "2024010106", scores: [82, 80, 85] },
        { name: "Putri Maharani", nim: "2024010107", scores: [55, 60, null] },
      ],
    },
    "2": {
      id: 2,
      title: "APGAR Score & Resusitasi",
      quizzes: ["Kuis APGAR", "Kuis Akhir Modul"],
      students: [
        { name: "Sari Dewi", nim: "2024010101", scores: [85, 90] },
        { name: "Rina Lestari", nim: "2024010103", scores: [62, 68] },
        { name: "Lina Marlina", nim: "2024010104", scores: [92, 95] },
      ],
    },
    "3": {
      id: 3,
      title: "Inisiasi Menyusu Dini",
      quizzes: ["Kuis IMD", "Kuis Akhir Modul"],
      students: [
        { name: "Anisa Putri", nim: "2024010102", scores: [80, 86] },
        { name: "Maya Sari", nim: "2024010105", scores: [72, 78] },
      ],
    },
  };

export function getLecturerGradebookDetail(moduleId: string) {
  return lecturerGradebookDetails[moduleId] ?? lecturerGradebookDetails["1"];
}

export function getLecturerGradebookRows(
  students: LecturerGradebookStudent[],
  search: string
): LecturerGradebookRow[] {
  const keyword = search.trim().toLowerCase();

  return students
    .map((student) => {
      const validScores = student.scores.filter(
        (score): score is number => typeof score === "number"
      );

      const average = validScores.length
        ? validScores.reduce((total, score) => total + score, 0) /
          validScores.length
        : 0;

      return {
        ...student,
        average,
      };
    })
    .filter((student) => {
      if (!keyword) return true;

      return (
        student.name.toLowerCase().includes(keyword) ||
        student.nim.includes(keyword)
      );
    });
}