function chunkText(
    text: string,
    chunkSize: number,
    overlap: number
  ): string[] {
    if (
      !Number.isSafeInteger(chunkSize) ||
      chunkSize <= 0 ||
      !Number.isSafeInteger(overlap) ||
      overlap < 0 ||
      overlap >= chunkSize
    ) {
      throw new Error("chunkSizeとoverlapの指定が不正です");
    }
  
    const chunks: string[] = [];
    const step = chunkSize - overlap;
  
    for (let i = 0; i < text.length; i += step) {
      const chunk = text.slice(i, i + chunkSize);
      chunks.push(chunk);
  
      if (i + chunkSize >= text.length) break;
    }
  
    return chunks;
  }
  
  const text = "ABCDEFGHIJKL";
  
  const result = chunkText(text, 4, 2);
  
  console.log(result);