"use client";

import { useMemo, useState } from "react";

import { ModuleDetailBackButton } from "@/components/dashboard/student/modules/detail/ModuleDetailBackButton";
import { ModuleDetailToolbar } from "@/components/dashboard/student/modules/detail/ModuleDetailToolbar";
import { ModuleEvaluationTab } from "@/components/dashboard/student/modules/detail/ModuleEvaluationTab";
import { ModuleLearningTab } from "@/components/dashboard/student/modules/detail/ModuleLearningTab";
import { ModuleParticipantsTab } from "@/components/dashboard/student/modules/detail/ModuleParticipantsTab";
import { ModuleDetailHeader } from "@/components/dashboard/student/modules/ModuleDetailHeader";
import type { DetailTab } from "@/components/dashboard/student/modules/detail/ModuleDetailTabs";
import {
  getModuleContentSummary,
} from "@/data/learning/shared/learning-modules";
import type { LearningModule } from "@/types/learning";

interface StudentModuleDetailClientProps {
  module: LearningModule;
}

export function StudentModuleDetailClient({
  module,
}: StudentModuleDetailClientProps) {
  const [tab, setTab] = useState<DetailTab>("pembelajaran");
  const [searchQuery, setSearchQuery] = useState("");

  const keyword = searchQuery.trim().toLowerCase();

  const filteredLearningItems = useMemo(() => {
    if (!keyword) return module.items;

    return module.items.filter((item) =>
      item.title.toLowerCase().includes(keyword)
    );
  }, [keyword, module.items]);

  const filteredQuizItems = useMemo(() => {
    return module.items.filter((item) => {
      const isQuiz = item.kind === "kuis";
      const matchKeyword = keyword
        ? item.title.toLowerCase().includes(keyword)
        : true;

      return isQuiz && matchKeyword;
    });
  }, [keyword, module.items]);

  const filteredParticipants = useMemo(() => {
    if (!keyword) return module.participants;

    return module.participants.filter((participant) => {
      return (
        participant.name.toLowerCase().includes(keyword) ||
        participant.email.toLowerCase().includes(keyword)
      );
    });
  }, [keyword, module.participants]);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <ModuleDetailBackButton />

      <ModuleDetailHeader
        info={{
          banner: module.banner,
          title: module.title,
          progress: module.progress,
          description: module.description,
          estimatedTime: module.estimatedTime,
          contentSummary: getModuleContentSummary(module.items),
          objectives: module.objectives,
          instructor: module.instructor,
        }}
      />

      <ModuleDetailToolbar
        activeTab={tab}
        searchQuery={searchQuery}
        onTabChange={setTab}
        onSearchChange={setSearchQuery}
      />

      {tab === "pembelajaran" && (
        <ModuleLearningTab moduleId={module.id} items={filteredLearningItems} />
      )}

      {tab === "evaluasi" && (
        <ModuleEvaluationTab moduleId={module.id} items={filteredQuizItems} />
      )}

      {tab === "peserta" && (
        <ModuleParticipantsTab
          instructor={module.instructor}
          participants={filteredParticipants}
        />
      )}
    </div>
  );
}