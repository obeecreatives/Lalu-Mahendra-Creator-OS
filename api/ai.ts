import type { IncomingMessage, ServerResponse } from 'http';
import { formatReadableAiError, handleAiRequest, type AiRequestPayload } from '../server/aiHandler.ts';

interface VercelRequest extends IncomingMessage {
  method?: string;
  body?: unknown;
}

interface VercelResponse extends ServerResponse {
  status: (code: number) => VercelResponse;
  json: (data: unknown) => void;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const payload = (typeof req.body === 'string' ? JSON.parse(req.body) : req.body) as AiRequestPayload;
    if (!payload || !payload.action) {
      res.status(400).json({ error: 'Payload aksi AI wajib diisi.' });
      return;
    }
    const result = await handleAiRequest(payload);
    res.status(200).json(result);
  } catch (err) {
    const formatted = formatReadableAiError(err);
    res.status(formatted.statusCode).json({ error: formatted.message });
  }
}
