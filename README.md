# Mastra Course Test

最高のエージェントを作るための完全ガイド

A comprehensive project demonstrating the Mastra framework for building AI agents with Model Context Protocol (MCP) integrations, memory capabilities, and multi-tool workflows.

## Overview

This project is part of the Mastra 101 course and showcases advanced AI agent development patterns including:

- Multi-agent systems with specialized capabilities
- Model Context Protocol (MCP) server integrations
- Advanced memory management with semantic recall
- Tool creation and integration
- Workflow orchestration
- Agent evaluation and scoring

## Project Structure

```
mastra-course-test/
├── src/
│   └── mastra/
│       ├── agents/           # AI agent definitions
│       │   ├── financial-agent.ts
│       │   ├── weather-agent.ts
│       │   ├── memory-agent.ts
│       │   └── index.ts      # MCP configuration
│       ├── tools/            # Custom tool implementations
│       │   └── get-transactions-tool.ts
│       ├── workflows/        # Workflow definitions
│       │   └── weather-workflow.ts
│       ├── scorers/          # Agent evaluation scorers
│       │   └── weather-scorer.ts
│       └── index.ts          # Mastra instance configuration
├── .env.local               # Environment variables (not in git)
├── package.json
└── tsconfig.json
```

## Agents

### Financial Assistant Agent

A comprehensive financial analysis agent with multiple capabilities:

- **Transaction Analysis**: Fetches and analyzes financial transaction data
- **Gmail Integration**: Reads, categorizes, and sends emails via Zapier MCP
- **GitHub Integration**: Monitors GitHub activity and summarizes development patterns
- **HackerNews Integration**: Searches and retrieves HackerNews stories and comments
- **Filesystem Access**: Manages a notes directory for persistent information storage
- **Advanced Memory**:
  - Semantic recall with vector embeddings
  - Working memory for user preferences and context
  - Maintains last 20 messages in context

### Weather Agent

Specialized agent for weather-related queries with tool integration and memory.

### Memory Agent

Demonstrates advanced memory capabilities and context management.

## MCP Integrations

The project integrates multiple Model Context Protocol servers:

### Zapier MCP Server
- Gmail operations (read, categorize, send)
- Connects via authenticated URL

### GitHub MCP Server (via Smithery)
- Repository management
- Commit and PR monitoring
- Issue tracking
- Requires GitHub Personal Access Token

### HackerNews MCP Server
- Story retrieval and search
- Comment fetching
- Command-based integration via npx

### Filesystem MCP Server
- Read/write access to notes directory
- Persistent storage for agent data
- Command-based integration via pnpx

## Features

### Memory System

Advanced memory capabilities using LibSQL:

- **Storage**: SQLite-based persistence
- **Vector Search**: Semantic recall using text-embedding-3-small
- **Working Memory**: User preference tracking with XML templates
- **Context Window**: Maintains last 20 messages
- **Semantic Recall**: Retrieves top 3 relevant past conversations

### Tools

Custom tool development demonstrating:
- Transaction data fetching
- Integration with external APIs
- Parameter validation with Zod schemas

### Workflows

Orchestrated multi-step processes using the Mastra workflow engine.

### Evaluation

Agent performance scoring with:
- Tool call appropriateness
- Response completeness
- Translation accuracy

## Setup

### Prerequisites

- Node.js >= 20.9.0
- npm, yarn, or pnpm

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env.local` file with the following variables:

```bash
# OpenAI API Key
OPENAI_API_KEY=your_openai_api_key

# Zapier MCP URL
ZAPIER_MCP_URL=your_zapier_mcp_url

# Smithery Configuration
SMITHERY_PROFILE=your_smithery_profile
SMITHERY_API_KEY=your_smithery_api_key

# GitHub Personal Access Token
GITHUB_TOKEN=your_github_personal_access_token
```

### GitHub Token Setup

1. Navigate to https://github.com/settings/tokens
2. Generate a new token (classic or fine-grained)
3. Required scopes:
   - `repo` (full control) OR
   - `public_repo` (public repositories only)
4. For fine-grained tokens, grant:
   - Contents: Read and write
   - Pull requests: Read and write
   - Issues: Read and write
   - Metadata: Read-only

### Smithery Setup

1. Create account at https://smithery.ai
2. Obtain API key and profile from dashboard
3. The GitHub MCP URL is automatically created via the Smithery SDK

## Usage

### Development Server

Start the Mastra development server:

```bash
npm run dev
```

This starts the Mastra playground and MCP integrations.

### Build

Build the project:

```bash
npm run build
```

### Production

Start the production server:

```bash
npm start
```

## Technologies

- **Mastra Core**: Agent framework and orchestration
- **Mastra MCP**: Model Context Protocol client
- **Mastra Memory**: Advanced memory and vector storage
- **Mastra LibSQL**: SQLite-based storage and vector database
- **Mastra Loggers**: Structured logging with Pino
- **Mastra Evals**: Agent evaluation framework
- **Vercel AI SDK**: OpenAI integration with streaming support
- **Smithery SDK**: MCP server authentication and URL generation
- **Zod**: Schema validation
- **TypeScript**: Type-safe development

## Configuration Files

### tsconfig.json

TypeScript configuration with ES2022 modules and bundler resolution.

### package.json

Project dependencies and scripts. Uses ES modules (`"type": "module"`).

### .gitignore

Protects sensitive files:
- Environment variables (`.env*`)
- Database files (`*.db`)
- Build outputs (`.mastra`, `dist`)
- Dependencies (`node_modules`)
- IDE and OS files

## Architecture

### Agent System

Agents are configured with:
- Name and instructions (system prompt)
- Model selection (OpenAI GPT-4o-mini)
- Tool integrations
- Memory configuration
- MCP server access

### MCP Integration Pattern

```typescript
const smitheryGithubMCPServerUrl = createSmitheryUrl(
  "https://server.smithery.ai/@smithery-ai/github",
  {
    apiKey: process.env.SMITHERY_API_KEY,
    profile: process.env.SMITHERY_PROFILE,
    config: {
      githubPersonalAccessToken: process.env.GITHUB_TOKEN,
    },
  }
);

const mcp = new MCPClient({
  servers: {
    github: { url: smitheryGithubMCPServerUrl },
    // ... other servers
  },
});
```

### Memory Configuration Pattern

```typescript
memory: new Memory({
  storage: new LibSQLStore({
    url: "file:../../memory.db",
  }),
  vector: new LibSQLVector({
    connectionUrl: "file:../../memory.db",
  }),
  embedder: openai.embedding("text-embedding-3-small"),
  options: {
    lastMessages: 20,
    semanticRecall: { topK: 3 },
    workingMemory: { enabled: true },
  },
})
```

## Learning Resources

This project demonstrates concepts from the Mastra 101 course:

- Agent design patterns
- MCP server integration strategies
- Memory system implementation
- Tool development best practices
- Workflow orchestration techniques
- Agent evaluation methodologies

## Security Notes

- Never commit `.env.local` or any environment files
- Rotate API keys and tokens regularly
- Use fine-grained tokens with minimal required permissions
- Set expiration dates on all access tokens
- Review `.gitignore` to ensure sensitive files are excluded

## Troubleshooting

### MCP Connection Failures

If you see "Failed to connect to MCP server" errors:

1. Verify all environment variables are set in `.env.local`
2. Ensure GitHub token has required scopes
3. Check Smithery API key and profile are correct
4. Verify the token is passed in the `config` object

### Memory Issues

If memory is not persisting:

1. Check that `memory.db` is being created
2. Verify LibSQL storage configuration
3. Ensure the output directory path is correct

### Build Errors

If TypeScript compilation fails:

1. Run `npm install` to ensure all dependencies are installed
2. Check `tsconfig.json` for correct configuration
3. Verify Node.js version >= 20.9.0

## Contributing

This is a course project demonstrating Mastra framework capabilities. Feel free to extend and experiment with additional agents, tools, and integrations.

## License

ISC
