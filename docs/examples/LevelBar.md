# Example

```tsx
import { Box, Label, LevelBar } from "adwaita-web";

export default function () {
  return (
    <Box vertical>
      <Label>LevelBar Progress:</Label>
      <LevelBar value={0} segments={5} />
      <LevelBar value={1} segments={5} />
      <LevelBar value={2} segments={5} />
      <LevelBar value={3} segments={5} />
      <LevelBar value={4} segments={5} />
      <LevelBar value={5} segments={5} />
      <Label>LevelBar "Empty":</Label>
      <LevelBar level="empty" value={2} segments={5} />
      <Label>LevelBar "Danger":</Label>
      <LevelBar level="danger" value={2} segments={5} />
      <Label>LevelBar "Warning":</Label>
      <LevelBar level="warning" value={2} segments={5} />
      <Label>LevelBar "Info":</Label>
      <LevelBar level="info" value={2} segments={5} />
      <Label>LevelBar "Success":</Label>
      <LevelBar level="success" value={2} segments={5} />
      <Label>LevelBar Vertical:</Label>
      <LevelBar vertical value={2} segments={5} />
    </Box>
  );
}
```
