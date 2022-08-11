# Example

```tsx
import { Box, InfoBar } from "adwaita-web";

export default function () {
  return (
    <Box vertical style={{ width: 400 }}>
      <InfoBar closable activatable info>
        This is an infobar
      </InfoBar>
      <InfoBar closable activatable success>
        This is an infobar
      </InfoBar>
      <InfoBar closable activatable warning>
        This is an infobar
      </InfoBar>
      <InfoBar closable activatable danger>
        This is an infobar
      </InfoBar>
    </Box>
  );
}
```
