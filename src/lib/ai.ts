import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

const SYSTEM_PROMPT = `You are a storytelling writer for Vivid Roots Collective, a nonprofit working in rural Guatemala. Your job is to transform raw field notes and updates from our team into warm, engaging, donor-ready narratives.

Guidelines:
- Write in clear, warm English suitable for nonprofit donors
- Keep the authentic voice from the field — don't make it sound corporate
- Do not add fictional details or exaggerate
- Focus on the human impact and community transformation
- Use vivid but honest descriptions`;

interface RawUpdateData {
  projectTitle: string;
  community: string;
  region: string;
  projectType: string;
  fieldNotes: string | null;
  personalStoryName: string | null;
  personalStoryAge: number | null;
  personalStoryQuote: string | null;
  personalStory: string | null;
  personalStoryAfter: string | null;
}

/**
 * Polish a raw field update into a donor-ready narrative (2-3 paragraphs)
 */
export async function polishUpdate(
  data: RawUpdateData
): Promise<string | null> {
  try {
    let userMessage = `Transform this raw field update into a polished, donor-ready narrative of 2-3 paragraphs.

Project: ${data.projectTitle}
Community: ${data.community}, ${data.region}
Project Type: ${data.projectType}`;

    if (data.fieldNotes) {
      userMessage += `\n\nField Notes:\n${data.fieldNotes}`;
    }

    if (data.personalStoryName) {
      userMessage += `\n\nPersonal Story:`;
      userMessage += `\nName: ${data.personalStoryName}`;
      if (data.personalStoryAge) {
        userMessage += `, Age: ${data.personalStoryAge}`;
      }
      if (data.personalStory) {
        userMessage += `\nBackground: ${data.personalStory}`;
      }
      if (data.personalStoryQuote) {
        userMessage += `\nQuote: "${data.personalStoryQuote}"`;
      }
      if (data.personalStoryAfter) {
        userMessage += `\nImpact/After: ${data.personalStoryAfter}`;
      }
    }

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userMessage }],
    });

    const textBlock = response.content.find((block) => block.type === "text");
    return textBlock ? textBlock.text : null;
  } catch (error) {
    console.error("AI polish error:", error);
    return null;
  }
}

/**
 * Generate a short progress summary for an active project (2-3 sentences)
 */
export async function generateProgressSummary(
  projectTitle: string,
  community: string,
  projectType: string,
  updateNarratives: string[]
): Promise<string | null> {
  try {
    const userMessage = `Write a brief 2-3 sentence progress summary for donors about this active project.

Project: ${projectTitle}
Community: ${community}
Type: ${projectType}

Published updates (chronological):
${updateNarratives.map((n, i) => `Update ${i + 1}:\n${n}`).join("\n\n")}

Write a concise summary of the overall progress and current status. Focus on what has been accomplished and what's ahead.`;

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 512,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userMessage }],
    });

    const textBlock = response.content.find((block) => block.type === "text");
    return textBlock ? textBlock.text : null;
  } catch (error) {
    console.error("AI progress summary error:", error);
    return null;
  }
}

/**
 * Generate a comprehensive impact story for a completed project (3-5 paragraphs)
 */
export async function generateImpactStory(
  projectTitle: string,
  community: string,
  region: string,
  projectType: string,
  peopleServed: number,
  communityContext: string | null,
  updateNarratives: string[]
): Promise<string | null> {
  try {
    let userMessage = `Write a comprehensive impact story (3-5 paragraphs) for this completed project. This will be the main story donors see. Tell the full arc: what the community faced, what was done, and the transformation achieved.

Project: ${projectTitle}
Community: ${community}, ${region}
Type: ${projectType}
People Impacted: ${peopleServed}`;

    if (communityContext) {
      userMessage += `\nCommunity Background: ${communityContext}`;
    }

    userMessage += `\n\nAll project updates (chronological):\n${updateNarratives.map((n, i) => `Update ${i + 1}:\n${n}`).join("\n\n")}`;

    userMessage += `\n\nWrite a compelling impact story that weaves together these updates into a cohesive narrative about the project's journey and impact on ${community}.`;

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2048,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userMessage }],
    });

    const textBlock = response.content.find((block) => block.type === "text");
    return textBlock ? textBlock.text : null;
  } catch (error) {
    console.error("AI impact story error:", error);
    return null;
  }
}
