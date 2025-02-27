import { Stagehand } from "@/dist";
import { GroqClient } from "@/lib/llm/GroqClient";
import StagehandConfig from "@/stagehand.config";
import { z } from "zod";
async function formFillingSensible() {
  const stagehand = new Stagehand({
    ...StagehandConfig,
    env: "BROWSERBASE",
    llmClient: new GroqClient({
      modelName: "groq-llama-3.3-70b-versatile",
      clientOptions: {
        apiKey: process.env.GROQ_API_KEY,
      },
      logger: console.log,
    }),
  });
  await stagehand.init();
  // Navigate to the Stagehand documentation page
  await stagehand.page.goto(
    "https://docs.stagehand.dev/reference/introduction",
  );

  // Interact with the search functionality
  await stagehand.page.act("Click the search box");
  await stagehand.page.act(
    "Type 'Tell me in one sentence why I should use Stagehand' into the search box",
  );
  await stagehand.page.act("Click the suggestion to use AI");

  // Wait for the results to load
  await stagehand.page.waitForTimeout(2000);

  // Extract the AI suggestion text from the search results
  const { text } = await stagehand.page.extract({
    instruction:
      "extract the text of the AI suggestion from the search results",
    schema: z.object({
      text: z.string(),
    }),
    useTextExtract: false,
  });

  console.log("AI suggestion:", text);
}

(async () => {
  await formFillingSensible();
})();
