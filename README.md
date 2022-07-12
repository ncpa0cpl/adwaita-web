<h1 align="center">
  web-toolkit
</h1>

<p align="center">
  <b>A GTK inspired React UI framework</b>
</p>

This is a web toolkit using GTK's default theme, Adwaita. The framework is currently
usable but is to be considered in **alpha** state, as a few parts are still raw and
the API is subject to change until the 1.0.0 release.

<p align="center">
  <a href="#installation">Installation</a> •
  <a href="https://romgrk.github.io/web-toolkit/demo">Demo</a> •
  <a href="https://romgrk.github.io/web-toolkit/docs">📖 Docs</a> •
  <a href="#help-wanted">Help Wanted</a> •
  <a href="#license">License</a>
</p>

## Why

There are quite a few alternatives, such as bootstrap, material-ui, semantic-ui or
ant-design. I've however found that most of them fail in one way or another to
satisfy what I'm looking for in a UI framework. Most important than anything, I
want something that looks stunning by default, while being functional.

## Showcase

![demo-1](static/demo-1.png)
![demo-2](static/demo-2.png)
![demo-3](static/demo-3.png)
![demo-4](static/demo-4.png)

```javascript
function App() {
  return (
    <div className="App background Box vertical compact">
      <Paned defaultSize={200} fill border="handle">
        <Box vertical>I'm a sidebar</Box>
        <Box fill vertical>
          <Input.Group>
            <Input />
            <Button>Submit</Button>
          </Input.Group>
        </Box>
      </Paned>
    </div>
  );
}

export default App;
```

Some [documentation](https://romgrk.github.io/web-toolkit/docs) is also available
but is a work in progress and not complete yet.

## License

MIT
