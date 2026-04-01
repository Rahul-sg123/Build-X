const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const analyzeConversation = async (conversationText) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `Analyze the following conversation and detect potential startup ideas, complaints, inefficiencies, or opportunities for innovation. 

Conversation:
${conversationText}

Return ONLY a valid JSON object with this exact structure (no markdown, no code blocks, just raw JSON):
{
  "idea_title": "Brief catchy title for the startup idea",
  "problem_detected": "Clear description of the problem or pain point",
  "startup_solution": "Proposed solution or business model",
  "potential_market": "Target market and potential customers",
  "future_scope": "Growth potential and scalability"
}

If no clear startup idea is detected, return:
{
  "idea_title": "NO_IDEA",
  "problem_detected": "",
  "startup_solution": "",
  "potential_market": "",
  "future_scope": ""
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean the response - remove markdown code blocks if present
    let cleanedText = text.trim();
    cleanedText = cleanedText.replace(/```json\n?/g, '');
    cleanedText = cleanedText.replace(/```\n?/g, '');
    cleanedText = cleanedText.trim();

    const ideaData = JSON.parse(cleanedText);

    // Check if a valid idea was detected
    if (ideaData.idea_title === 'NO_IDEA' || !ideaData.idea_title) {
      return null;
    }

    return {
      ideaTitle: ideaData.idea_title,
      problemDetected: ideaData.problem_detected,
      startupSolution: ideaData.startup_solution,
      potentialMarket: ideaData.potential_market,
      futureScope: ideaData.future_scope
    };
  } catch (error) {
    console.error('Gemini API Error:', error);
    return null;
  }
};

module.exports = { analyzeConversation };
