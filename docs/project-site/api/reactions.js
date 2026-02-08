import { EMOJI_CHARS } from '../src/lib/emoji-config.js';

/**
 * Vercel Function to handle emoji reactions using Upstash Redis (Vercel Marketplace)
 * 
 * Supports:
 * GET  - Fetch all reaction counts
 * POST - Increment a specific emoji count
 */

export default async function handler(req, res) {
  // Vercel KV environment variables (provided by Upstash for Redis)
  const { KV_REST_API_URL, KV_REST_API_TOKEN } = process.env;

  if (!KV_REST_API_URL || !KV_REST_API_TOKEN) {
    // If not configured, return dummy data/error so the UI doesn't crash
    console.warn("KV environment variables missing.");
    return res.status(200).json({
      error: "KV_NOT_CONFIGURED",
      counts: { "❤️": 0, "🔥": 0, "🚀": 0, "👍": 0, "🥳": 0 }
    });
  }

  try {
    if (req.method === 'GET') {
      // Fetch all counts in one go using pipeline or multiple requests
      // For simplicity, we just fetch each key.
      const counts = {};
      for (const emoji of EMOJI_CHARS) {
        const response = await fetch(`${KV_REST_API_URL}/get/reactions:${emoji}`, {
          headers: { Authorization: `Bearer ${KV_REST_API_TOKEN}` }
        });
        const result = await response.json();
        counts[emoji] = parseInt(result.result || 0);
      }
      return res.status(200).json({ counts });
    }

    if (req.method === 'POST') {
      const { emoji } = req.body;
      if (!EMOJI_CHARS.includes(emoji)) {
        return res.status(400).json({ error: "Invalid emoji" });
      }

      // Increment the count in Redis
      const response = await fetch(`${KV_REST_API_URL}/incr/reactions:${emoji}`, {
        headers: { Authorization: `Bearer ${KV_REST_API_TOKEN}` }
      });
      const result = await response.json();
      const newCount = parseInt(result.result || 1);

      return res.status(200).json({ emoji, count: newCount });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("Reaction API Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
