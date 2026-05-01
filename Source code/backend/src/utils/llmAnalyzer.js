const {Ollama} = require('ollama');

const ollama = new Ollama({
  host: 'http://127.0.0.1:11434'
});

class LLMAnalyzer {
  constructor(model = 'llama3:latest') {
    this.model = model;
  }

  /**
   * Analyzes a GitHub issue to determine how suitable it is for beginners
   * @param {Object} issue - The GitHub issue object
   * @returns {number} - Score from 0-1 indicating beginner suitability
   */
  async analyzeIssueForBeginners(issue) {
    try {
      const prompt = this.buildAnalysisPrompt(issue);

      const response = await ollama.generate({
        model: this.model,
        prompt: prompt,
        options: {
          temperature: 0.1, // Low temperature for consistent scoring
          top_p: 0.9,
          num_predict: 50, // Short response expected
        }
      });

      const score = this.parseScoreFromResponse(response.response);
      console.log(`LLM analysis for issue ${issue.issue_id}: score=${score}`);

      return score;
    } catch (error) {
      console.error(`LLM analysis failed for issue ${issue.issue_id}:`, error.message);
      // Fallback to rule-based scoring
      return this.fallbackLabelIntentScore(issue);
    }
  }

  /**
   * Builds the analysis prompt for the LLM
   */
  buildAnalysisPrompt(issue) {
    const labels = Array.isArray(issue.labels)
      ? issue.labels.map(label => String(label).toLowerCase()).join(', ')
      : 'no labels';

    const title = issue.title || '';
    const body = issue.body ? issue.body.substring(0, 500) : ''; // Limit body length

    return `Analyze this GitHub issue and rate how suitable it is for beginners to solve, on a scale from 0 to 1.

Issue Title: ${title}
Issue Labels: ${labels}
Issue Description: ${body}

Consider these factors:
- Beginner-friendly labels (good first issue, beginner, easy, help wanted, documentation)
- Clear problem description
- Not too complex (avoid performance, security, critical bugs)
- Good learning opportunity

Return ONLY a number between 0 and 1, where:
- 1.0 = Perfect for beginners (clear, simple, educational)
- 0.5 = Moderate difficulty (some guidance needed)
- 0.0 = Too complex for beginners (requires deep expertise)

Your response should be just the number, nothing else.`;
  }

  /**
   * Parses the numerical score from LLM response
   */
  parseScoreFromResponse(response) {
    // Extract the first number found in the response
    const match = response.match(/(\d+\.?\d*)/);
    if (match) {
      const score = parseFloat(match[1]);
      // Ensure score is between 0 and 1
      return Math.max(0, Math.min(1, score));
    }

    console.warn('Could not parse score from LLM response:', response);
    return 0.5; // Default moderate score
  }

  /**
   * Fallback rule-based scoring when LLM fails
   */
  fallbackLabelIntentScore(issue) {
    const labels = Array.isArray(issue.labels)
      ? issue.labels.map((label) => String(label).toLowerCase())
      : [];

    if (labels.some((label) => /good[\s-]*first[\s-]*issue|good-first-issue|beginner|easy|help wanted|documentation/.test(label))) {
      return 1.0;
    }

    if (labels.some((label) => /bug|performance|security|critical/.test(label))) {
      return 0.4;
    }

    return 0.6;
  }
}

module.exports = { LLMAnalyzer };