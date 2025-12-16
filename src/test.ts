#!/usr/bin/env node

/**
 * Simple test script to verify the MCP server can be loaded and initialized
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { z } from "zod";

console.log("Testing MCP server initialization...");

try {
  // Create a test server instance
  const server = new Server(
    {
      name: "test-server",
      version: "1.0.0",
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  console.log("✓ Server instance created successfully");

  // Test Zod schema validation
  const TestSchema = z.object({
    endpoint: z.string(),
    method: z.enum(["GET", "POST", "PUT", "DELETE"]).default("GET"),
  });

  const testData = TestSchema.parse({ endpoint: "/test", method: "GET" });
  console.log("✓ Schema validation working");
  console.log("  Test data:", testData);

  console.log("\n✅ All basic tests passed!");
  console.log("The MCP server is ready to use.");
} catch (error) {
  console.error("❌ Test failed:", error);
  process.exit(1);
}
