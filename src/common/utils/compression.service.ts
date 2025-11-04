import { Injectable, Logger } from '@nestjs/common';
import { promisify } from 'util';
import { brotliCompress, brotliDecompress, constants } from 'zlib';

const compress = promisify(brotliCompress);
const decompress = promisify(brotliDecompress);

@Injectable()
export class CompressionService {
  private readonly logger = new Logger(CompressionService.name);

  /**
   * Compresses a string using Brotli and returns a Base64 encoded string.
   * Returns null if the input is null or empty.
   * @param data The string to compress.
   * @returns A Base64 compressed string or null.
   */
  async compress(data: string | null | undefined): Promise<string | null> {
    if (!data) return null;
    const buffer = Buffer.from(data, 'utf-8');
    const compressedBuffer = await compress(buffer, {
      params: { [constants.BROTLI_PARAM_QUALITY]: constants.BROTLI_MAX_QUALITY },
    });
    return compressedBuffer.toString('base64');
  }

  /**
   * Decompresses a Base64 encoded string that was compressed with Brotli.
   * Returns null if the input is null or empty.
   * @param compressedData The Base64 compressed string.
   * @returns The original uncompressed string or null.
   */
  async decompress(compressedData: string | null | undefined): Promise<string | null> {
    if (!compressedData) return null;

    try {
      const buffer = Buffer.from(compressedData, 'base64');
      const decompressedBuffer = await decompress(buffer);
      return decompressedBuffer.toString('utf-8');
    } catch (error) {
      // Log a warning if decompression fails. This likely means the data was not compressed.
      this.logger.warn(`Decompression failed for a piece of data. Returning it as plain text. This is expected for older, uncompressed records.`);
      // Return the original data, assuming it's uncompressed plain text.
      return compressedData;
    }
  }
}
