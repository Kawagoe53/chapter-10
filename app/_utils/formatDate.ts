export const formatDate = (createdAt: string) => {
  const date = new Date(createdAt);
  return date.toLocaleDateString("ja-JP");
};
