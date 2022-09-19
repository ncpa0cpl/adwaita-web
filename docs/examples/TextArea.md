# Example

```tsx
import { Box, TextArea, Label } from "adwaita-web";

export default function () {
  return (
    <Box vertical>
      <Label>Default</Label>
      <TextArea />
      <Label>Disabled</Label>
      <TextArea disabled />
      <Label>Error</Label>
      <TextArea error />
      <Label>Flat</Label>
      <TextArea flat />
      <Label>Warning</Label>
      <TextArea warning />
      <Label>Progress</Label>
      <TextArea progress={75} />
    </Box>
  );
}
```
