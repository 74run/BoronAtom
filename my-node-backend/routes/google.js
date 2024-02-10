const { TextDecoder, TextEncoder } = require('util');

const { GenerativeModel, configure } = require('google-generativeai');

const { display } = require('IPython.display');
const Markdown = require('markdown').markdown;

// Function to convert text to Markdown format
function toMarkdown(text) {
  text = text.replace('•', '  *');
  return Markdown(textwrap.indent(text, '> ', predicate = (_) => true));
}

// Set up API key
const GOOGLE_API_KEY = 'ABC';

// Configure GenerativeAI with API key
configure({ api_key: GOOGLE_API_KEY });

// Initialize GenerativeModel
const model = new GenerativeModel('gemini-pro');

// Generate content and display as Markdown
(async () => {
  const response = await model.generateContent("Write a Summary for my Resume as a Mechanical Engineer");
  display(toMarkdown(response.text));
})();
