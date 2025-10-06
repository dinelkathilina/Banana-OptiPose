import { GoogleGenAI, Modality, Part } from "@google/genai";
import { UploadedFile } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export async function generateImage(
  baseImage: UploadedFile,
  styleImage: UploadedFile | null,
  prompt: string
): Promise<string> {
  try {
    const parts: Part[] = [
      {
        inlineData: {
          data: baseImage.base64,
          mimeType: baseImage.type,
        },
      },
    ];

    if (styleImage) {
      parts.push({
        inlineData: {
          data: styleImage.base64,
          mimeType: styleImage.type,
        },
      });
    }

    parts.push({ text: prompt });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: parts,
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const base64ImageBytes: string = part.inlineData.data;
        return `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
      }
    }
    
    throw new Error("No image was generated in the response.");

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to generate image. Please check your API key and network connection.");
  }
}