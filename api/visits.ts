import type { VercelRequest, VercelResponse } from '@vercel/node';

const NAMESPACE = 'betterdasmarinas-org';
const KEY = 'pageviews';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const increment = req.query.up === '1';
  const url = increment
    ? `https://api.counterapi.dev/v1/${NAMESPACE}/${KEY}/up`
    : `https://api.counterapi.dev/v1/${NAMESPACE}/${KEY}`;

  try {
    const response = await fetch(url);
    if (!response.ok)
      return res.status(502).json({ error: 'Counter API error' });
    const data = await response.json();
    const count = data?.count ?? data?.value ?? 0;
    return res.status(200).json({ count });
  } catch {
    return res.status(502).json({ error: 'Failed to reach counter' });
  }
}
