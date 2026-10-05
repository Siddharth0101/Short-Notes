const str = { type: "STRING" };
const object = (properties, required = []) => ({
  type: "OBJECT",
  properties,
  required,
});
export const declarations = [
  {
    name: "search_notes",
    description:
      "Search the selected subject notes for explanations and chapter IDs.",
    parameters: object({ query: str }, ["query"]),
  },
  {
    name: "get_questions",
    description:
      "Retrieve subject questions and private answer guides. kind is theory or coding.",
    parameters: object(
      { query: str, kind: { type: "STRING", enum: ["theory", "coding"] } },
      ["kind"],
    ),
  },
  {
    name: "assign_coding",
    description:
      "Assign an existing coding question once; only in the coding round.",
    parameters: object({ questionId: str }, ["questionId"]),
  },
  {
    name: "respond",
    description:
      "Finish this turn with speech, displayed message, optional evidence-based assessment, and relevant revision chapters.",
    parameters: object(
      {
        revisitMemoryId: {
          type: "STRING",
          description:
            "When revisiting a previously assessed topic, copy its exact learnerMemory id. Do not invent IDs.",
        },
        message: str,
        speech: str,
        reviewChapterIds: { type: "ARRAY", items: str },
        assessment: object(
          {
            topic: str,
            verdict: {
              type: "STRING",
              enum: ["correct", "partial", "incorrect"],
            },
            evidence: str,
            chapterId: str,
          },
          ["topic", "verdict", "evidence"],
        ),
      },
      ["message", "speech"],
    ),
  },
];
