"use server";

import fs from "fs/promises";
import { createReadStream } from "fs";
import { join } from "path";
import OpenAI  from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function transcribeAudio(formData: FormData) {
    const audioFile = formData.get("audio") as File;

    const buffer = await audioFile.arrayBuffer();
    const audioBuffer = Buffer.from(buffer);
    // NETLIFY
    const filePath = join('/tmp', audioFile.name);
    // WINDOWS
    // const filePath = join(process.cwd(), audioFile.name);

    fs.writeFile(filePath, audioBuffer);

    try {
      const transcription = await openai.audio.transcriptions.create({
        file: createReadStream(filePath),
        model: "whisper-1",
      });
  
      return { result: transcription.text };
    } catch (error) {
      return { result: "Error al transcriure l'àudio." };
    } finally {
      // Delete the file after transcription
      await fs.unlink(filePath);
    }
}