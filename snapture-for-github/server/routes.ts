import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";
import { generateMemorySchema } from "@shared/schema";

// OpenRouter.ai setup for GPT-3.5
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

// Hugging Face for free image generation
const HUGGINGFACE_API_URL = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0";

async function generateWithOpenRouter(prompt: string, intensity: number): Promise<string> {
  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error('Missing required OpenRouter API key: OPENROUTER_API_KEY');
  }

  try {
    // Adjust temperature based on intensity level
    const temperatureMap = {
      1: 0.3, // Conservative
      2: 0.5, // Mild
      3: 0.7, // Balanced
      4: 0.9, // Bold
      5: 1.1  // Extreme
    };

    const temperature = temperatureMap[intensity as keyof typeof temperatureMap] || 0.7;

    const response = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://snapture.app",
        "X-Title": "Snapture Memory Generator"
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a creative writer specializing in transforming daily moments into vivid visual memories. Create detailed, artistic descriptions that capture how the moment would be remembered 5 years from now. Focus on visual elements, emotions, and atmosphere. Keep responses under 200 characters."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 150,
        temperature: temperature,
        top_p: 0.9
      })
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const result = await response.json();
    
    if (result.choices && result.choices.length > 0 && result.choices[0].message?.content) {
      return result.choices[0].message.content.trim();
    }
    
    throw new Error("No generated text received");
  } catch (error) {
    console.error("OpenRouter API error:", error);
    throw error;
  }
}



// Stripe setup
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-05-28.basil",
});

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Generate memory endpoint
  app.post("/api/generate-memory", async (req, res) => {
    try {
      const validatedData = generateMemorySchema.parse(req.body);
      const { momentText, style, intensity } = validatedData;

      // Create intensity-based prompt modifiers
      const intensityModifiers = {
        1: "subtle and realistic",
        2: "gentle with light creative touches", 
        3: "balanced and moderately creative",
        4: "bold and highly imaginative",
        5: "extreme creative freedom with wild imagination"
      };

      // Create style-specific visual prompts for image generation
      const stylePrompts = {
        nostalgic: "Create a warm, nostalgic visual scene that captures the essence of this memory. Use soft, golden lighting, vintage aesthetic, and emotional atmosphere.",
        funny: "Create a humorous, playful visual scene with bright colors, exaggerated expressions, and comedic elements that capture the fun aspects of this moment.",
        absurd: "Create a surreal, dreamlike visual scene with unexpected elements, impossible physics, and fantastical imagery that transforms reality into art.",
        poetic: "Create a beautiful, artistic visual scene with elegant composition, soft lighting, metaphorical elements, and a sense of deeper meaning."
      };

      const intensityInstruction = intensityModifiers[intensity as keyof typeof intensityModifiers];

      const prompt = `${stylePrompts[style]} Be ${intensityInstruction} in your visual interpretation.

Original moment: "${momentText}"

Create a detailed visual description for AI image generation that captures this moment as it would be remembered 5 years from now. Focus on visual elements: lighting, colors, composition, mood, artistic style, and atmosphere. Include specific details about the scene, characters, and environment.

Respond with only a detailed visual description for image generation.`;

      let generatedMemory: string;
      let imageUrl: string;
      
      try {
        // Create visual description directly based on style and intensity
        const styleDescriptions = {
          nostalgic: "warm, golden lighting, vintage aesthetic, emotional atmosphere",
          funny: "bright colors, playful elements, cheerful mood",
          absurd: "surreal, dreamlike, fantastical imagery, impossible physics",
          poetic: "elegant composition, soft lighting, artistic beauty"
        };

        const intensityModifiers = {
          1: "subtle and gentle",
          2: "moderately enhanced",
          3: "creatively balanced",
          4: "dramatically bold",
          5: "extremely imaginative"
        };

        const visualDescription = `A beautiful ${styleDescriptions[style]} scene depicting: ${momentText}. ${intensityModifiers[intensity as keyof typeof intensityModifiers]} artistic interpretation, high quality digital art, detailed, atmospheric.`;
        
        // Generate AI image with optimized Pollinations.ai service
        const cleanPrompt = visualDescription
          .replace(/[^a-zA-Z0-9\s,.-]/g, '')
          .replace(/\s+/g, ' ')
          .trim()
          .substring(0, 200);

        const encodedPrompt = encodeURIComponent(cleanPrompt);
        const seed = Math.floor(Math.random() * 100000);
        
        // Generate Pollinations URL
        const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&seed=${seed}&nologo=true`;
        
        console.log("Generated Pollinations URL:", pollinationsUrl);
        
        // Create proxy URL for reliable image serving
        imageUrl = `/api/image-proxy/temp?url=${encodeURIComponent(pollinationsUrl)}`;
        
        // Store the visual description for reference
        generatedMemory = visualDescription;

        
      } catch (error) {
        console.error("Error generating visual memory:", error);
        return res.status(500).json({ 
          error: "Failed to generate visual memory. Please try again." 
        });
      }

      // Save the memory to storage
      const memory = await storage.createMemory({
        momentText,
        style,
        generatedMemory,
        imageUrl,
        isPremium: false
      });

      res.json(memory);
    } catch (error: any) {
      console.error("Error generating memory:", error);
      res.status(500).json({ 
        message: error.message || "Failed to generate memory. Please try again." 
      });
    }
  });

  // Stripe payment route for both single purchases and premium
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      const { amount, type, memoryId } = req.body;
      
      if (!amount || (type === 'single' && !memoryId)) {
        return res.status(400).json({ message: "Missing required parameters" });
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount), // Amount in cents
        currency: "eur",
        metadata: {
          type,
          ...(memoryId && { memoryId: memoryId.toString() })
        }
      });

      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      console.error("Error creating payment intent:", error);
      res.status(500).json({ 
        message: "Error creating payment intent: " + error.message 
      });
    }
  });

  // Webhook to handle successful payments
  app.post("/api/stripe-webhook", async (req, res) => {
    try {
      // In a real implementation, you would verify the webhook signature
      const event = req.body;

      if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object;
        const { type, memoryId } = paymentIntent.metadata;

        // Create purchase record
        await storage.createPurchase({
          memoryId: memoryId ? parseInt(memoryId) : null,
          amount: paymentIntent.amount,
          stripePaymentIntentId: paymentIntent.id
        });

        // If it's a single purchase, upgrade the memory to premium
        if (type === 'single' && memoryId) {
          await storage.updateMemoryPremiumStatus(parseInt(memoryId), true);
        }
      }

      res.json({ received: true });
    } catch (error: any) {
      console.error("Webhook error:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // Get memory endpoint
  app.get("/api/memory/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const memory = await storage.getMemory(id);
      
      if (!memory) {
        return res.status(404).json({ message: "Memory not found" });
      }

      res.json(memory);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Image proxy endpoint to handle CORS and loading issues
  app.get("/api/image-proxy/:id", async (req, res) => {
    try {
      const { url } = req.query;
      
      if (!url || typeof url !== 'string') {
        return res.status(400).json({ error: "URL parameter required" });
      }

      console.log("Proxying image from:", url);

      // Fetch the image from the external URL
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; Snapture/1.0)'
        }
      });

      if (!response.ok) {
        console.error("Failed to fetch image:", response.status);
        return res.status(response.status).json({ error: "Failed to fetch image" });
      }

      // Get the image data
      const imageBuffer = await response.arrayBuffer();
      const contentType = response.headers.get('content-type') || 'image/jpeg';

      // Set appropriate headers
      res.set({
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
        'Access-Control-Allow-Origin': '*'
      });

      // Send the image data
      res.send(Buffer.from(imageBuffer));

    } catch (error) {
      console.error("Image proxy error:", error);
      res.status(500).json({ error: "Image proxy failed" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
