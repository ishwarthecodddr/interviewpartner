import Vapi from "@vapi-ai/web";

// Initialize VAPI with your token
const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN!);

// Create an assistant instance
const assistant = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID || "";

export { vapi, assistant };
