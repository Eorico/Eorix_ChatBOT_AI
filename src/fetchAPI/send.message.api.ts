import type { AiTypeResponse } from "../types/interfaces";

const fetchAIResponse = async (message: string): Promise<AiTypeResponse> => {
    try {
        const res = await fetch("https://eorix-chatbot-ai-backend-service-one.onrender.com/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message })
        });

        if (!res.ok) {
            throw new Error("Failed to get AI response.");
        }

        const data = await res.json();

        // ✅ Extract string safely
        let replyText: string;
        if (typeof data.reply === 'string') {
            replyText = data.reply;
        } else if (typeof data.reply === 'object' && data.reply !== null && 'text' in data.reply) {
            replyText = data.reply.text;  
        } else {
            replyText = "Sorry, I could not process that message";
        }

        return {
            reply: replyText,
            source: data.source,
            intent: data.intent
        };

    } catch (error) {
        console.error("Error fetching AI response:", error);
        return {
            reply: "Sorry, I could not process that message",
            source: 'none'
        };
    }
};

export default fetchAIResponse;
