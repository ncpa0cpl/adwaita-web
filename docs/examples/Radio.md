# Example

```tsx
import { Box, Radio } from "adwaita-web";
import { useState } from "react";

export default function () {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <Box vertical>
      <Radio
        onChange={() => setIsChecked(true)}
        checked={isChecked}
        value="1"
        showLabel
        label="Radio Button"
      />
      <Radio
        disabled
        checked={isChecked}
        value="1"
        showLabel
        label="Disabled Radio Button"
      />
    </Box>
  );
}
```
