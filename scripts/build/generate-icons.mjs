import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { ensureDir, REPO_ROOT } from '../lib/logger.mjs';

const CRC_TABLE = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  CRC_TABLE[n] = c >>> 0;
}

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function pngChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crcInput = Buffer.concat([typeBuf, data]);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(crcInput), 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function renderKeycapPng(size) {
  const raw = Buffer.alloc(size * (1 + size * 4));
  const radius = Math.max(2, Math.round(size * 0.22));
  const innerPad = Math.max(1, Math.round(size * 0.14));

  for (let y = 0; y < size; y++) {
    const rowOffset = y * (1 + size * 4);
    raw[rowOffset] = 0; // filter: None
    for (let x = 0; x < size; x++) {
      const px = rowOffset + 1 + x * 4;
      // Rounded outer crimson keycap base (#C2272D)
      const dx = Math.max(0, Math.max(radius - x, x - (size - 1 - radius)));
      const dy = Math.max(0, Math.max(radius - y, y - (size - 1 - radius)));
      if (dx * dx + dy * dy > radius * radius) {
        raw[px] = 0;
        raw[px + 1] = 0;
        raw[px + 2] = 0;
        raw[px + 3] = 0;
        continue;
      }

      const isKeyTop =
        x >= innerPad &&
        x < size - innerPad &&
        y >= innerPad &&
        y < size - innerPad - Math.max(1, Math.round(size * 0.06));

      // Lightning / 'R' geometric glyph in center
      const nx = (x - size * 0.5) / (size * 0.36);
      const ny = (y - size * 0.47) / (size * 0.36);
      const isBolt =
        (ny >= -0.75 && ny <= 0.08 && nx >= -0.35 - ny * 0.45 && nx <= 0.18 - ny * 0.35) ||
        (ny >= -0.08 && ny <= 0.75 && nx >= -0.18 - ny * 0.35 && nx <= 0.35 - ny * 0.45);

      if (isBolt) {
        // Crimson emblem (#C2272D)
        raw[px] = 194;
        raw[px + 1] = 39;
        raw[px + 2] = 45;
        raw[px + 3] = 255;
      } else if (isKeyTop) {
        // Warm Ivory Keycap (#F4EFE6)
        raw[px] = 244;
        raw[px + 1] = 239;
        raw[px + 2] = 230;
        raw[px + 3] = 255;
      } else {
        // Crimson stamp bevel (#9E1B20)
        raw[px] = 158;
        raw[px + 1] = 27;
        raw[px + 2] = 32;
        raw[px + 3] = 255;
      }
    }
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // 8-bit depth
  ihdr[9] = 6; // RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    pngChunk('IHDR', ihdr),
    pngChunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
    pngChunk('IEND', Buffer.alloc(0))
  ]);
}

export function generateExtensionIcons() {
  const outDir = path.join(REPO_ROOT, 'extension', 'assets', 'icons');
  ensureDir(outDir);
  for (const size of [16, 32, 48, 128]) {
    fs.writeFileSync(path.join(outDir, `icon-${size}.png`), renderKeycapPng(size));
  }
  return outDir;
}
