export function cloneTemplate(id) {
  const template = document.getElementById(id);
  return template.content.cloneNode(true);
}
