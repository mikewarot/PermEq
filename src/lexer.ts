// A very basic lexer for PermEq (stub)
export function tokenize(input: string): string[] {
  // TODO: Implement a real lexer
  return input.split(/\s+/).filter(Boolean);
}
