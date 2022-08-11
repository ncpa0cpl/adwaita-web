# Example

```tsx
import { Box, Checkbox, Label } from "adwaita-web";
import { useState } from "react";

export default function () {
  const [isSelected, setIsSelected] = useState(false);

  const onCheckboxChange = (value: boolean) => setIsSelected(value);

  return (
    <Box vertical padded>
      <Label>Is checkbox selected: {isSelected ? "YES" : "NO"}</Label>
      <Checkbox onChange={onCheckboxChange} label="Checkbox" size="large" />
      <Checkbox disabled label="Disabled Checkbox" size="large" />
    </Box>
  );
}
```
