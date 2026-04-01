export const formatDate = (createdAt: Date) => {
  const date = new Date(createdAt);
  return date.toLocaleDateString("ja-JP");
};
