"use server";

import fs from "fs";
import { createReadStream } from "fs";
import OpenAI  from "openai";
import { join } from "path";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function transcribeAudio(formData: FormData) {
    const audioFile = formData.get("audio") as File;

    const buffer = await audioFile.arrayBuffer();
    const audioBuffer = Buffer.from(buffer);

    const file_path = join(process.cwd(), audioFile.name);

    fs.writeFileSync(file_path, audioBuffer);

    const transcription = await openai.audio.transcriptions.create({
      file: createReadStream(audioFile.name),
      model: "whisper-1",
    });
    
    return { result: transcription.text };
}