// Gemini API Service for Threat Hunting Challenges
// TODO: Replace with your actual Gemini API details

interface GeminiChallenge {
  id: string;
  title: string;
  description: string;
  instruction: string;
  timeLimit: number;
  difficulty: 'Easy' | 'Medium' | 'Expert';
  threatType: 'DDoS' | 'Malware' | 'Data Exfiltration' | 'Port Scan' | 'Brute Force' | 'SQL Injection' | 'XSS' | 'Phishing';
  pattern: {
    description: string;
    indicators: string[];
    correctAnswer: string;
  };
  points: number;
  hints: string[];
}

interface GeminiValidationResponse {
  isCorrect: boolean;
  feedback: string;
  explanation: string;
  score: number;
}

class GeminiApiService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    // Get API configuration from Vite environment variables
    this.apiKey = import.meta.env.VITE_GEMINI_API_KEY || 'your-api-key-here';
    this.baseUrl = import.meta.env.VITE_GEMINI_BASE_URL || 'https://generativelanguage.googleapis.com/v1';
  }

  /**
   * Generate a new threat hunting challenge using Gemini API
   */
  async generateChallenge(difficulty: 'Easy' | 'Medium' | 'Expert' = 'Medium'): Promise<GeminiChallenge> {
    try {
      const prompt = this.createChallengePrompt(difficulty);
      
      const response = await fetch(`${this.baseUrl}/models/gemini-pro:generateContent?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const generatedText = data.candidates[0].content.parts[0].text;
      
      // Parse the generated challenge from Gemini response
      return this.parseChallengeResponse(generatedText);
    } catch (error) {
      console.error('Error generating challenge:', error);
      // Fallback to a default challenge if API fails
      return this.getFallbackChallenge(difficulty);
    }
  }

  /**
   * Validate user answer using Gemini API
   */
  async validateAnswer(
    challenge: GeminiChallenge, 
    userAnswer: string, 
    timeTaken: number
  ): Promise<GeminiValidationResponse> {
    try {
      const prompt = this.createValidationPrompt(challenge, userAnswer, timeTaken);
      
      const response = await fetch(`${this.baseUrl}/models/gemini-pro:generateContent?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.3,
            topK: 20,
            topP: 0.8,
            maxOutputTokens: 512,
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const validationText = data.candidates[0].content.parts[0].text;
      
      return this.parseValidationResponse(validationText, challenge);
    } catch (error) {
      console.error('Error validating answer:', error);
      // Fallback validation if API fails
      return this.getFallbackValidation(challenge, userAnswer);
    }
  }

  /**
   * Create prompt for generating new challenges
   */
  private createChallengePrompt(difficulty: string): string {
    return `Generate a cybersecurity threat hunting challenge with the following specifications:

Difficulty: ${difficulty}
Format: Return ONLY a valid JSON object with this exact structure:

{
  "title": "🔒 [Threat Type] [Action/Description]",
  "description": "Brief description of what the user needs to identify (50-80 words)",
  "instruction": "Specific instruction on what to look for (20-40 words)",
  "timeLimit": [30-90 seconds based on difficulty],
  "difficulty": "${difficulty}",
  "threatType": "[One of: DDoS, Malware, Data Exfiltration, Port Scan, Brute Force, SQL Injection, XSS, Phishing]",
  "pattern": {
    "description": "Detailed explanation of the threat pattern (60-100 words)",
    "indicators": ["indicator1", "indicator2", "indicator3", "indicator4"],
    "correctAnswer": "[Primary threat type name]"
  },
  "points": [100-250 points based on difficulty],
  "hints": ["hint1", "hint2", "hint3"]
}

Requirements:
- Make it realistic and educational
- Include specific network/system indicators
- Hints should progressively help identify the threat
- Points: Easy=100-150, Medium=150-200, Expert=200-250
- Time: Easy=30-45s, Medium=45-65s, Expert=65-90s
- Use relevant emojis in title
- Focus on real-world cybersecurity scenarios`;
  }

  /**
   * Create prompt for validating user answers
   */
  private createValidationPrompt(challenge: GeminiChallenge, userAnswer: string, timeTaken: number): string {
    return `Validate this cybersecurity threat hunting answer:

Challenge: ${challenge.title}
Correct Answer: ${challenge.pattern.correctAnswer}
User Answer: "${userAnswer}"
Time Taken: ${timeTaken} seconds

Please evaluate and return ONLY a valid JSON object:

{
  "isCorrect": [true/false - consider partial matches and synonyms],
  "feedback": "Brief encouraging/corrective message (20-40 words)",
  "explanation": "Educational explanation of why this is/isn't correct (40-80 words)",
  "score": [0-100 percentage score based on accuracy and speed]
}

Evaluation criteria:
- Exact matches = 100% correct
- Close synonyms (e.g., "DDoS" vs "Distributed Denial of Service") = 90-100% correct
- Partial matches (e.g., "denial of service" for "DDoS") = 70-85% correct
- Wrong category but related (e.g., "attack" for specific threat) = 30-50% correct
- Completely wrong = 0% correct
- Bonus points for faster completion
- Be encouraging even for incorrect answers`;
  }

  /**
   * Parse challenge response from Gemini
   */
  private parseChallengeResponse(response: string): GeminiChallenge {
    try {
      // Extract JSON from response (remove any extra text)
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in response');
      }
      
      const challengeData = JSON.parse(jsonMatch[0]);
      
      return {
        id: `gemini-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        ...challengeData
      };
    } catch (error) {
      console.error('Error parsing challenge response:', error);
      throw new Error('Failed to parse Gemini challenge response');
    }
  }

  /**
   * Parse validation response from Gemini
   */
  private parseValidationResponse(response: string, challenge: GeminiChallenge): GeminiValidationResponse {
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in validation response');
      }
      
      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error('Error parsing validation response:', error);
      // Return basic validation as fallback
      return this.getFallbackValidation(challenge, '');
    }
  }

  /**
   * Fallback challenge if API fails
   */
  private getFallbackChallenge(difficulty: string): GeminiChallenge {
    const fallbackChallenges = {
      'Easy': {
        title: '🌊 Basic DDoS Detection',
        description: 'Identify a simple Distributed Denial of Service attack pattern in network traffic.',
        instruction: 'Look for sudden traffic spikes with repetitive patterns.',
        timeLimit: 40,
        threatType: 'DDoS' as const,
        pattern: {
          description: 'High volume traffic from multiple sources targeting a single server.',
          indicators: ['Traffic spike', 'Multiple sources', 'Repetitive requests', 'Server slowdown'],
          correctAnswer: 'DDoS'
        },
        points: 100,
        hints: ['Check traffic volume', 'Look for multiple IPs', 'Notice repetitive patterns']
      },
      'Medium': {
        title: '🕸️ Malware C2 Detection',
        description: 'Detect Command and Control communication patterns indicating malware presence.',
        instruction: 'Find regular, encrypted communications to external servers.',
        timeLimit: 55,
        threatType: 'Malware' as const,
        pattern: {
          description: 'Regular beaconing to external servers with encrypted data.',
          indicators: ['Regular intervals', 'External IPs', 'Encrypted traffic', 'Small packets'],
          correctAnswer: 'Malware'
        },
        points: 175,
        hints: ['Check timing patterns', 'Look for external communications', 'Notice encryption']
      },
      'Expert': {
        title: '💉 Advanced SQL Injection',
        description: 'Identify sophisticated SQL injection attempts in web application logs.',
        instruction: 'Find malicious SQL commands in HTTP requests.',
        timeLimit: 75,
        threatType: 'SQL Injection' as const,
        pattern: {
          description: 'Malicious SQL commands embedded in HTTP parameters and headers.',
          indicators: ['SQL keywords', 'Unusual parameters', 'Error responses', 'Database queries'],
          correctAnswer: 'SQL Injection'
        },
        points: 225,
        hints: ['Check HTTP parameters', 'Look for SQL keywords', 'Notice error patterns']
      }
    };

    const challenge = fallbackChallenges[difficulty as keyof typeof fallbackChallenges] || fallbackChallenges['Medium'];
    
    return {
      id: `fallback-${Date.now()}`,
      difficulty: difficulty as 'Easy' | 'Medium' | 'Expert',
      ...challenge
    };
  }

  /**
   * Fallback validation if API fails
   */
  private getFallbackValidation(challenge: GeminiChallenge, userAnswer: string): GeminiValidationResponse {
    const correctAnswer = challenge.pattern.correctAnswer.toLowerCase();
    const userAnswerLower = userAnswer.toLowerCase();
    
    const isCorrect = userAnswerLower.includes(correctAnswer) || 
                     correctAnswer.includes(userAnswerLower);
    
    return {
      isCorrect,
      feedback: isCorrect ? 
        'Good work! You identified the threat correctly.' : 
        'Not quite right. Review the indicators and try again.',
      explanation: isCorrect ?
        `You correctly identified this as ${challenge.pattern.correctAnswer}. ${challenge.pattern.description}` :
        `The correct answer is ${challenge.pattern.correctAnswer}. ${challenge.pattern.description}`,
      score: isCorrect ? 85 : 25
    };
  }

  /**
   * Get multiple challenges for a training session
   */
  async generateChallengeSet(count: number = 5): Promise<GeminiChallenge[]> {
    const challenges: GeminiChallenge[] = [];
    const difficulties: ('Easy' | 'Medium' | 'Expert')[] = ['Easy', 'Medium', 'Expert'];
    
    for (let i = 0; i < count; i++) {
      const difficulty = difficulties[i % difficulties.length];
      try {
        const challenge = await this.generateChallenge(difficulty);
        challenges.push(challenge);
        // Add small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`Error generating challenge ${i + 1}:`, error);
        challenges.push(this.getFallbackChallenge(difficulty));
      }
    }
    
    return challenges;
  }
}

// Export singleton instance
export const geminiApi = new GeminiApiService();
export type { GeminiChallenge, GeminiValidationResponse };
