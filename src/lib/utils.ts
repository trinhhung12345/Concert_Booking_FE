import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Hàm tách YouTube ID từ mọi dạng link (kể cả link bẩn chứa list, index)
 */
export function getYouTubeId(url: string | undefined | null): string | null {
  if (!url) return null;

  // Regex này chấp nhận:
  // youtube.com/watch?v=ID
  // youtube.com/embed/ID
  // youtu.be/ID
  // Và tự động loại bỏ các tham số thừa như &list=...
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);

  return (match && match[2].length === 11) ? match[2] : null;
}

/**
 * Hàm tạo link thumbnail chất lượng cao từ ID
 */
export function getYouTubeThumbnail(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
}
