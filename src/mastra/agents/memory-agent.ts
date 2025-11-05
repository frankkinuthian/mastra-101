import { Agent } from "@mastra/core/agent";
import { Memory } from "@mastra/memory";
import { openai } from "@ai-sdk/openai";
import { LibSQLStore, LibSQLVector } from "@mastra/libsql";

// Create a comprehensive memory configuration
const memory = new Memory({
  storage: new LibSQLStore({
    url: "file:../../memory.db", // relative path from the `.mastra/output` directory
  }),
  vector: new LibSQLVector({
    connectionUrl: "file:../../vector.db", // relative path from the `.mastra/output` directory
  }),
  embedder: openai.embedding("text-embedding-3-small"),
  options: {
    // Conversation history configuration
    lastMessages: 20, // Include the last 20 messages in the context

    // Semantic recall configuration
    semanticRecall: {
      topK: 3, // Retrieve 3 most similar messages
      messageRange: {
        before: 2, // Include 2 messages before each match
        after: 1, // Include 1 message after each match
      },
    },

    // Working memory configuration
    workingMemory: {
      enabled: true,
      template: `
# User Profile

## Personal Info
- Name:
- Location:
- Timezone:
- Occupation:

## Preferences
- Communication Style:
- Topics of Interest:
- Learning Goals:

## Project Information
- Current Projects:
  - [Project 1]:
    - Deadline:
    - Status:
  - [Project 2]:
    - Deadline:
    - Status:

## Session State
- Current Topic:
- Open Questions:
- Action Items:
`,
    },
  },
});

// Create an agent with comprehensive memory capabilities
export const memoryAgent = new Agent({
  name: "MemoryAgent",
  instructions: `
    You are a helpful assistant with advanced memory capabilities.
    You can remember previous conversations and user preferences.
    
    MEMORY CAPABILITIES:
    1. Conversation History: You remember the last 20 messages in the conversation
    2. Semantic Recall: You can find relevant information from past conversations using semantic search
    3. Working Memory: You maintain a structured profile of the user with personal info, preferences, projects, and session state
    
    IMPORTANT: You have access to working memory to store persistent information about the user.
    When you learn something important about the user (name, location, preferences, projects, etc.),
    update your working memory according to the template.
    
    Always refer to your working memory before asking for information the user has already provided.
    Use the information in your working memory to provide personalized responses.
    
    When the user shares personal information, acknowledge it and update your working memory accordingly.
    Track project information, deadlines, and action items as the user discusses them.
  `,
  model: "openai/gpt-4o-mini",
  memory: memory,
});
