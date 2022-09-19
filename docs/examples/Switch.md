# Example

```tsx
import { Box, Label, Switch } from "adwaita-web";

export default function () {
  return (
    <Box vertical>
      <Label>Regular Switch:</Label>
      <Switch />
      <Label>Disabled off Switch:</Label>
      <Switch disabled value={false} />
      <Label>Disabled on Switch:</Label>
      <Switch disabled value={true} />
      <Label>Labeled Switch:</Label>
      <Switch labels={true} />
      <Label>Custom Labeled Switch:</Label>
      <Switch labels={["L", "R"]} />
    </Box>
  );
}
```
