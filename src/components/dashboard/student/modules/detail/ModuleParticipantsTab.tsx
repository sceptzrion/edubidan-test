import { InstructorCard } from "@/components/dashboard/student/modules/InstructorCard";
import { ModuleDetailEmptyState } from "@/components/dashboard/student/modules/detail/ModuleDetailEmptyState";
import { ParticipantItem } from "@/components/dashboard/student/modules/ParticipantItem";

interface Instructor {
  name: string;
  email: string;
}

interface Participant {
  id: number;
  name: string;
  email: string;
}

interface ModuleParticipantsTabProps {
  instructor: Instructor;
  participants: Participant[];
}

export function ModuleParticipantsTab({
  instructor,
  participants,
}: ModuleParticipantsTabProps) {
  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
      <h2 className="text-xs sm:text-sm font-extrabold text-muted-foreground uppercase tracking-wider mb-3 sm:mb-4 px-1.5">
        Instruktur
      </h2>

      <InstructorCard instructor={instructor} />

      <h2 className="text-xs sm:text-sm font-extrabold text-muted-foreground uppercase tracking-wider mb-3 sm:mb-4 px-1.5">
        Peserta ({participants.length})
      </h2>

      <div className="bg-card rounded-2xl sm:rounded-3xl border border-border overflow-hidden shadow-sm">
        {participants.length > 0 ? (
          participants.map((participant, index) => (
            <ParticipantItem
              key={participant.id}
              participant={participant}
              isLast={index === participants.length - 1}
            />
          ))
        ) : (
          <ModuleDetailEmptyState message="Peserta tidak ditemukan." />
        )}
      </div>
    </div>
  );
}