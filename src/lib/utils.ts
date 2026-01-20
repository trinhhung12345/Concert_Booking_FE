import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getYouTubeId(url: string | undefined | null): string | null {
  if (!url) return null;
  
  // LOG 1: Xem link đầu vào là gì
  // console.log("🔍 Input URL:", url); 

  try {
    // Regex đa năng tìm ID 11 ký tự
    // Hỗ trợ: youtube.com/watch?v=, youtu.be/, /v/, /vi/, /u/, /embed/, /shorts/
    const regExp = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|shorts\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#&?\/]*).*/;
    
    const match = url.match(regExp);

    if (match && match[1]) {
      // Lấy chuỗi bắt được
      let id = match[1];

      // LOG 2: Xem Regex bắt được gì
      console.log("⚠ Regex Match:", id);

      // --- BƯỚC QUAN TRỌNG: Cắt bỏ sạch sẽ rác nếu Regex bắt thừa ---
      // Nếu ID vẫn dính '&list=...', cắt ngay tại dấu '&' hoặc '?'
      if (id.includes('&')) id = id.split('&')[0];
      if (id.includes('?')) id = id.split('?')[0];

      // Chỉ lấy đúng 11 ký tự đầu tiên (Chuẩn YouTube ID)
      if (id.length > 11) id = id.substring(0, 11);

      // LOG 3: ID cuối cùng trả về
      console.log("✅ Final ID:", id);

      return id;
    }
  } catch (error) {
    console.warn('Error extracting YouTube ID:', error);
  }
  console.log("❌ No valid YouTube ID found.");
  return null;
}

export function getYouTubeThumbnail(videoId: string): string {
  console.log("Generating YouTube thumbnail for ID:", videoId);
  // Đảm bảo videoId sạch trước khi ghép link
  const cleanId = videoId.split('&')[0];
  console.log("🎬 YouTube Thumbnail ID:", cleanId);
  return `https://img.youtube.com/vi/${cleanId}/hqdefault.jpg`;
}

/**
 * Hàm làm sạch link ảnh YouTube bị lỗi
 * Input: https://img.youtube.com/vi/VIDEO_ID&list=.../hqdefault.jpg
 * Output: https://img.youtube.com/vi/VIDEO_ID/hqdefault.jpg
 */
export function cleanImageUrl(url: string | undefined | null): string {
  const PLACEHOLDER = "https://placehold.co/600x400?text=Event+Image";

  if (!url) return PLACEHOLDER;

  // Nếu là YouTube thumbnail URL bị lỗi (có &list hoặc &index trong path)
  if (url.includes('img.youtube.com/vi/')) {
    // Extract video ID from malformed URL like: .../vi/VIDEO_ID&list=.../hqdefault.jpg
    const match = url.match(/img\.youtube\.com\/vi\/([a-zA-Z0-9_-]{11})/);
    if (match && match[1]) {
      const videoId = match[1];
      // Detect quality from original URL
      let quality = 'hqdefault';
      if (url.includes('maxresdefault')) quality = 'maxresdefault';
      else if (url.includes('sddefault')) quality = 'sddefault';
      else if (url.includes('mqdefault')) quality = 'mqdefault';
      
      const cleanUrl = `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
      console.log("🔧 Fixed YouTube thumbnail:", url, "->", cleanUrl);
      return cleanUrl;
    }
  }

  return url;
}
