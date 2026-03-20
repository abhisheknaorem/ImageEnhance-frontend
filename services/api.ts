export const fetchEnhancedImage = async (
  imageFile: File, 
  params: { brightness: number, contrast: number, clahe_limit: number, sharpen: number, grid_size: number }
): Promise<string> => {
  const formData = new FormData();
  formData.append('file', imageFile);

  const url = new URL('http://localhost:8000/api/enhance');
  url.searchParams.append('brightness', params.brightness.toString());
  url.searchParams.append('contrast', params.contrast.toString());
  url.searchParams.append('clahe_limit', params.clahe_limit.toString());
  url.searchParams.append('sharpen', params.sharpen.toString());
  url.searchParams.append('grid_size', params.grid_size.toString());

  const response = await fetch(url.toString(), {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to enhance image');
  }

  const blob = await response.blob();
  return URL.createObjectURL(blob);
};
