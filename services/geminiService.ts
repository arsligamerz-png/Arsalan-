
import { GoogleGenAI, Chat, Content } from "@google/genai";
import { Message, ChatMode, Role } from '../types';
import { FUN_MODE_PROMPT, FOCUS_MODE_PROMPT } from '../constants';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

let chatSessions: { [key in ChatMode]?: Chat } = {};

function getChatSession(mode: ChatMode, history: Message[]): Chat {
    if (!chatSessions[mode]) {
        const systemInstruction = mode === ChatMode.Fun ? FUN_MODE_PROMPT : FOCUS_MODE_PROMPT;
        
        const geminiHistory: Content[] = history.map(msg => ({
            role: msg.role,
            parts: [{ text: msg.text }]
        }));

        chatSessions[mode] = ai.chats.create({
            model: 'gemini-2.5-flash',
            history: geminiHistory,
            config: {
                systemInstruction,
            },
        });
    }
    return chatSessions[mode] as Chat;
}

export async function getChatResponse(
    message: string,
    history: Message[],
    mode: ChatMode
) {
    // In a real app, you might want to reset the session if the mode changes
    // or handle history more robustly. For now, we get a fresh session if mode changes.
    if (chatSessions[mode] === undefined) {
      chatSessions = {}; // Reset sessions if mode is switched
    }

    const chat = getChatSession(mode, history.filter(m => m.role !== Role.Model || m.text !== ''));
    
    const result = await chat.sendMessageStream({ message });
    
    return result;
}
