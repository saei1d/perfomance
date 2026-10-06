/**
 * Frontend-only submission.
 * Replace `submitInquiry` with a real request later.
 * The UI should keep calling this function and reading `{ ok: true }`.
 */
export async function submitInquiry(payload) {
  if (typeof window !== 'undefined' && typeof window.__HYENA_SUBMIT__ === 'function') {
    return window.__HYENA_SUBMIT__(payload);
  }

  await new Promise((resolve) => {
    window.setTimeout(resolve, 700);
  });

  return { ok: true, id: crypto.randomUUID() };
}

export function briefMailto(studioEmail, payload) {
  const subject = `Project brief — ${payload.projectType || 'Hyena Studio'}`;
  const body = [
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    `Company: ${payload.company || '—'}`,
    `Project type: ${payload.projectType}`,
    `Budget: ${payload.budget}`,
    `Timeline: ${payload.timeline}`,
    `Found us: ${payload.source}`,
    '',
    payload.description,
  ].join('\n');

  return `mailto:${studioEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
