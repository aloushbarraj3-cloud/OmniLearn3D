import { GoogleGenAI, Type, Schema } from "@google/genai";
import { LessonContent, QuizQuestion } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const modelName = "gemini-2.5-flash";

export const generateLessonContent = async (
  subject: string,
  branch: string,
  lessonNumber: number
): Promise<LessonContent> => {
  if (!apiKey) {
    return {
      title: "API Key Missing",
      content: "Please configure your Gemini API Key to view content.",
      visualPrompt: "Error icon"
    };
  }

  const prompt = `
    Create a comprehensive educational lesson for:
    Subject: ${subject}
    Branch: ${branch}
    Lesson Number: ${lessonNumber}
    
    The output must be a JSON object with:
    1. 'title': A catchy and relevant title for this specific lesson number.
    2. 'content': The lesson text in Markdown format. Use headers, bullet points, and clear language. Keep it under 500 words but informative.
    3. 'visualPrompt': A short description of a 3D diagram or visual aid that would best explain the core concept of this lesson (e.g., "A rotating 3D DNA double helix structure").
  `;

  const responseSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING },
      content: { type: Type.STRING },
      visualPrompt: { type: Type.STRING },
    },
    required: ["title", "content", "visualPrompt"],
  };

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response text");
    return JSON.parse(text) as LessonContent;
  } catch (error) {
    console.error("Gemini Lesson Error:", error);
    return {
      title: "Error Loading Lesson",
      content: "We could not generate this lesson at the moment. Please try again.",
      visualPrompt: "Broken robot"
    };
  }
};

export const generateQuiz = async (
  subject: string,
  branch: string,
  lessonTitle: string
): Promise<QuizQuestion[]> => {
  if (!apiKey) return [];

  const prompt = `
    Create a 5-question multiple choice quiz for a lesson titled "${lessonTitle}" in ${subject} (${branch}).
    
    Return a JSON array of objects. Each object must have:
    - question (string)
    - options (array of 4 strings)
    - correctAnswer (integer 0-3, index of the correct option)
    - explanation (string explaining why the answer is correct)
  `;

  const responseSchema: Schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        question: { type: Type.STRING },
        options: { type: Type.ARRAY, items: { type: Type.STRING } },
        correctAnswer: { type: Type.INTEGER },
        explanation: { type: Type.STRING },
      },
      required: ["question", "options", "correctAnswer", "explanation"],
    }
  };

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const text = response.text;
    if (!text) return [];
    return JSON.parse(text) as QuizQuestion[];
  } catch (error) {
    console.error("Gemini Quiz Error:", error);
    return [];
  }
};