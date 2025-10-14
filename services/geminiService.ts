import { GoogleGenAI, Modality, Part, Type } from "@google/genai";
import { UploadedFile, CarouselSlide } from "../types";

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
      contents: { parts },
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

interface CarouselPagePlan {
  image_prompt: string;
}

export async function generateCarouselImages(
  idea: string,
  numPages: number,
  style: string,
  promptTemplate: string
): Promise<CarouselSlide[]> {
  // Step 1: Generate the plan (prompts for each image)
  const planPrompt = promptTemplate
    .replace(/\[NUM_PAGES\]/g, String(numPages))
    .replace(/\[STYLE\]/g, style)
    .replace(/\[CAROUSEL_IDEA\]/g, idea);
  
  let carouselPlan: CarouselPagePlan[] = [];

  try {
    const textResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: planPrompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              image_prompt: {
                type: Type.STRING,
                description: 'A detailed prompt for a text-to-image AI to generate the visual for this page.'
              },
            },
            required: ['image_prompt']
          },
        },
      },
    });

    const jsonString = textResponse.text.trim();
    carouselPlan = JSON.parse(jsonString);

    if (!Array.isArray(carouselPlan) || carouselPlan.length === 0) {
      throw new Error('Failed to generate a valid carousel plan.');
    }

  } catch (error) {
    console.error("Error generating carousel plan:", error);
    throw new Error("AI failed to create a plan for the carousel. Please try rephrasing your idea.");
  }
  
  // Step 2: Generate images for each prompt in parallel
  try {
    const imageGenerationPromises = carouselPlan.map(page => 
      ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: page.image_prompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: '1:1', // Good for social media
        },
      })
    );

    const imageResponses = await Promise.all(imageGenerationPromises);

    const slides: CarouselSlide[] = imageResponses.map((response) => {
      if (response.generatedImages && response.generatedImages.length > 0) {
        const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
        return {
          imageUrl: `data:image/jpeg;base64,${base64ImageBytes}`,
        };
      }
      throw new Error('An image could not be generated for one of the pages.');
    });

    return slides;
  } catch (error) {
    console.error("Error generating carousel images:", error);
    throw new Error("Failed to generate one or more carousel images. Please try again.");
  }
}