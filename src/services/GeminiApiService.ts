// Gemini API Service for Threat Hunting Challenges

export interface Challenge {
  id: string;
  title: string;
  description: string;
  instruction: string;
  hints: string[];
  correctAnswer: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  threatType: string;
  pattern: {
    type: string;
    indicators: string[];
  };
  points: number;
}

// Environment variables for API configuration
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = import.meta.env.VITE_GEMINI_BASE_URL || 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

// Static fallback challenges in case API is not available
const FALLBACK_CHALLENGES: Challenge[] = [
  {
    id: "1",
    title: "Suspicious Network Traffic",
    description: "Analyze network logs to identify potential data exfiltration",
    instruction: "You notice unusual outbound traffic patterns during off-hours. The traffic shows consistent data volumes to an external IP. What type of attack might this indicate?",
    hints: [
      "Look for patterns in data transfer volumes",
      "Consider the timing of the traffic",
      "Think about insider threats or compromised accounts"
    ],
    correctAnswer: "data exfiltration",
    difficulty: 'Medium',
    threatType: "Data Exfiltration",
    pattern: {
      type: "Network Traffic Analysis",
      indicators: ["Consistent outbound traffic", "Off-hours activity", "External IP communication"]
    },
    points: 150
  },
  {
    id: "2",
    title: "Malicious Email Detection",
    description: "Identify phishing attempts in email communications",
    instruction: "An employee receives an email claiming to be from IT requesting password reset. The email contains a link to a domain similar to your company's but with a slight misspelling. What is this attack called?",
    hints: [
      "Look at the domain name carefully",
      "Consider social engineering tactics",
      "Think about domain spoofing techniques"
    ],
    correctAnswer: "typosquatting",
    difficulty: 'Easy',
    threatType: "Phishing",
    pattern: {
      type: "Domain Analysis",
      indicators: ["Misspelled domain", "Social engineering", "Credential request"]
    },
    points: 100
  },
  {
    id: "3",
    title: "Privilege Escalation Investigation",
    description: "Investigate unusual administrative activities",
    instruction: "System logs show a user account that was recently created is now performing administrative tasks that require elevated privileges. What should be your immediate concern?",
    hints: [
      "Consider the principle of least privilege",
      "Think about account creation processes",
      "Look for signs of unauthorized access"
    ],
    correctAnswer: "privilege escalation",
    difficulty: 'Hard',
    threatType: "Privilege Escalation",
    pattern: {
      type: "Access Control Analysis",
      indicators: ["New user account", "Administrative tasks", "Elevated privileges"]
    },
    points: 200
  }
];

/**
 * Generate dynamic challenges using Gemini API
 */
export const generateChallenges = async (): Promise<Challenge[]> => {
  // If API key is not configured, return fallback challenges
  if (!GEMINI_API_KEY) {
    console.log('Gemini API key not configured, using fallback challenges');
    return FALLBACK_CHALLENGES;
  }

  try {
    const prompt = `Generate 3 cybersecurity threat hunting challenges in JSON format. Each challenge should have:
    - id (string)
    - title (string)
    - description (string)
    - instruction (string - detailed scenario description)
    - hints (array of 3 strings)
    - correctAnswer (string - simple keyword or phrase)
    - difficulty ('Easy', 'Medium', or 'Hard')
    - threatType (string)
    - pattern (object with type: string and indicators: array of strings)
    - points (number: Easy=100, Medium=150, Hard=200)

    Focus on realistic cybersecurity scenarios including network security, malware analysis, incident response, and threat detection.`;

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) {
      throw new Error('No content generated from API');
    }

    // Extract JSON from the generated text
    const jsonMatch = generatedText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in API response');
    }

    const challenges: Challenge[] = JSON.parse(jsonMatch[0]);
    
    // Validate the challenges structure
    if (!Array.isArray(challenges) || challenges.length === 0) {
      throw new Error('Invalid challenges format from API');
    }

    return challenges;
  } catch (error) {
    console.error('Error generating challenges from Gemini API:', error);
    // Return fallback challenges if API fails
    return FALLBACK_CHALLENGES;
  }
};

/**
 * Validate user answer using Gemini API
 */
export const validateAnswer = async (userAnswer: string, correctAnswer: string, scenario: string): Promise<{
  isCorrect: boolean;
  feedback: string;
  score?: number;
}> => {
  // If API key is not configured, use simple local validation
  if (!GEMINI_API_KEY) {
    const isCorrect = userAnswer.toLowerCase().includes(correctAnswer.toLowerCase()) ||
                     correctAnswer.toLowerCase().includes(userAnswer.toLowerCase());
    
    return {
      isCorrect,
      feedback: isCorrect 
        ? 'Correct! Well done.' 
        : `Not quite right. The correct answer is: ${correctAnswer}`,
      score: isCorrect ? 100 : 0
    };
  }

  try {
    const prompt = `Evaluate if the user's answer is correct for this cybersecurity scenario:
    
    Scenario: ${scenario}
    Correct Answer: ${correctAnswer}
    User's Answer: ${userAnswer}
    
    Provide a JSON response with:
    {
      "isCorrect": boolean,
      "feedback": "Detailed feedback explaining why the answer is correct or incorrect",
      "score": number (0-100 based on accuracy)
    }`;

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) {
      throw new Error('No content generated from API');
    }

    // Extract JSON from the generated text
    const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in API response');
    }

    const result = JSON.parse(jsonMatch[0]);
    
    return {
      isCorrect: result.isCorrect || false,
      feedback: result.feedback || 'Unable to validate answer',
      score: result.score || 0
    };
  } catch (error) {
    console.error('Error validating answer with Gemini API:', error);
    
    // Fallback to simple local validation
    const isCorrect = userAnswer.toLowerCase().includes(correctAnswer.toLowerCase()) ||
                     correctAnswer.toLowerCase().includes(userAnswer.toLowerCase());
    
    return {
      isCorrect,
      feedback: isCorrect 
        ? 'Correct! Well done.' 
        : `Not quite right. The correct answer is: ${correctAnswer}`,
      score: isCorrect ? 100 : 0
    };
  }
};
