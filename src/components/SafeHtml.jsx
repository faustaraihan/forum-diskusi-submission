import { sanitizeHtml } from '../utils/content';

export default function SafeHtml({ html }) {
  return <div className="rich-content" dangerouslySetInnerHTML={{ __html: sanitizeHtml(html) }} />;
}
