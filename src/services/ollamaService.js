import axios from 'axios';

const OLLAMA_API_URL = 'http://localhost:11434/api/generate';

export async function getOllamaResponse(prompt) {
  try {
    const response = await axios.post(OLLAMA_API_URL, {
      model: 'mistral',
      prompt: prompt,
      stream: false
    });
    return response.data.response;
  } catch (error) {
    console.error('Error calling Ollama API:', error);
    throw error;
  }
}

export async function getWhatToDoSuggestions({ phase, preferences, location }) {
  const prompt = `Given the following information about a person's menstrual cycle phase, preferences, and location, provide 4 personalized suggestions for activities and self-care. Include specific YouTube video links for guided activities and suggestions for nearby activities based on their location.

Phase: ${phase}
Location: ${location}
Preferred ways to unwind: ${preferences.unwind.join(', ')}
Preferred exercises: ${preferences.exercise.join(', ')}
Exercise frequency: ${preferences.frequency}

Please provide 4 specific suggestions that combine their preferences with what's beneficial during their ${phase} phase. For each suggestion:
1. Include a specific YouTube video link for guided activities (like yoga, meditation, or workouts)
2. Suggest nearby activities based on their location
3. Make the suggestions specific to their preferences and current phase
4. Format each suggestion as a complete sentence with the YouTube link and location-based activity

IMPORTANT: Format YouTube links exactly like this: [https://www.youtube.com/watch?v=VIDEO_ID]

Example format for each suggestion:
"During your ${phase} phase, try this gentle yoga session [https://www.youtube.com/watch?v=dQw4w9WgXcQ] and consider visiting [nearby activity] in ${location} to unwind. This combination aligns well with your preference for [specific preference]."

Please ensure the suggestions are practical, safe, and appropriate for their current phase.`;

  try {
    const response = await getOllamaResponse(prompt);
    // Split the response into individual suggestions and parse them
    return response.split('\n')
      .filter(suggestion => suggestion.trim().length > 0)
      .map(suggestion => {
        // Extract YouTube link if present
        const youtubeMatch = suggestion.match(/\[(https:\/\/www\.youtube\.com\/watch\?v=[a-zA-Z0-9_-]+)\]/);
        const youtubeLink = youtubeMatch ? youtubeMatch[1] : null;
        
        // Extract nearby activity if present
        const activityMatch = suggestion.match(/visiting ([^\.]+) in/);
        const nearbyActivity = activityMatch ? activityMatch[1] : null;

        return {
          text: suggestion,
          youtubeLink,
          nearbyActivity
        };
      });
  } catch (error) {
    console.error('Error getting suggestions:', error);
    throw error;
  }
} 