# Usage Examples

This document provides examples of how to use the Lending Protocol MCP Server.

## Using with MCP Inspector

The MCP Inspector is a great tool for testing and debugging MCP servers. Install it globally:

```bash
npm install -g @modelcontextprotocol/inspector
```

Then run it with your server:

```bash
npx @modelcontextprotocol/inspector node dist/index.js
```

This will open a web interface where you can interact with your server's tools.

## Example Tool Calls

### 1. Make a GET Request

```json
{
  "name": "make_api_call",
  "arguments": {
    "endpoint": "/loans",
    "method": "GET"
  }
}
```

### 2. Make a POST Request

```json
{
  "name": "make_api_call",
  "arguments": {
    "endpoint": "/loans",
    "method": "POST",
    "body": "{\"amount\": 1000, \"duration\": 30}",
    "headers": {
      "Authorization": "Bearer your-token-here",
      "Content-Type": "application/json"
    }
  }
}
```

### 3. Check API Status

```json
{
  "name": "get_api_status",
  "arguments": {}
}
```

## Integration with Claude Desktop

1. Build the project:
   ```bash
   npm run build
   ```

2. Add to your Claude Desktop config file:

   **MacOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
   
   **Windows**: `%APPDATA%/Claude/claude_desktop_config.json`
   
   ```json
   {
     "mcpServers": {
       "lending-protocol": {
         "command": "node",
         "args": ["/absolute/path/to/mcp/dist/index.js"]
       }
     }
   }
   ```

3. Restart Claude Desktop

4. You should now be able to ask Claude to interact with your lending protocol API:
   - "Check the status of the lending API"
   - "Make a GET request to the /loans endpoint"
   - "Create a new loan with amount 1000"

## Extending the Server

To add actual API functionality:

1. Install an HTTP client like `axios` or use native `fetch`:
   ```bash
   npm install axios
   ```

2. Update the `make_api_call` handler in `src/index.ts`:
   ```typescript
   import axios from 'axios';
   
   // In the make_api_call handler:
   const apiBaseUrl = process.env.API_BASE_URL || 'https://api.example.com';
   const response = await axios({
     method: validatedArgs.method,
     url: `${apiBaseUrl}${validatedArgs.endpoint}`,
     data: validatedArgs.body ? JSON.parse(validatedArgs.body) : undefined,
     headers: validatedArgs.headers,
   });
   
   return {
     content: [{
       type: "text",
       text: JSON.stringify(response.data, null, 2),
     }],
   };
   ```

3. Add environment variables for configuration:
   ```bash
   export API_BASE_URL=https://your-api.com
   export API_KEY=your-key-here
   ```

## Adding Custom Tools

You can add more specialized tools for your lending protocol. Example:

```typescript
const tools: Tool[] = [
  // ... existing tools ...
  {
    name: "create_loan",
    description: "Create a new loan in the lending protocol",
    inputSchema: {
      type: "object",
      properties: {
        amount: {
          type: "number",
          description: "Loan amount in USD",
        },
        duration: {
          type: "number",
          description: "Loan duration in days",
        },
        collateral: {
          type: "string",
          description: "Type of collateral",
        },
      },
      required: ["amount", "duration"],
    },
  },
];
```

Then implement the handler:

```typescript
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === "create_loan") {
    // Validate and process loan creation
    // Make API call to your backend
    // Return result
  }
  // ... handle other tools
});
```
