# Example

```jsx
import { Box, Expander } from "adwaita-web";

export default () => {
  return (
    <Box horizontal expandChildren style={{ height: 200, width: 400 }}>
      <Box vertical>
        Before
        <Expander label="View the paragraph">
          Pellentesque at dolor non lectus sagittis semper. Donec quis mi. Duis eget
          pede. Phasellus arcu tellus, ultricies id, consequat id, lobortis nec,
          diam. Suspendisse sed nunc. Pellentesque id magna. Morbi interdum quam at
          est. Maecenas eleifend mi in urna. Praesent et lectus.
        </Expander>
        After
      </Box>
    </Box>
  );
};
```
