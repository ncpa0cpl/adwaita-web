# Example

```tsx
import { Box, Button, InputGroup, Label, PageSwitcher } from "adwaita-web";
import { useState } from "react";

export default function () {
  const [currentPage, setCurrentPage] = useState(0);

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
    <Box fill vertical>
      <Box fill padded vertical>
        <InputGroup>
          {pages.map((page, index) => (
            <Button onClick={() => setCurrentPage(index)}>{page.label}</Button>
          ))}
        </InputGroup>
        <PageSwitcher
          style={{
            width: "100%",
            height: "200px",
          }}
          pages={pages}
          activePage={currentPage}
          mainPage={0}
        />
      </Box>
    </Box>
  );
}
```
