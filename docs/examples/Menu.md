# Example

```tsx
import {
  Box,
  Button,
  Icon,
  Menu,
  MenuButton,
  MenuCircularButton,
  MenuInlineButton,
  MenuTitle,
  Separator,
} from "adwaita-web";

export default function () {
  return (
    <Box
      style={{
        width: 300,
        border: "1px solid #d8d4d0",
        borderRadius: 5,
        paddingBottom: 5,
      }}
    >
      <Menu icons>
        <MenuCircularButton>
          <Button size="large" circular icon={Icon.Printer} />
          <Button size="large" circular icon={Icon.EmblemShared} />
        </MenuCircularButton>
        <Separator />
        <MenuButton accelerator="Ctrl+N">Open in New Window</MenuButton>
        <Separator />
        <MenuInlineButton label="Edit">
          <Button flat image icon={Icon.EditCut} />
          <Button flat image icon={Icon.EditCopy} />
          <Button flat image icon={Icon.EditPaste} />
        </MenuInlineButton>
        <Separator />
        <MenuButton checkbox={true}>Pin</MenuButton>
        <MenuButton>Select Labels...</MenuButton>
        <MenuButton menu={true}>Share</MenuButton>
        <Separator />
        <MenuTitle>Size</MenuTitle>
        <MenuButton radio name="size" value="small">
          Small
        </MenuButton>
        <MenuButton radio name="size" value="medium">
          Medium
        </MenuButton>
        <MenuButton radio name="size" value="large">
          Large
        </MenuButton>
        <Separator />
        <MenuButton accelerator="Delete">Move to Trash</MenuButton>
      </Menu>
    </Box>
  );
}
```
