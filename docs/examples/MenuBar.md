# Example

```tsx
import { Box, Menu, MenuButton, MenuBar, MenuBarButton } from "adwaita-web";

export default function () {
  return (
    <Box vertical>
      <MenuBar>
        <MenuBarButton label="File">
          <Menu>
            <MenuButton>Open</MenuButton>
            <MenuButton>Save</MenuButton>
            <MenuButton>Close</MenuButton>
          </Menu>
        </MenuBarButton>
        <MenuBarButton label="Edit"></MenuBarButton>
        <MenuBarButton label="View"></MenuBarButton>
      </MenuBar>
    </Box>
  );
}
```
