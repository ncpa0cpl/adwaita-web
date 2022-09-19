# Example

```tsx
import { Box, Progress, Label } from "adwaita-web";

export default function () {
  return (
    <Box vertical>
      <Progress label="Progress at 0%:" value={0} />
      <Progress label="Progress at 10%:" value={10} />
      <Progress label="Progress at 25%:" value={25} />
      <Progress label="Progress at 70%:" value={70} />
      <Progress label="Progress at 100%:" value={100} />
      <Progress label="Progress vertical:" value={50} vertical />
    </Box>
  );
}
```
