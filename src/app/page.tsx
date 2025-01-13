"use client";

import { transcribeAudio } from "@/app/actions";
import { useState } from "react";

export default function Home() {
  const [result, setResult] = useState("Aquí apareixerà la transcripció del àudio.");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const audioFile = formData.get("audio");

    if (audioFile) {
      const formDataToSend = new FormData();
      formDataToSend.append("audio", audioFile as Blob);
      const response = await transcribeAudio(formDataToSend);
      setResult(response.result);
    } else {
      setResult("No s'ha seleccionat cap fitxer d'àudio.");
    }

    setLoading(false);
  };

  return (
    <main className="flex flex-col min-h-screen items-center justify-center">

      <h1 className="text-4xl font-bold p-10">Transcriure àudio</h1>

      <div className="p-4 grid grid-cols-2 gap-2">
        <div className="flex flex-col items-center">
          <form onSubmit={handleSubmit}>
            <label htmlFor="audio" className="block">
              Formats admesos: mp3, mp4, mpeg, mpga, oga, ogg, flac, m4a, wav i webm.
            </label>
            <input type="file" name="audio" className="w-96 p-4" />
            <button className="bg-blue-500 text-white p-2 rounded" disabled={loading}>
              {
                loading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Carregant...
                  </div>
                ) : (
                  "Pujar"
                )
              }
            </button>
          </form>
        </div>
        <div>
          {result}
        </div>
      </div>
    </main>
  );
}