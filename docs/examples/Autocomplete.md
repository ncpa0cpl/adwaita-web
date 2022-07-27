# Example

```jsx
import React from "react";
import { Box, Autocomplete, Icon, Label } from "adwaita-web";

export default () => {
  const [value, setValue] = React.useState("");
  const [users, setUsers] = React.useState([
    { name: "Fredrick", phone: "586-754-3873" },
    { name: "Edgar", phone: "682-294-2103" },
    { name: "Raphael", phone: "208-459-3186" },
    { name: "Darren", phone: "316-218-4768" },
    { name: "Amber", phone: "507-385-7601" },
    { name: "Sylvia", phone: "610-694-7044" },
    { name: "Lisa", phone: "412-654-0339" },
    { name: "Jessie", phone: "541-691-2470" },
  ]);

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(value.toLowerCase())
  );

  const options = filteredUsers.map((u) => ({
    value: u.name,
    label: (
      <Box compact horizontal>
        <div className="Box__fill" style={{ minWidth: 200 }}>
          {u.name}
        </div>
        <Label muted>{u.phone}</Label>
      </Box>
    ),
  }));

  return (
    <Box>
      <Autocomplete
        icon={Icon.SystemSearch}
        placeholder="Autocomplete..."
        options={options}
        onChange={setValue}
      />
    </Box>
  );
};
```
