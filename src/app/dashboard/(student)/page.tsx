import { Role } from "@prisma/client";

import { ContinueLearningSection } from "@/components/dashboard/student/home/ContinueLearningSection";
import { PendingQuizSection } from "@/components/dashboard/student/home/PendingQuizSection";
import { StudentDashboardHeader } from "@/components/dashboard/student/home/StudentDashboardHeader";
import { StudentStatsGrid } from "@/components/dashboard/student/home/StudentStatsGrid";
import { StudyTipsCard } from "@/components/dashboard/student/home/StudyTipsCard";
import { getStudentDashboardData } from "@/data/learning/student/student-learning.server";
import { requireRole } from "@/lib/auth/guards";

export default async function StudentDashboardHome() {
  const currentUser = await requireRole("/dashboard", [Role.MAHASISWA]);

  const dashboardData = await getStudentDashboardData({
    userId: currentUser.id,
    studentFullName: currentUser.name,
  });

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <StudentDashboardHeader studentName={dashboardData.studentName} />

      <StudentStatsGrid stats={dashboardData.stats} />

      <div className="grid lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8">
        <ContinueLearningSection modules={dashboardData.learningProgress} />

        <aside className="space-y-5 sm:space-y-6 md:space-y-8">
          <PendingQuizSection quizzes={dashboardData.pendingQuizzes} />
          <StudyTipsCard />
        </aside>
      </div>
    </div>
  );
}