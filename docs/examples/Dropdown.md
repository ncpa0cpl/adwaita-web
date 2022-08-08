# Example

```tsx
import { Box, Button, Dropdown, Icon } from "adwaita-web";
import { useState } from "react";

export default function () {
  const [value, setValue] = useState<number | string | boolean>(2);

  const options = users.map((u) => ({
    value: u.id,
    label: u.name,
  }));

  return (
    <Box vertical>
      <Dropdown
        value={value}
        loading={users.length === 0}
        options={options}
        onChange={setValue}
      />
      <Dropdown
        input
        value={value}
        loading={users.length === 0}
        options={options}
        onChange={setValue}
      />
      <Box horizontal compact className="linked">
        <Button icon={Icon.ListAdd} />
        <Dropdown input value="test" options={[]} />
      </Box>
    </Box>
  );
}

const users = [
  {
    id: 0,
    name: "Thomas Roberts",
    username: "Donser",
    email: "ThomasBRoberts@armyspy.com",
    address: {
      street: "1626 Still Street",
      city: "Ney",
    },
    phone: "973-437-5430",
    website: "detailmsgs.net",
  },
  {
    id: 1,
    name: "James Southerland",
    username: "Duch1986",
    email: "JamesMSoutherland@rhyta.com",
    address: {
      street: "301 Archwood Avenue",
      city: "Moorcroft",
    },
    phone: "956-550-5106",
    website: "needcounseling.net",
  },
  {
    id: 2,
    name: "Dixie Millard",
    username: "Crigh1951",
    email: "DixieHMillard@jourrapide.com",
    address: {
      street: "2148 Geraldine Lane",
      city: "New York",
    },
    phone: "832-255-9349",
    website: "cremetoe.com",
  },
  {
    id: 3,
    name: "Elizabeth Hightower",
    username: "Crostimare",
    email: "ElizabethRHightower@jourrapide.com ",
    address: {
      street: "2903 Harper Street",
      city: "Elizabethtown",
    },
    phone: "330-652-2024",
    website: "foxseeker.info",
  },
  {
    id: 4,
    name: "Susan Cottrell",
    username: "Inted1969",
    email: "SusanVCottrell@teleworm.us",
    address: {
      street: "3070 Lowland Drive",
      city: "Seneca",
    },
    phone: "708-922-2285",
    website: "yongxindyeing.com",
  },
  {
    id: 5,
    name: "Gerard D. Groom",
    phone: "828-605-8612",
    email: "GerardDGroom@jourrapide.com",
    username: "Wilts1972",
    website: "wqlzc.com",
    address: {
      street: "619 Quiet Valley Lane",
      city: "Montrose",
    },
  },
  {
    id: 6,
    name: "Josefina E. Brown",
    phone: "828-265-4637",
    email: "JosefinaEBrown@rhyta.com",
    username: "Dientooltaid",
    website: "frillsandfun.net",
    address: {
      street: "4259 Denver Avenue",
      city: "Riverside",
    },
  },
  {
    id: 7,
    name: "John Peters",
    phone: "928-415-3345",
    email: "JohnHPeters@armyspy.com ",
    username: "Enth1983",
    website: "furobrand.com",
    address: {
      street: "2780 Chandler Hollow Road",
      city: "Pittsburgh",
    },
  },
  {
    id: 8,
    name: "Mary Johnson",
    phone: "209-763-1401",
    email: "MaryLJohnson@armyspy.com ",
    username: "Moragiverand",
    website: "zetife.info",
    address: {
      street: "2931 Nancy Street",
      city: "Oxford",
    },
  },
];
```
