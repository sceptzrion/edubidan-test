interface ModuleDetailEmptyStateProps {
  message: string;
}

export function ModuleDetailEmptyState({ message }: ModuleDetailEmptyStateProps) {
  return (
    <p className="text-center text-sm text-muted-foreground py-10">
      {message}
    </p>
  );
}