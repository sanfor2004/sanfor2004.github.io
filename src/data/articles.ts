/**
 * Every allowed article topic, in display order. Single source for the content schema
 * (src/content.config.ts) and the /articles/ topic filter. Add a topic here, nowhere else.
 */
export const topics = ['Backend', 'Automation', 'Design Patterns', 'Systems', 'C++', 'AI Engineering', 'Learning', 'Project Engineering'] as const;

export const readingTime = (body = '') => Math.max(1, Math.round(body.trim().split(/\s+/).length / 220));
export const formatDate = (d: Date) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
