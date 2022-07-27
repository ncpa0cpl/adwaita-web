# Example

```jsx
import React from "react";
import {
  Box,
  Button,
  Popover,
  Range,
  Icon,
  Menu,
  MenuBackButton,
  MenuButton,
  MenuCircularButton,
  MenuInlineButton,
  MenuTitle,
  Separator,
  PopoverMenu,
} from "adwaita-web";

function ComplexMenu({ onClickShare }) {
  return (
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
      <MenuButton menu={true} onClick={onClickShare}>
        Share {onClickShare && <span className="text-muted">(Click Me)</span>}
      </MenuButton>
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
  );
}

function DemoPopoverMenu() {
  const [open, setOpen] = React.useState(false);

  const getPages = ({ change, close, back }) => [
    {
      key: "main",
      content: <ComplexMenu onClickShare={() => change("share")} />,
    },
    {
      key: "share",
      content: (
        <Menu icons>
          <MenuBackButton onClick={back}>Share</MenuBackButton>
          <MenuButton checkbox={true}>Option 1</MenuButton>
          <MenuButton checkbox={true}>Option 2</MenuButton>
          <MenuButton checkbox={false}>Option 3</MenuButton>
          <MenuButton checkbox={true}>Option 4</MenuButton>
        </Menu>
      ),
    },
  ];

  return (
    <PopoverMenu pages={getPages} open={open} onChangeOpen={setOpen}>
      <Button icon={Icon.EmblemSystem}>Open Popover</Button>
    </PopoverMenu>
  );
}

export default () => {
  const smallPopover = (
    <Popover
      placement="right"
      content={
        <Box vertical compact>
          <Button flat icon={Icon.ListRemove} />
          <Range vertical style={{ height: 80 }} />
          <Button flat icon={Icon.ListAdd} />
        </Box>
      }
    >
      <Button icon={Icon.AudioHeadphones}>Volume</Button>
    </Popover>
  );

  const hoverPopover = (
    <Popover
      method="mouseover"
      placement="left"
      content={
        <Box vertical compact>
          I'm a popover content
        </Box>
      }
    >
      <Button icon={Icon.InputMouse}>Hover Me</Button>
    </Popover>
  );

  return (
    <Box horizontal>
      {smallPopover}
      <div className="Box__fill" />
      <DemoPopoverMenu />
      <div className="Box__fill" />
      {hoverPopover}
    </Box>
  );
};
```
