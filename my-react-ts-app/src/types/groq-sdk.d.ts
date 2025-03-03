declare module 'groq-sdk' {
  export class Groq {
    constructor(options: { apiKey: string });
    
    chat: {
      completions: {
        create(params: {
          messages: Array<{
            role: 'system' | 'user' | 'assistant';
            content: string;
          }>;
          model: string;
          temperature?: number;
          max_tokens?: number;
          [key: string]: any;
        }): Promise<{
          choices: Array<{
            message?: {
              content: string;
              role: string;
            };
            index: number;
          }>;
          [key: string]: any;
        }>;
      };
    };
  }
} 