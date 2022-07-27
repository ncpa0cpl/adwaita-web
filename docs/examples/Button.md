# Button Styling

There are multiple different flavors of the Button component for you to use.

```tsx
import { Button } from "adwaita-web";

export default () => {
  return (
    <div>
      <Button>Regular Button</Button>
      <Button primary>Primary Button</Button>
      <Button danger>Danger Button</Button>
      <Button flat>Flat Button</Button>
      <Button link>Link Button</Button>
      <Button circular>Circular Button</Button>
    </div>
  );
};
```

# Button States

There are a few state-indicating props on the Button component, for example `loading` or `active`.

```tsx
import { Button } from "adwaita-web";

export default () => {
  return (
    <div>
      <Button loading>Loading Button</Button>
      <Button active>Activated Button</Button>
      <Button hover>Hovered Button</Button>
    </div>
  );
};
```
