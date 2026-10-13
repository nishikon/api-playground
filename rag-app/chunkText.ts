function chunkText(text: string, chunkSize: number): string[] {
    if (!Number.isSafeInteger(chunkSize) || chunkSize <= 0) {
      throw new Error("chunkSizeは正の整数にしてください");
    }
  
    const chunks: string[] = [];
  
    for (let i = 0; i < text.length; i += chunkSize) {
      const chunk = text.slice(i, i + chunkSize);
      chunks.push(chunk);
    }
  
    return chunks;
  }
  
  const text = "ABCDEFGHIJKL";
  
  const result = chunkText(text, 4);
  
  console.log(result);