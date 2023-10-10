import mjml2html from 'mjml';

function convertTemplateToHtml(template) {
  return mjml2html(template);
}

export { convertTemplateToHtml };
