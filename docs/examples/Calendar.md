# Example

```tsx
import { Box, Calendar } from "adwaita-web";
import { useState } from "react";

export default function () {
  const [value, setValue] = useState(new Date());
  return (
    <Box horizontal>
      <Calendar value={value} onChange={setValue} />
    </Box>
  );
}
```
