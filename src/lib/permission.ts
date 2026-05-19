export function canEditResource(createdBy: string, userId: string) {
  return createdBy === userId;
}

export function canDeleteProject(taskCount: number) {
  return taskCount === 0;
}