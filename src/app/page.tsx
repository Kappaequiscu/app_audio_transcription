"use client";

import { transcribeAudio } from "@/app/actions";
import { useState, useRef } from "react";

export default function Home() {
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (file: File | null) => {
    if (file) {
      const maxSize = 25 * 1024 * 1024;
      if (file.size > maxSize) {
        const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
        setResult(`Error: El fitxer és massa gran (${sizeMB} MB). La mida màxima és de 25 MB.`);
        setSelectedFile(null);
        return;
      }
      setSelectedFile(file);
      setResult("");
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!loading) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (loading) return;
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("audio/")) {
      handleFileChange(file);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (!selectedFile) {
      setResult("No s'ha seleccionat cap fitxer d'àudio.");
      return;
    }

    setLoading(true);
    const formDataToSend = new FormData();
    formDataToSend.append("audio", selectedFile);
    const response = await transcribeAudio(formDataToSend);
    setResult(response.result);
    setLoading(false);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-1.5 sm:p-2 rounded-lg sm:rounded-xl shadow-lg">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Transcriptor d'Àudio
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">Converteix els teus àudios a text amb IA</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-12 max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Upload Area */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 border border-gray-100">
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => !loading && fileInputRef.current?.click()}
              className={`relative border-3 border-dashed rounded-xl p-6 sm:p-8 md:p-12 text-center transition-all duration-300 ${
                loading
                  ? "border-gray-200 bg-gray-50 cursor-not-allowed opacity-60"
                  : isDragging
                  ? "border-indigo-500 bg-indigo-50 scale-105 cursor-pointer"
                  : "border-gray-300 hover:border-indigo-400 hover:bg-gray-50 cursor-pointer"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                name="audio"
                className="hidden"
                accept="audio/mp3,audio/mp4,audio/mpeg,audio/mpga,audio/ogg,audio/flac,audio/m4a,audio/wav,audio/webm"
                onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
              />

              {!selectedFile ? (
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex justify-center">
                    <div className="bg-gradient-to-br from-indigo-100 to-purple-100 p-3 sm:p-4 rounded-full">
                      <svg className="w-10 h-10 sm:w-12 sm:h-12 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                  </div>
                  <div className="px-2">
                    <p className="text-base sm:text-lg font-semibold text-gray-700">
                      Arrossega el teu fitxer aquí o fes clic per seleccionar
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500 mt-2">
                      Formats: MP3, MP4, MPEG, MPGA, OGA, OGG, FLAC, M4A, WAV, WEBM
                    </p>
                    <p className="text-xs text-gray-400 mt-1">Mida màxima: 25 MB</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex justify-center">
                    <div className="bg-green-100 p-3 sm:p-4 rounded-full">
                      <svg className="w-10 h-10 sm:w-12 sm:h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="font-semibold text-gray-800 truncate">{selectedFile.name}</p>
                    <p className="text-sm text-gray-500">{formatFileSize(selectedFile.size)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!loading) {
                        setSelectedFile(null);
                        setResult("");
                      }
                    }}
                    disabled={loading}
                    className={`text-sm font-medium ${
                      loading
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-red-600 hover:text-red-700"
                    }`}
                  >
                    Eliminar fitxer
                  </button>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !selectedFile}
              className={`w-full mt-4 sm:mt-6 py-3 sm:py-4 px-4 sm:px-6 rounded-xl font-semibold text-base sm:text-lg transition-all duration-300 transform ${
                loading || !selectedFile
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 hover:shadow-xl hover:scale-105 active:scale-95"
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-3">
                  <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Transcrivint l'àudio...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>Transcriure Àudio</span>
                </div>
              )}
            </button>
          </div>

          {/* Result Area */}
          {result && (
            <div className={`bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 border animate-fade-in ${
              result.startsWith("Error") ? "border-red-200" : "border-green-200"
            }`}>
              <div className="flex items-start gap-2 sm:gap-3 mb-4">
                {result.startsWith("Error") ? (
                  <div className="bg-red-100 p-1.5 sm:p-2 rounded-lg flex-shrink-0">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                ) : (
                  <div className="bg-green-100 p-1.5 sm:p-2 rounded-lg flex-shrink-0">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className={`font-bold text-base sm:text-lg ${result.startsWith("Error") ? "text-red-900" : "text-green-900"}`}>
                    {result.startsWith("Error") ? "Error" : "Transcripció Completada"}
                  </h3>
                  <p className={`text-xs sm:text-sm ${result.startsWith("Error") ? "text-red-600" : "text-green-600"}`}>
                    {result.startsWith("Error") ? "Hi ha hagut un problema" : "El teu àudio s'ha transcrit correctament"}
                  </p>
                </div>
                <div className="relative flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(result);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Copiar al portapapers"
                  >
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                  {copied && (
                    <div className="absolute -top-10 right-0 bg-gray-900 text-white text-xs py-1.5 px-3 rounded-lg shadow-lg animate-tooltip whitespace-nowrap">
                      <span className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Copiat!
                      </span>
                      <div className="absolute -bottom-1 right-4 w-2 h-2 bg-gray-900 transform rotate-45"></div>
                    </div>
                  )}
                </div>
              </div>
              <div className={`p-3 sm:p-4 rounded-lg ${result.startsWith("Error") ? "bg-red-50" : "bg-gray-50"}`}>
                <p className={`whitespace-pre-wrap text-sm sm:text-base ${result.startsWith("Error") ? "text-red-800" : "text-gray-800"}`}>
                  {result}
                </p>
              </div>
            </div>
          )}
        </form>

        {/* Info Cards */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mt-6 sm:mt-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-lg sm:rounded-xl p-4 sm:p-5 border border-gray-100">
            <div className="text-indigo-600 mb-2">
              <svg className="w-7 h-7 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h4 className="font-semibold text-sm sm:text-base text-gray-800">Ràpid i Precís</h4>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">Transcripció amb IA d'OpenAI Whisper</p>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-lg sm:rounded-xl p-4 sm:p-5 border border-gray-100">
            <div className="text-purple-600 mb-2">
              <svg className="w-7 h-7 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h4 className="font-semibold text-sm sm:text-base text-gray-800">Segur i Privat</h4>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">Els teus arxius es processen de forma segura</p>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-lg sm:rounded-xl p-4 sm:p-5 border border-gray-100 sm:col-span-2 md:col-span-1">
            <div className="text-pink-600 mb-2">
              <svg className="w-7 h-7 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
            </div>
            <h4 className="font-semibold text-sm sm:text-base text-gray-800">Múltiples Formats</h4>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">Suporta MP3, WAV, M4A i més</p>
          </div>
        </div>
      </div>
    </main>
  );
}