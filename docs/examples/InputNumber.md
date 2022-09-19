# Example

```tsx
import { Box, InputNumber } from "adwaita-web";

export default function () {
  return (
    <Box vertical>
      <InputNumber defaultValue={6} />
      <InputNumber disabled defaultValue={10} />
      <InputNumber placeholder="Vertical" vertical />
      <InputNumber placeholder="With limits" min={10} max={20} defaultValue={10} />
      <InputNumber placeholder="With a step" step={10} />
      <InputNumber placeholder="Disabled" disabled />
    </Box>
  );
}
```
