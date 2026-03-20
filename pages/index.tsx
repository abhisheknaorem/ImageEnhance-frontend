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
        <title>Palatal Rugae Enhancer</title>
        <meta name="description" content="AI-powered forensic palatal image enhancement" />
      </Head>

      {/* Navigation / Header */}
      <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <Layers className="text-white" size={18} />
            </div>
            <span className="font-bold tracking-tight text-xl">Yaisanalabs</span>
          </div>
          <div className="flex items-center gap-6 text-sm font-medium text-gray-600">
            <a href="#" className="hover:text-black transition-colors">Documentation</a>
            <a href="#" className="hover:text-black transition-colors">Support</a>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-12 lg:py-20">
        {/* Hero Section */}
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight text-premium-900">
            Enhance Every Detail.
          </h1>
          <p className="text-xl text-premium-500 max-w-2xl mx-auto font-medium">
            Professional-grade palatal rugae pattern enhancement for forensic and clinical analysis.
          </p>
        </div>

        {/* Content Area */}
        <div className="grid gap-12">
          {!enhancedUrl ? (
            <div className="bg-white/40 rounded-[40px] p-8 shadow-sm border border-white/60">
              <ImageUpload
                onImageSelect={handleImageSelect}
                previewUrl={previewUrl}
                onClear={handleClear}
                isProcessing={isProcessing}
              />

              {previewUrl && !isProcessing && (
                <div className="mt-10 space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto px-4">
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
            <div className="space-y-8 animate-in fade-in duration-700">
              <div className="flex items-center justify-between px-4">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 text-green-700 p-1 rounded-full">
                    <Sparkles size={16} />
                  </div>
                  <h2 className="text-xl font-bold">Enhancement Complete</h2>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={handleClear}
                    className="flex items-center gap-2 bg-premium-100 text-premium-800 px-5 py-2.5 rounded-full font-bold text-sm hover:bg-premium-200 transition-all"
                  >
                    <RefreshCw size={16} />
                    Start Over
                  </button>
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-full font-bold text-sm hover:bg-gray-800 transition-all"
                  >
                    <Download size={16} />
                    Download PNG
                  </button>
                </div>
              </div>

              <ComparisonSlider
                beforeUrl={previewUrl!}
                afterUrl={enhancedUrl}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                  <h3 className="font-bold text-premium-800 mb-2">CLAHE Contrast</h3>
                  <p className="text-sm text-premium-500">Adaptive histogram equalization applied to local patches for optimal rugae visibility.</p>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                  <h3 className="font-bold text-premium-800 mb-2">Edge Sharpening</h3>
                  <p className="text-sm text-premium-500">Unsharp masking highlights transition zones between rugae ridges and furrows.</p>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                  <h3 className="font-bold text-premium-800 mb-2">Noise Reduction</h3>
                  <p className="text-sm text-premium-500">Gaussian smoothing eliminates sensor noise while preserving anatomical features.</p>
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
      <footer className="border-t border-gray-200 bg-white py-12 mt-20">
        <div className="max-w-7xl mx-auto px-6 text-center text-premium-400 text-sm">
          <p>© 2026 RugaeVision Forensic Tool. Developed for Palatal Rugae Analysis.</p>
        </div>
      </footer>
    </div>
  );
}
