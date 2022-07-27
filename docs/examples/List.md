# Example

```jsx
import React from "react";
import { List, ListItem } from "adwaita-web";

const sections = [
  {
    name: "Guides",
    items: [
      { label: "Introduction" },
      { label: "Getting started" },
      { label: "Advanced concepts" },
    ],
  },
  {
    name: "Components",
    items: [
      { label: "Paned" },
      { label: "Notebook" },
      { label: "Expander" },
      { label: "Input" },
      { label: "Button" },
      { label: "Dropdown" },
      { label: "Menu" },
      { label: "HeaderBar" },
      { label: "Table" },
      { label: "List" },
    ],
  },
];

export default () => {
  const [selected, setSelected] = React.useState("Notebook");

  return (
    <List border={false} fill sidebar="navigation" size="medium">
      {sections.map((s) => (
        <>
          <ListItem key={s.name} title>
            {s.name}
          </ListItem>
          {s.items.map((item) => (
            <ListItem
              key={item.label}
              className="align"
              activatable
              selected={item.label === selected}
              onClick={() => setSelected(item.label)}
            >
              <Label>{item.label}</Label>
            </ListItem>
          ))}
        </>
      ))}
    </List>
  );
};
```
