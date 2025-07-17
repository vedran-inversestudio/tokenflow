import 'dotenv/config';
import fetch from 'node-fetch';

const fileKey = process.env.FIGMA_FILE_KEY;
const token = process.env.FIGMA_TOKEN;
const targetNodeId = '88:2381'; // The node ID for your component set

async function fetchFigmaFile() {
  const url = `https://api.figma.com/v1/files/${fileKey}`;
  const response = await fetch(url, {
    headers: { 'X-Figma-Token': token }
  });
  if (!response.ok) throw new Error(`Figma API error: ${response.status} ${response.statusText}`);
  return response.json();
}

function findNodeById(node, id) {
  if (node.id === id) return node;
  if (!node.children) return null;
  for (const child of node.children) {
    const found = findNodeById(child, id);
    if (found) return found;
  }
  return null;
}

function extractVariantNames(componentSetNode) {
  if (!componentSetNode.children) return [];
  return componentSetNode.children.map(variant => variant.name);
}

(async () => {
  try {
    const data = await fetchFigmaFile();
    const document = data.document;
    const componentSetNode = findNodeById(document, targetNodeId);
    if (!componentSetNode) {
      console.error('Component set not found.');
      return;
    }
    console.log('Component Set Name:', componentSetNode.name);
    const variantNames = extractVariantNames(componentSetNode);
    console.log('Variant Names:', variantNames);
  } catch (error) {
    console.error('Error:', error.message);
  }
})();
