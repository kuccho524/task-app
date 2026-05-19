export type TaskLike = {
  status: {
    isCompleted: boolean;
  };
};

export function countCompletedTasks(tasks: TaskLike[]) {
  return tasks.filter((task) => task.status.isCompleted).length;
}

export function calculateProgressRate(total: number, completed: number) {
  if (total === 0) return 0;

  return Math.round((completed / total) * 100);
}

export function getTaskProgress(tasks: TaskLike[]) {
  const totalTaskCount = tasks.length;
  const completedTaskCount = countCompletedTasks(tasks);
  const incompleteTaskCount = totalTaskCount - completedTaskCount;
  const progressRate = calculateProgressRate(
    totalTaskCount,
    completedTaskCount
  );

  return {
    totalTaskCount,
    completedTaskCount,
    incompleteTaskCount,
    progressRate,
  };
}