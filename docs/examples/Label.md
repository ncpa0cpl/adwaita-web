# Example

```tsx
import { Box, Label } from "adwaita-web";

export default function () {
  return (
    <Box vertical>
      <Label>Label</Label>
      <Label bold>Label Bold</Label>
      <Label bold muted>
        Label Bold Muted
      </Label>
      <Label bold info>
        Label Bold Info
      </Label>
      <Label bold info disabled>
        Label Bold Info Disabled
      </Label>
      <Label bold success>
        Label Bold Success
      </Label>
      <Label bold success disabled>
        Label Bols Success Disabled
      </Label>
      <Label bold warning>
        Label Bold Warning
      </Label>
      <Label bold warning disabled>
        Label Bold Warning Disabled
      </Label>
      <Label bold danger>
        Label Bold Danger
      </Label>
      <Label bold danger disabled>
        Label Bold Danger Disabled
      </Label>
    </Box>
  );
}
```
