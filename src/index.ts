import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { addNumbersTool, handleAddNumbers } from './tools/math.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const apiKey = process.env.MCP_API_KEY;

if (!apiKey) {
  console.error('Error: MCP_API_KEY environment variable is required');
  process.exit(1);
}

app.use(cors());
app.use(express.json());

interface AuthenticatedRequest extends Request {
  isAuthenticated?: boolean;
}

const authenticateApiKey = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header' });
  }
  
  const token = authHeader.substring(7);
  
  if (token !== apiKey) {
    return res.status(401).json({ error: 'Invalid API key' });
  }
  
  req.isAuthenticated = true;
  next();
};

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.get('/mcp/tools', authenticateApiKey, async (req: AuthenticatedRequest, res: Response) => {
  try {
    res.json({
      tools: [addNumbersTool]
    });
  } catch (error) {
    console.error('Error listing tools:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/mcp/tools/call', authenticateApiKey, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, arguments: args } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Tool name is required' });
    }
    
    console.log(`API call - Tool: ${name}, Arguments:`, args);
    
    let result;
    
    switch (name) {
      case 'add_numbers':
        result = await handleAddNumbers({
          method: 'tools/call',
          params: {
            name,
            arguments: args || {}
          }
        });
        break;
      default:
        return res.status(400).json({ error: `Unknown tool: ${name}` });
    }
    
    console.log(`Tool result:`, result);
    res.json(result);
  } catch (error) {
    console.error('Error calling tool:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.use('*', (req: Request, res: Response) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`MCP Math Server running on port ${port}`);
  console.log('Available endpoints:');
  console.log('  GET  /health - Health check');
  console.log('  GET  /mcp/tools - List available tools');
  console.log('  POST /mcp/tools/call - Execute a tool');
  console.log('');
  console.log('Authentication required: Bearer token in Authorization header');
});