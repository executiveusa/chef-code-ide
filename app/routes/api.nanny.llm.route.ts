import { json, type ActionFunctionArgs } from '@vercel/remix';
import { runNannyRouter } from '~/lib/.server/nanny/router';
import type { TaskType } from '~/lib/nanny/llm-router';

export const action = async ({ request }: ActionFunctionArgs) => {
  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed' }, { status: 405 });
  }

  let body: { taskType?: TaskType; prompt?: string };
  try {
    body = (await request.json()) as { taskType?: TaskType; prompt?: string };
  } catch {
    return json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!body.taskType) {
    return json({ error: 'taskType is required' }, { status: 400 });
  }

  const result = await runNannyRouter({
    taskType: body.taskType,
    prompt: body.prompt ?? `Route this ${body.taskType} task`,
  });
  return json(result);
};
