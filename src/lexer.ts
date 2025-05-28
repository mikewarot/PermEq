// A very basic lexer for PermEq (stub)
export function tokenize(input: string): string[] {
  // This is a placeholder. A real lexer would handle numbers, identifiers, operators, etc.
  return input
    .replace(/([=≡()+\-*/])/g, " $1 ")
    .split(/\s+/)
    .filter(Boolean);
}
