# Example

```jsx
import { Box, Notebook, Icon, Button } from "adwaita-web";

export default () => {
  const pages = [
    {
      key: "page-1",
      label: "Page 1",
      closable: true,
      content: (
        <Box padded>
          Pharetra velit vitae eros. Vivamus ac risus. Mauris ac pede laoreet felis
          pharetra ultricies. Proin et neque. Aliquam dignissim placerat felis.
          Mauris porta ante sagittis purus. Nullam adipiscing eros.
        </Box>
      ),
    },
    {
      key: "page-2",
      label: "Page 2",
      closable: true,
      content: (
        <Box padded>
          Mattis odio vitae tortor. Fusce iaculis. Aliquam rhoncus, diam quis
          tincidunt facilisis, sem quam luctus augue, ut posuere neque sem vitae
          neque. Sed sed justo. Curabitur consectetuer arcu. Etiam placerat est eget
          odio. Nulla.
        </Box>
      ),
    },
    {
      key: "page-3",
      label: "Page 3",
      closable: true,
      content: (
        <Box padded>
          Cum sociis natoque penatibus et magnis dis parturient montes, nascetur
          ridiculus mus. Nunc faucibus posuere turpis. Sed laoreet, est sed gravida
          tempor, nibh enim fringilla quam, et dapibus mi enim sit amet risus. Nulla
          sollicitudin eros sit amet diam. Aliquam ante. Vestibulum ante ipsum primis
          in faucibus orci luctus et ultrices posuere cubilia Curae; Ut et est. Donec
          semper nulla in ipsum. Integer elit. In pharetra lorem vel ante.
        </Box>
      ),
    },
  ];

  const action = <Button icon={Icon.DialogWarning} />;

  return (
    <Box vertical>
      <Box horizontal style={{ height: 220 }}>
        <div className="Box__fill expand-children">
          <Notebook arrows action={action} position="top" pages={pages} />
        </div>
        <div className="Box__fill expand-children">
          <Notebook arrows action={action} position="left" pages={pages} />
        </div>
      </Box>
    </Box>
  );
};
```
