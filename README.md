# Lending Protocol MCP Server

An MCP (Model Context Protocol) server that enables AI agents to communicate with the Lending Protocol API. This server provides a standardized interface for AI assistants to interact with your lending protocol services.

## Features

- **API Communication Tools**: Make HTTP requests to your Lending Protocol API
- **Health Monitoring**: Check the status and health of your API services
- **Type-Safe**: Built with TypeScript and Zod for robust schema validation
- **Standards-Compliant**: Implements the Model Context Protocol specification

## Installation

```bash
npm install
```

## Building

```bash
npm run build
```

## Running the Server

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm start
```

## Available Tools

### 1. make_api_call
Make API calls to the Lending Protocol endpoints.

**Parameters:**
- `endpoint` (required): The API endpoint to call (e.g., `/users`, `/loans`, `/markets`)
- `method` (optional): HTTP method - `GET`, `POST`, `PUT`, or `DELETE` (default: `GET`)
- `body` (optional): Request body as JSON string (for POST/PUT requests)
- `headers` (optional): Additional HTTP headers as key-value pairs

**Example:**
```json
{
  "endpoint": "/loans",
  "method": "GET"
}
```

### 2. get_api_status
Get the current status and health of the Lending Protocol API.

**Example:**
```json
{}
```

## Integration with AI Clients

This MCP server can be integrated with AI clients that support the Model Context Protocol, such as Claude Desktop or other MCP-compatible applications.

### Claude Desktop Configuration

Add to your Claude Desktop configuration file:

**MacOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "lending-protocol": {
      "command": "node",
      "args": ["/path/to/mcp/dist/index.js"]
    }
  }
}
```

## Customization

The current implementation provides a basic template. To connect to your actual Lending Protocol API:

1. Update the `make_api_call` function in `src/index.ts` to make real HTTP requests
2. Add authentication headers if required
3. Implement additional tools specific to your API's functionality
4. Add error handling for API-specific errors

## Development

The server is built with:
- **@modelcontextprotocol/sdk**: Official MCP SDK
- **TypeScript**: For type safety
- **Zod**: For runtime schema validation

## License

ISC
