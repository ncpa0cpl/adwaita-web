# Example

```tsx
import { Box, Label, RadioGroup } from "adwaita-web";
import { useState } from "react";

export default function () {
  const [selected, setSelected] = useState("1");

  const options = [
    { value: "1", label: "Option 1" },
    { value: "2", label: "Option 2" },
    { value: "3", label: "Option 3" },
  ];

  const handleChange = (v: string) => setSelected(v);

  return (
    <Box vertical>
      <Box padded>
        <Label>Currently selected: {selected}</Label>
      </Box>
      <Box padded vertical>
        <Label>Horizontal Radio Group:</Label>
        <RadioGroup
          value={selected}
          horizontal
          defaultValue="1"
          options={options}
          onChange={handleChange}
        />
      </Box>
      <Box padded vertical>
        <Label>Vertical Radio Group:</Label>
        <RadioGroup
          value={selected}
          horizontal={false}
          defaultValue="1"
          options={options}
          onChange={handleChange}
        />
      </Box>
    </Box>
  );
}
```
