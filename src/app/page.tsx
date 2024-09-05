"use client";

import { transcribeAudio } from "@/app/actions";
import { useFormState } from "react-dom";

export default function Home() {
  const initialState = { result: "Aquí apareixerà la transcripció del àudio." };
  const [state, formAction] = useFormState((state: any, payload: any) => transcribeAudio(payload), initialState);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold p-10">Transcriure àudio</h1>
      <div className="p-4">
        <form action={formAction}>
          <label htmlFor="audio" className="block">
            Formats admesos: mp3, mp4, mpeg, mpga, oga, ogg, flac, m4a, wav i webm.
          </label>
          <input type="file" name="audio" className="w-96 p-4" />
          <button className="bg-blue-500 text-white p-2 rounded">Pujar</button>
        </form>
      </div>
      <div className="p-2">
        <p>{state?.result}</p>
      </div>
    </main>
  );
}