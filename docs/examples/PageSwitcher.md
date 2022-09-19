# Example

```tsx
import { Box, Label, PageSwitcher } from "adwaita-web";

export default function () {
  const pages = [
    {
      key: "page-1",
      label: "Main Page",
      content: (
        <Box>
          <Label>This is the main page.</Label>
        </Box>
      ),
    },
    {
      key: "page-2",
      label: "Second Page",
      content: (
        <Box>
          <Label>This is the second page.</Label>
        </Box>
      ),
    },
    {
      key: "page-3",
      label: "Last Page",
      closable: true,
      content: (
        <Box>
          <Label>This is the last page.</Label>
        </Box>
      ),
    },
  ];

  return (
    <Box vertical>
      <PageSwitcher pages={pages} mainPage="page-1" />
    </Box>
  );
}
```
