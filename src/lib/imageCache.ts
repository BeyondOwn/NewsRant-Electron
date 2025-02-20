export const cacheImage = async (src: string): Promise<string> => {
  try {
    const response = await fetch(src);
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error('Error caching image:', error);
    return src;
  }
}; 