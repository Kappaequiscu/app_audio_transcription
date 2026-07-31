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

    // Validate file size (25 MB max for OpenAI Whisper API)
    const maxSize = 25 * 1024 * 1024; // 25 MB in bytes
    if (audioFile.size > maxSize) {
      return { 
        result: "Error: El fitxer és massa gran. La mida màxima és de 25 MB.",
        error: true 
      };
    }

    const buffer = await audioFile.arrayBuffer();
    const audioBuffer = Buffer.from(buffer);
    // NETLIFY
    const filePath = join('/tmp', audioFile.name);
    // WINDOWS
    // const filePath = join(process.cwd(), audioFile.name);

    await fs.writeFile(filePath, audioBuffer);

    try {
      const transcription = await openai.audio.transcriptions.create({
        file: createReadStream(filePath),
        model: "whisper-1",
      });
  
      return { result: transcription.text, error: false };
    } catch (error: any) {
      console.error("Error transcribing audio:", error);
      
      let errorMessage = "Error al transcriure l'àudio.";
      
      if (error?.message?.includes('file size')) {
        errorMessage = "Error: El fitxer és massa gran per a la API d'OpenAI (màxim 25 MB).";
      } else if (error?.message?.includes('format')) {
        errorMessage = "Error: Format d'àudio no compatible.";
      } else if (error?.status === 401) {
        errorMessage = "Error: Clau API d'OpenAI no vàlida.";
      }
      
      return { result: errorMessage, error: true };
    } finally {
      // Delete the file after transcription
      try {
        await fs.unlink(filePath);
      } catch (unlinkError) {
        console.error("Error deleting temporary file:", unlinkError);
      }
    }
}