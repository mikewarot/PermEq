export function tokenize(input: string): string[] {
  const tokens: string[] = [];
  let i = 0;

  while (i < input.length) {
    const c = input[i];

    if (/\s/.test(c)) {
      i++;
      continue;
    }

    // String literal
    if (c === '"') {
      let j = i + 1;
      let str = '';
      while (j < input.length && input[j] !== '"') {
        str += input[j++];
      }
      if (input[j] === '"') {
        tokens.push(`"${str}"`);
        i = j + 1;
        continue;
      } else {
        throw new Error('Unterminated string literal');
      }
    }

    // Operators and punctuation
    if (['=', '≡', '+', '-', '*', '/', '(', ')'].includes(c)) {
      tokens.push(c);
      i++;
      continue;
    }

    // Multi-character keywords or identifiers/numbers
    let j = i;
    while (
      j < input.length &&
      !/\s/.test(input[j]) &&
      !['=', '≡', '+', '-', '*', '/', '(', ')', '"'].includes(input[j])
    ) {
      j++;
    }
    const word = input.slice(i, j);
    tokens.push(word);
    i = j;
  }

  return tokens.filter(Boolean);
}