export function formatDate(date: Date | null, fallback = '未設定') {
  if (!date) return fallback;

  return date.toLocaleDateString('ja-JP');
}

export function formatDateTime(date: Date | null, fallback = '未設定') {
  if (!date) return fallback;

  return date.toLocaleString('ja-JP');
}