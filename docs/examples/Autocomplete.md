# Example

```jsx
import { Box, Autocomplete, Icon } from "adwaita-web";

export default () => {
  const [value, setValue] = useState("");
  const [users, setUsers] = useState([
    { name: "Fredrick" },
    { name: "Edgar" },
    { name: "Raphael" },
    { name: "Darren" },
    { name: "Amber" },
    { name: "Sylvia" },
    { name: "Lisa" },
    { name: "Jessie" },
  ]);

  const onChange = setValue;

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
        onChange={onChange}
      />
    </Box>
  );
};
```
