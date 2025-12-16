#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";
import { z, ZodIssue } from "zod";

// Define the API call tool schema
const ApiCallArgsSchema = z.object({
  endpoint: z.string().describe("The API endpoint to call (e.g., /users, /loans)"),
  method: z.enum(["GET", "POST", "PUT", "DELETE"]).default("GET").describe("HTTP method"),
  body: z.string().optional().describe("Request body as JSON string (for POST/PUT)"),
  headers: z.record(z.string(), z.string()).optional().describe("Additional HTTP headers"),
});

const ApiStatusArgsSchema = z.object({});

// Create MCP server instance
const server = new Server(
  {
    name: "lending-protocol-api",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Define available tools
const tools: Tool[] = [
  {
    name: "make_api_call",
    description: "Make an API call to the Lending Protocol API. This tool allows you to interact with various API endpoints using different HTTP methods.",
    inputSchema: {
      type: "object",
      properties: {
        endpoint: {
          type: "string",
          description: "The API endpoint to call (e.g., /users, /loans, /markets)",
        },
        method: {
          type: "string",
          enum: ["GET", "POST", "PUT", "DELETE"],
          description: "HTTP method to use",
          default: "GET",
        },
        body: {
          type: "string",
          description: "Request body as JSON string (for POST/PUT requests)",
        },
        headers: {
          type: "object",
          description: "Additional HTTP headers as key-value pairs",
        },
      },
      required: ["endpoint"],
    },
  },
  {
    name: "get_api_status",
    description: "Get the current status and health of the Lending Protocol API",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
];

// Handle tool listing
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools };
});

// Handle tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    if (name === "make_api_call") {
      const validatedArgs = ApiCallArgsSchema.parse(args);
      
      // Simulate API call (in real implementation, this would make actual HTTP requests)
      const response = {
        success: true,
        endpoint: validatedArgs.endpoint,
        method: validatedArgs.method,
        timestamp: new Date().toISOString(),
        data: {
          message: `API call to ${validatedArgs.endpoint} would be executed here`,
          note: "This is a basic MCP server template. Implement actual API calls based on your Lending Protocol API specification.",
        },
      };

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(response, null, 2),
          },
        ],
      };
    } else if (name === "get_api_status") {
      const status = {
        status: "operational",
        version: "1.0.0",
        timestamp: new Date().toISOString(),
        services: {
          api: "healthy",
          database: "healthy",
          cache: "healthy",
        },
      };

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(status, null, 2),
          },
        ],
      };
    } else {
      throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const issues: ZodIssue[] = error.issues || [];
      throw new Error(
        `Invalid arguments: ${issues
          .map((e) => `${e.path.join(".")}: ${e.message}`)
          .join(", ")}`
      );
    }
    throw error;
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  // Log to stderr so it doesn't interfere with stdio protocol communication
  console.error("Lending Protocol MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
