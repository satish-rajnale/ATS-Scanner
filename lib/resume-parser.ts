import pdfParse from "pdf-parse";
import mammoth from "mammoth";

export interface ParsedResume {
  text: string;
  isImageOnly: boolean;
  hasTables: boolean;
  hasColumns: boolean;
  pageCount: number;
}

export async function parsePDF(buffer: Buffer): Promise<ParsedResume> {
  try {
    const data = await pdfParse(buffer);
    const text = data.text.trim();
    
    // Check if it's image-only (very little text)
    const isImageOnly = text.length < 100;
    
    // Simple heuristics for tables/columns (look for patterns)
    const hasTables = /┌|┐|└|┘|├|┤|┬|┴|│|─/.test(text) || 
                      /\|\s*\|\s*\|/.test(text) || // Multiple pipes
                      text.split('\n').some(line => line.split(/\s{3,}/).length > 3); // Multiple columns
    
    const hasColumns = text.split('\n').some(line => {
      const parts = line.split(/\s{2,}/);
      return parts.length >= 3 && parts.every(p => p.length > 0 && p.length < 30);
    });
    
    // Get actual page count from PDF metadata, or estimate more accurately
    // pdf-parse provides numpages or numPages in the data object
    let pageCount: number;
    const actualPageCount = (data as any).numpages || (data as any).numPages;
    if (actualPageCount && actualPageCount > 0) {
      pageCount = actualPageCount;
    } else {
      // Fallback: better estimation based on average words per page (~250 words/page)
      const wordCount = text.split(/\s+/).filter(w => w.length > 0).length;
      pageCount = Math.max(1, Math.round(wordCount / 250));
    }
    
    return {
      text,
      isImageOnly,
      hasTables,
      hasColumns,
      pageCount,
    };
  } catch (error) {
    throw new Error("Failed to parse PDF file");
  }
}

export async function parseDOCX(buffer: Buffer): Promise<ParsedResume> {
  try {
    const result = await mammoth.extractRawText({ buffer });
    const text = result.value.trim();
    
    // Check if it's image-only
    const isImageOnly = text.length < 100;
    
    // Check for tables (mammoth preserves table structure in some cases)
    const hasTables = result.messages.some(msg => msg.type === "warning" && msg.message.includes("table")) ||
                      /\|\s*\|\s*\|/.test(text);
    
    // Check for columns
    const hasColumns = text.split('\n').some(line => {
      const parts = line.split(/\s{2,}/);
      return parts.length >= 3 && parts.every(p => p.length > 0 && p.length < 30);
    });
    
    // Better estimation: average ~250 words per page for DOCX
    const wordCount = text.split(/\s+/).filter(w => w.length > 0).length;
    const pageCount = Math.max(1, Math.round(wordCount / 250));
    
    return {
      text,
      isImageOnly,
      hasTables,
      hasColumns,
      pageCount,
    };
  } catch (error) {
    throw new Error("Failed to parse DOCX file");
  }
}

