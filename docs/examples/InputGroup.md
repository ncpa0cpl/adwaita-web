# Example

```tsx
import { Box, Button, Icon, Input, InputGroup, Label } from "adwaita-web";

export default function () {
  return (
    <Box vertical>
      <Box>
        <Label>Button and an Input grouped:</Label>
        <InputGroup>
          <Button>
            <Icon.ListAdd />
          </Button>
          <Input type="text" />
        </InputGroup>
      </Box>
      <Box>
        <Label>Multiple Buttons grouped:</Label>
        <InputGroup>
          <Button>
            <Icon.ListAdd />
          </Button>
          <Button>Click Me!</Button>
          <Button active>I am active</Button>
        </InputGroup>
      </Box>
    </Box>
  );
}
```
