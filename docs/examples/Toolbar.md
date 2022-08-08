# Example

```tsx
import {
  Box,
  Button,
  Frame,
  Menu,
  MenuBar,
  MenuButton,
  Separator,
  Toolbar,
  Icon,
} from "adwaita-web";

export default function () {
  return (
    <>
      <Frame>
        <MenuBar>
          <MenuBarButton label="File">
            <Menu>
              <MenuButton>New</MenuButton>
              <MenuButton>Open</MenuButton>
              <MenuButton menu={true}>Other</MenuButton>
              <Separator />
              <MenuButton accelerator="Ctrl+Q">Quit</MenuButton>
            </Menu>
          </MenuBarButton>
          <MenuBarButton label="Edit"></MenuBarButton>
          <MenuBarButton label="View"></MenuBarButton>
        </MenuBar>
        <Toolbar horizontal>
          <Button icon={Icon.DocumentNew} />
          <Button icon={Icon.DocumentEdit} />
          <Separator />
          <Button icon={Icon.GoFirst} />
          <Button icon={Icon.GoJump} />
          <Button icon={Icon.GoLast} />
        </Toolbar>
      </Frame>
      <Box horizontal>
        <Frame inline>
          <Toolbar vertical>
            <Button icon={Icon.DocumentNew} />
            <Button icon={Icon.DocumentEdit} />
            <Separator />
            <Button icon={Icon.GoFirst} />
            <Button icon={Icon.GoJump} />
            <Button icon={Icon.GoLast} />
          </Toolbar>
        </Frame>
        <Frame label="Frame with a label">Content</Frame>
      </Box>
    </>
  );
}
```
