# Example

```jsx
import { Paned, Box } from "adwaita-web";

export default () => {
  return (
    <div>
      <div style={{ marginBottom: "20px" }}>
        <h2 style={{ marginBottom: "10px" }}>Horizontal:</h2>
        <Paned>
          <Box padded>
            Suscipit. Duis leo est, interdum nec, varius in, facilisis vitae, odio.
            Phasellus eget leo at urna adipiscing vulputate. Nam eu erat vel arcu
            tristique mattis. felis.
          </Box>
          <Box padded>
            Suspendisse sit amet tellus non odio porta pellentesque. Nulla facilisi.
            Integer iaculis condimentum augue. Nullam urna nulla, vestibulum quis,
            lacinia eget, ullamcorper eu, dui.
          </Box>
        </Paned>
      </div>
      <div>
        <h2 style={{ marginBottom: "10px" }}>Vertical:</h2>
        <Paned orientation="vertical">
          <Box padded>
            Suscipit. Duis leo est, interdum nec, varius in, facilisis vitae, odio.
            Phasellus eget leo at urna adipiscing vulputate. Nam eu erat vel arcu
            tristique mattis. felis.
          </Box>
          <Box padded>
            Suspendisse sit amet tellus non odio porta pellentesque. Nulla facilisi.
            Integer iaculis condimentum augue. Nullam urna nulla, vestibulum quis,
            lacinia eget, ullamcorper eu, dui.
          </Box>
        </Paned>
      </div>
    </div>
  );
};
```
