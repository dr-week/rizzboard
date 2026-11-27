export interface StreamOptions {
  prompt: string;
  onToken?: (chunk: string) => void;
}

export async function streamCompletion(options: StreamOptions): Promise<string> {
  return options.prompt;
}
