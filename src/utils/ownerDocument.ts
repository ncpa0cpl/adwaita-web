export default function ownerDocument(node: { ownerDocument: Document }) {
  return (node && node.ownerDocument) || document;
}
