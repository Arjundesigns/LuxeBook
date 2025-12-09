
import { GoogleGenAI } from "@google/genai";

// Initialize Gemini
// Note: process.env.API_KEY is assumed to be available.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Identify the human-readable location name (City, Region) from coordinates using PositionStack API.
 */
export async function getLocationName(lat: number, lng: number): Promise<string> {
  const POSITION_STACK_KEY = "258f84c8f3f0f6de305b4191ba26ed42";
  
  try {
    // Attempt to use PositionStack API.
    // Use an AbortController to timeout quickly if it hangs (e.g. mixed content blocking behavior)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const response = await fetch(`http://api.positionstack.com/v1/reverse?access_key=${POSITION_STACK_KEY}&query=${lat},${lng}`, {
        signal: controller.signal
    });
    clearTimeout(timeoutId);
    
    if (!response.ok) {
        throw new Error(`PositionStack API Error: ${response.statusText}`);
    }

    const json = await response.json();
    
    if (json.data && json.data.length > 0) {
        // Prioritize 'locality', 'city', or 'neighbourhood' types to avoid showing specific street addresses
        const bestMatch = json.data.find((d: any) => 
            ['locality', 'city', 'neighbourhood'].includes(d.type)
        ) || json.data[0];
        
        const city = bestMatch.locality || bestMatch.city || bestMatch.name;
        const region = bestMatch.region_code || bestMatch.region; 
        
        if (city && region) {
            return `${city}, ${region}`;
        } else if (city) {
            return city;
        } else if (bestMatch.label) {
            return bestMatch.label;
        }
    }
    
    throw new Error("No data from PositionStack");
  } catch (e) {
    console.warn("PositionStack lookup failed or timed out. Falling back to Gemini.", e);
    
    // Fallback: Use Gemini with Google Maps Grounding
    try {
        const fallbackResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Identify the city and state/province for these coordinates: ${lat}, ${lng}. 
            Return ONLY the location name in "City, State" format (e.g. "Brooklyn, New York"). 
            Do not include street numbers or zip codes.`,
            config: { 
                tools: [{ googleMaps: {} }],
                toolConfig: { retrievalConfig: { latLng: { latitude: lat, longitude: lng } } }
            }
        });
        return fallbackResponse.text?.trim() || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    } catch (geminiError) {
        return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    }
  }
}

/**
 * Find salons near the user using Google Maps grounding and return structured data.
 */
export async function getNearbySalons(lat: number, lng: number) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Find 6 top-rated hair salons and spas physically located closest to coordinates ${lat}, ${lng}.
      
      Return the results as a strictly formatted JSON array in a markdown code block.
      Each object must have these exact fields:
      - id: string (use a unique random string)
      - name: string (The name of the place)
      - address: string (The address)
      - rating: number (The rating, e.g. 4.5)
      - reviewCount: number (approximate number of reviews)
      - description: string (A short, inviting description of the place, max 2 sentences)
      - isOpen: boolean (assume true)
      - imageUrl: string (A URL to a public image of the salon if available, otherwise return null)
      
      Do not include services in the JSON. Sort the list by distance from the provided coordinates.`,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: lat,
              longitude: lng
            }
          }
        }
      }
    });

    const text = response.text || "";
    // Extract JSON from code block
    const match = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/```\n([\s\S]*?)\n```/);
    
    if (match && match[1]) {
       return JSON.parse(match[1]);
    }
    // Fallback if no code block found but text looks like JSON
    if (text.trim().startsWith('[') && text.trim().endsWith(']')) {
        return JSON.parse(text);
    }
    return [];
  } catch (e) {
    console.error("Error fetching salons:", e);
    return [];
  }
}
