import 'dotenv/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listModels() {
    try {
        // There is no direct listModels on the client instance in some versions, 
        // but let's try to infer or just test a few standard ones.
        console.log("Testing common models...");

        const models = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-1.0-pro", "gemini-pro"];

        for (const modelName of models) {
            process.stdout.write(`Testing ${modelName}... `);
            try {
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent("Hello");
                console.log("SUCCESS");
            } catch (e) {
                console.log("FAILED: " + e.message.split(':')[0]); // Log short error
            }
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

listModels();
