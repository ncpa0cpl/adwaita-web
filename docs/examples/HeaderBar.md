# Example

```jsx
import {
  HeaderBar,
  HeaderBarTitle,
  HeaderBarControls,
  Button,
  Icon,
} from "adwaita-web";

export default () => {
  return (
    <div style={{ width: "90%" }}>
      <HeaderBar titlebar>
        <Button icon={Icon.SystemSearch} />
        <div className="linked">
          <Button icon={Icon.GoFirst} active />
          <Button icon={Icon.GoLast} active />
        </div>
        <HeaderBarTitle fill>Web Toolkit Demo</HeaderBarTitle>
        <span className="StackSwitcher linked">
          <Button text>Editor</Button>
          <Button text active>
            Build
          </Button>
          <Button text className="needs-attention">
            <span className="Label">Settings</span>
          </Button>
        </span>
        <HeaderBarControls>
          <Button icon={Icon.WindowClose} />
        </HeaderBarControls>
      </HeaderBar>
    </div>
  );
};
```
