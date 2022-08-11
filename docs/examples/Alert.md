# Alert Styling

Alert component provides a few different flavors to use, this includes one for displaying success messages, information's and errors or problems.

```tsx
import { Alert } from "adwaita-web";

export default () => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "90%",
        columnGap: "12px",
        rowGap: "12px",
        padding: "16px",
      }}
    >
      <Alert title="Neutral message">
        This is a simple neutral alert with no content specific styles applied.
      </Alert>
      <Alert info title="Information message">
        This is a information alert.
      </Alert>
      <Alert success title="Success message">
        This is a success alert.
      </Alert>
      <Alert warning title="Warning message">
        This is a warning alert.
      </Alert>
      <Alert danger title="Error message">
        This is a danger alert.
      </Alert>
    </div>
  );
};
```
