# MCP Math Server

A simple Model Context Protocol (MCP) server with HTTP transport that provides basic math operations. This server demonstrates how to build an MCP server with Express.js, TypeScript, and API key authentication.

## Features

- ✅ HTTP transport (not stdio)
- ✅ API key authentication via Bearer token
- ✅ Single math tool: `add_numbers`
- ✅ TypeScript with proper type definitions
- ✅ CORS enabled for cross-origin requests
- ✅ Comprehensive error handling
- ✅ Request/response logging
- ✅ Health check endpoint

## Prerequisites

- Node.js 18+ and npm
- Basic understanding of REST APIs and HTTP requests

## Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mcp-math-server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and set your API key:
   ```env
   MCP_API_KEY=your-secret-api-key-here
   PORT=3000
   ```

4. **Build the project**
   ```bash
   npm run build
   ```

5. **Start the server**
   ```bash
   npm start
   ```

   The server will be available at `http://localhost:3000`

## Development

For development with auto-restart on file changes:

```bash
npm run dev
```

## API Endpoints

### Health Check
```
GET /health
```
Returns server status (no authentication required).

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### List Available Tools
```
GET /mcp/tools
Authorization: Bearer <your-api-key>
```

**Response:**
```json
{
  "tools": [
    {
      "name": "add_numbers",
      "description": "Add two numbers together",
      "inputSchema": {
        "type": "object",
        "properties": {
          "a": {
            "type": "number",
            "description": "First number to add"
          },
          "b": {
            "type": "number",
            "description": "Second number to add"
          }
        },
        "required": ["a", "b"]
      }
    }
  ]
}
```

### Execute Tool
```
POST /mcp/tools/call
Authorization: Bearer <your-api-key>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "add_numbers",
  "arguments": {
    "a": 5,
    "b": 3
  }
}
```

**Response:**
```json
{
  "content": [
    {
      "type": "text",
      "text": "{\"result\": 8}"
    }
  ]
}
```

## Authentication

All MCP endpoints (except `/health`) require authentication using a Bearer token:

```http
Authorization: Bearer your-secret-api-key-here
```

If authentication fails, the server returns:
```json
{
  "error": "Missing or invalid Authorization header"
}
```

## Available Tools

### add_numbers

Adds two numbers together and returns the result.

**Parameters:**
- `a` (number, required): First number to add
- `b` (number, required): Second number to add

**Example Usage:**

```bash
curl -X POST http://localhost:3000/mcp/tools/call \
  -H "Authorization: Bearer your-secret-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "add_numbers",
    "arguments": {
      "a": 10,
      "b": 20
    }
  }'
```

**Response:**
```json
{
  "content": [
    {
      "type": "text",
      "text": "{\"result\": 30}"
    }
  ]
}
```

## Error Handling

The server provides comprehensive error handling:

- **400 Bad Request**: Missing required parameters
- **401 Unauthorized**: Invalid or missing API key
- **404 Not Found**: Unknown endpoint
- **500 Internal Server Error**: Server errors

## Project Structure

```
mcp-math-server/
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── .env.example          # Environment variables template
├── .gitignore            # Git ignore rules
├── README.md             # This file
├── src/
│   ├── index.ts          # Main server file
│   └── tools/
│       └── math.ts       # Math tools implementation
└── dist/                 # Compiled JavaScript (generated)
```

## Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Start the compiled server
- `npm run dev` - Start development server with auto-reload
- `npm run clean` - Remove compiled files

## Security Notes

- Always use a strong, randomly generated API key in production
- The API key should be kept secret and not committed to version control
- Use HTTPS in production environments
- Consider implementing rate limiting for production use

## Testing the Server

You can test the server using curl, Postman, or any HTTP client:

```bash
# Health check (no auth required)
curl http://localhost:3000/health

# List tools
curl -H "Authorization: Bearer your-secret-api-key-here" \
     http://localhost:3000/mcp/tools

# Call add_numbers tool
curl -X POST http://localhost:3000/mcp/tools/call \
     -H "Authorization: Bearer your-secret-api-key-here" \
     -H "Content-Type: application/json" \
     -d '{"name": "add_numbers", "arguments": {"a": 15, "b": 25}}'
```

## Extending the Server

To add new tools:

1. Create a new tool definition in `src/tools/` or add to `math.ts`
2. Register the tool in the `ListToolsRequestSchema` handler
3. Add the tool handler in the `CallToolRequestSchema` handler
4. Rebuild and restart the server

## License

MIT License - see LICENSE file for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Support

If you encounter any issues or have questions, please open an issue in the GitHub repository.