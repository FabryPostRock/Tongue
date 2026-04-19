export const NEWS_CONTAINER_ID = '#news-container';
export const parentNode = document.querySelector(NEWS_CONTAINER_ID);
export const el = (tag, { className, id, attrs, text } = {}) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (id) node.id = id;
  if (text != null) node.textContent = text;
  if (attrs) {
    for (const [k, v] of Object.entries(attrs)) {
      if (!v) continue;
      node.setAttribute(k, String(v));
    }
  }
  parentNode.appendChild(node);
};
