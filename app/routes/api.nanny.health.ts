import { json } from '@vercel/remix';

export const loader = async () => {
  return json({
    status: 'ok',
    service: 'nanny',
    version: '0.1.0',
    timestamp: new Date().toISOString(),
    mockMode: globalThis.process.env.NANNY_MOCK_MODE !== 'false',
  });
};
