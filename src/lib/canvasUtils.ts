// src/lib/canvasUtils.ts

export const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous");
    image.src = url;
  });

export async function getCroppedImg(
  imageSrc: string,
  pixelCrop: { x: number; y: number; width: number; height: number },
  flip = { horizontal: false, vertical: false }
): Promise<Blob | null> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return null;
  }

  // Set kích thước canvas bằng kích thước vùng crop
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.translate(-pixelCrop.x, -pixelCrop.y);

  ctx.drawImage(
    image,
    0,
    0,
    image.width,
    image.height
  );

  return new Promise((resolve) => {
    canvas.toBlob((file) => {
      resolve(file);
    }, "image/jpeg", 0.95); // Nén ảnh JPEG chất lượng 95%
  });
}
