import { Tool, CallToolRequest, CallToolResult } from '@modelcontextprotocol/sdk/types.js';

export interface AddNumbersArgs {
  a: number;
  b: number;
}

export const addNumbersTool: Tool = {
  name: 'add_numbers',
  description: 'Add two numbers together',
  inputSchema: {
    type: 'object',
    properties: {
      a: {
        type: 'number',
        description: 'First number to add'
      },
      b: {
        type: 'number',
        description: 'Second number to add'
      }
    },
    required: ['a', 'b']
  }
};

export async function handleAddNumbers(request: CallToolRequest): Promise<CallToolResult> {
  try {
    const args = request.params.arguments as unknown as AddNumbersArgs;
    const { a, b } = args;
    
    if (typeof a !== 'number' || typeof b !== 'number') {
      return {
        content: [
          {
            type: 'text',
            text: 'Error: Both parameters a and b must be numbers'
          }
        ],
        isError: true
      };
    }
    
    const result = a + b;
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({ result })
        }
      ]
    };
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
        }
      ],
      isError: true
    };
  }
}