# Example

```tsx
import { Input, Table, TableTextFilter, TableDropdownFilter } from "adwaita-web";

function DemoInputFilter({
  column: { filterValue, setFilter, id },
}: {
  column: {
    filterValue?: string;
    setFilter?: (text: string) => void;
    id?: string | number;
  };
}) {
  return (
    <Input
      allowClear
      size="mini"
      id={id}
      value={filterValue || ""}
      onChange={setFilter}
    />
  );
}

export default function () {
  const columns = [
    {
      Header: "Row",
      accessor: (_: User, i: number) => (Number(i) + 1).toString(),
      width: 50,
    },
    {
      Header: "Name",
      columns: [
        {
          Header: "Username",
          accessor: "username",
          Filter: DemoInputFilter,
          filter: "includes",
        },
        {
          Header: "Full Name",
          accessor: "name",
          Filter: TableTextFilter,
          filter: "includes",
        },
      ],
    },
    {
      Header: "Info",
      columns: [
        {
          Header: "Phone",
          accessor: "phone",
        },
        {
          Header: "Website",
          accessor: "website",
          Filter: TableDropdownFilter,
          filter: "includes",
          options: [
            { label: ".com", value: ".com" },
            { label: ".org", value: ".org" },
            { label: ".net", value: ".net" },
            { label: ".info", value: ".info" },
            { label: ".biz", value: ".biz" },
          ],
        },
        {
          Header: "Address",
          accessor: (row: User) => `${row.address.street}, ${row.address.city}`,
        },
      ],
    },
  ];

  return (
    <div style={{ height: 400 }}>
      <Table columns={columns} data={users} sortable={true} filterable={true} />
    </div>
  );
}

type User = {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
  address: {
    street: string;
    city: string;
  };
};

const users: User[] = [
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
  {
    id: 9,
    name: "Carissa S. Chaney",
    phone: "337-849-2237",
    email: "CarissaSChaney@jourrapide.com",
    username: "Behinares",
    website: "beogradzoo.com",
    address: {
      street: "981 Single Street",
      city: "Waltham",
    },
  },
  {
    id: 10,
    name: "Marilyn McKay",
    phone: "212-964-2995",
    email: "MarilynWMcKay@dayrep.com ",
    username: "Poill2000",
    website: "kinarimachiya.org",
    address: {
      street: "2195 Lowland Drive",
      city: "Dekalb",
    },
  },
  {
    id: 11,
    name: "Richard G. Green",
    phone: "909-327-5988",
    email: "RichardGGreen@teleworm.us",
    username: "Requent",
    website: "edropecompany.com",
    address: {
      street: "2748 Eagle Drive",
      city: "Farmington Hills",
    },
  },
  {
    id: 12,
    name: "Maria Franck",
    phone: "518-369-3870",
    email: "MariaJFranck@dayrep.com",
    username: "Combehe",
    website: "lionfishlife.info",
    address: {
      street: "3178 Williams Lane",
      city: "Wichita",
    },
  },
  {
    id: 13,
    name: "Precious M. Potts",
    phone: "301-882-8221",
    email: "PreciousMPotts@dayrep.com",
    username: "Hatere",
    website: "oblocalsearch.biz",
    address: {
      street: "4937 Irving Road",
      city: "Saint Clairsville",
    },
  },
  {
    id: 14,
    name: "Milda D. Cope",
    phone: "208-575-5527",
    email: "MildaDCope@teleworm.us ",
    username: "Butfult",
    website: "consoleguild.com",
    address: {
      street: "3243 Center Street",
      city: "Jersey City",
    },
  },
  {
    id: 15,
    name: "Catrina T. Clark",
    phone: "505-856-8317",
    email: "CatrinaTClark@dayrep.com",
    username: "Frithat",
    website: "pinmaa.org",
    address: {
      street: "4129 Kenwood Place",
      city: "Fort Lauderdale",
    },
  },
];
```
