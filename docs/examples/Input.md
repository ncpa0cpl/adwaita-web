# Example

```tsx
import { Box, Icon, Input } from "adwaita-web";

export default function () {
  return (
    <Box vertical>
      <Input type="text" defaultValue={"Default Value"} />
      <Input type="text" loading placeholder="Loading input" />
      <Input placeholder="Input with icon to the left" icon={Icon.Alarm} />
      <Input placeholder="Input with icon to the right" iconAfter={Icon.Battery} />
      <Input placeholder="Input disabled" disabled />
      <Input placeholder="Input flat" flat />
      <Input placeholder="Input error" error />
      <Input placeholder="Input warning" warning />
      <Input placeholder="Input progress" progress />
      <Input placeholder="Input with clear button" allowClear />
    </Box>
  );
}
```
