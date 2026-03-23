import React, { useState } from 'react';
import Head from 'next/head';
import ImageUpload from '@/components/ImageUpload';
import ComparisonSlider from '@/components/ComparisonSlider';
import { fetchEnhancedImage } from '@/services/api';
import { Download, Sparkles, RefreshCw, Layers } from 'lucide-react';

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [enhancedUrl, setEnhancedUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Enhancement parameters
  const [params, setParams] = useState({
    brightness: 0,
    contrast: 1.0,
    clahe_limit: 2.0,
    sharpen: 1.0,
    grid_size: 8
  });

  const handleImageSelect = (file: File) => {
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setEnhancedUrl(null);
    setError(null);
  };

  const handleClear = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setEnhancedUrl(null);
    setError(null);
  };

  const handleEnhance = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setError(null);

    try {
      const resultUrl = await fetchEnhancedImage(selectedFile, params);
      setEnhancedUrl(resultUrl);
    } catch (err: any) {
      setError(err.message || 'An error occurred during processing');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!enhancedUrl) return;
    const link = document.createElement('a');
    link.href = enhancedUrl;
    link.download = 'enhanced_rugae.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-gray-900 selection:bg-premium-200">
      <Head>
        <title>YaisanaLabs - Palatal Rugae Enhancer</title>
        <meta name="description" content="AI-powered forensic palatal image enhancement" />
      </Head>

      {/* Navigation / Header */}
      <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
              {/* <Layers className="text-white" size={18} /> */}
              <div className="text-white font-bold text-xl">YS</div>
            </div>
            <span className="font-bold tracking-tight text-xl">YaisanaLabs</span>
          </div>
          <div className="hidden sm:flex items-center gap-6 text-sm font-medium text-gray-600">
            <a href="#" className="hover:text-black transition-colors">Documentation</a>
            <a href="#" className="hover:text-black transition-colors">Support</a>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 md:px-6 py-8 md:py-12 lg:py-20">
        {/* Hero Section */}
        <div className="text-center mb-10 md:mb-16 space-y-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-premium-900">
            Enhance Every Detail.
          </h1>
          <p className="text-lg md:text-xl text-premium-500 max-w-2xl mx-auto font-medium">
            Professional-grade palatal rugae pattern enhancement for forensic and clinical analysis.
          </p>
        </div>

        {/* Content Area */}
        <div className="grid gap-12">
          {!enhancedUrl ? (
            <div className="bg-white/40 rounded-3xl md:rounded-[40px] p-4 md:p-8 shadow-sm border border-white/60">
              <ImageUpload
                onImageSelect={handleImageSelect}
                previewUrl={previewUrl}
                onClear={handleClear}
                isProcessing={isProcessing}
              />

              {previewUrl && !isProcessing && (
                <div className="mt-8 md:mt-10 space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-2xl mx-auto px-0 md:px-4">
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm font-bold text-premium-600">
                        <span>Brightness</span>
                        <span>{params.brightness}</span>
                      </div>
                      <input
                        type="range" min="-100" max="100" value={params.brightness}
                        onChange={(e) => setParams({ ...params, brightness: parseInt(e.target.value) })}
                        className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
                      />
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm font-bold text-premium-600">
                        <span>Contrast</span>
                        <span>{params.contrast.toFixed(1)}x</span>
                      </div>
                      <input
                        type="range" min="0.5" max="3.0" step="0.1" value={params.contrast}
                        onChange={(e) => setParams({ ...params, contrast: parseFloat(e.target.value) })}
                        className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
                      />
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm font-bold text-premium-600">
                        <span>CLAHE Limit</span>
                        <span>{params.clahe_limit.toFixed(1)}</span>
                      </div>
                      <input
                        type="range" min="1.0" max="10.0" step="0.5" value={params.clahe_limit}
                        onChange={(e) => setParams({ ...params, clahe_limit: parseFloat(e.target.value) })}
                        className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
                      />
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm font-bold text-premium-600">
                        <span>Sharpening</span>
                        <span>{params.sharpen.toFixed(1)}</span>
                      </div>
                      <input
                        type="range" min="0" max="5.0" step="0.5" value={params.sharpen}
                        onChange={(e) => setParams({ ...params, sharpen: parseFloat(e.target.value) })}
                        className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
                      />
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm font-bold text-premium-600">
                        <span>Grid Size</span>
                        <span>{params.grid_size}x{params.grid_size}</span>
                      </div>
                      <input
                        type="range" min="4" max="32" step="4" value={params.grid_size}
                        onChange={(e) => setParams({ ...params, grid_size: parseInt(e.target.value) })}
                        className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
                      />
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <button
                      onClick={handleEnhance}
                      className="flex items-center gap-2 bg-black text-white px-8 py-4 rounded-full font-semibold hover:bg-gray-800 transition-all hover:scale-105 shadow-lg active:scale-95"
                    >
                      <Sparkles size={20} />
                      Enhance Image
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-8 md:space-y-12 animate-in fade-in duration-700">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-2 md:px-0">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 text-green-700 p-1.5 rounded-full">
                    <Sparkles size={18} />
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-premium-900">Enhancement Complete</h2>
                </div>
                <div className="flex flex-wrap gap-3 w-full sm:w-auto">
                  <button
                    onClick={handleClear}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-premium-100 text-premium-800 px-6 py-3 rounded-full font-bold text-sm hover:bg-premium-200 transition-all active:scale-95"
                  >
                    <RefreshCw size={16} />
                    Start Over
                  </button>
                  <button
                    onClick={handleDownload}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-black text-white px-6 py-3 rounded-full font-bold text-sm hover:bg-gray-800 transition-all shadow-md active:scale-95"
                  >
                    <Download size={16} />
                    Download
                  </button>
                </div>
              </div>

              <div className="max-w-3xl mx-auto w-full">
                <ComparisonSlider
                  beforeUrl={previewUrl!}
                  afterUrl={enhancedUrl}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                <div className="bg-white/60 backdrop-blur-sm p-6 rounded-3xl shadow-sm border border-white/80 transition-all hover:shadow-md">
                  <h3 className="font-bold text-premium-800 mb-2 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-premium-400 rounded-full"></div>
                    CLAHE Contrast
                  </h3>
                  <p className="text-sm text-premium-500 leading-relaxed text-pretty">Adaptive histogram equalization applied to local patches for optimal rugae visibility.</p>
                </div>
                <div className="bg-white/60 backdrop-blur-sm p-6 rounded-3xl shadow-sm border border-white/80 transition-all hover:shadow-md">
                  <h3 className="font-bold text-premium-800 mb-2 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-premium-400 rounded-full"></div>
                    Edge Sharpening
                  </h3>
                  <p className="text-sm text-premium-500 leading-relaxed text-pretty">Unsharp masking highlights transition zones between rugae ridges and furrows.</p>
                </div>
                <div className="bg-white/60 backdrop-blur-sm p-6 rounded-3xl shadow-sm border border-white/80 transition-all hover:shadow-md">
                  <h3 className="font-bold text-premium-800 mb-2 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-premium-400 rounded-full"></div>
                    Noise Reduction
                  </h3>
                  <p className="text-sm text-premium-500 leading-relaxed text-pretty">Gaussian smoothing eliminates sensor noise while preserving anatomical features.</p>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 text-red-600 p-6 rounded-3xl border border-red-100 font-medium">
              Error: {error}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-8 md:py-12 mt-12 md:mt-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6 text-center text-premium-400 text-sm">
          <p>© 2026 YaisanaLabs. Developed for Palatal Rugae Analysis.</p>
        </div>
      </footer>
    </div>
  );
}
