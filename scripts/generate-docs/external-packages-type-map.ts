import { JSONSchema4 } from "json-schema";

export const TYPE_MAP = new Map<string, JSONSchema4>();

const REACT_ELEMENT_SCHEMA: JSONSchema4 = {
  title: "React Element",
  type: "object",
};

TYPE_MAP.set("React.ReactElement", REACT_ELEMENT_SCHEMA);
TYPE_MAP.set("ReactElement", REACT_ELEMENT_SCHEMA);

const REACT_NODE_SCHEMA: JSONSchema4 = {
  description:
    "A React Node, can be a primitive type like string, number, boolean or a React Element.",
  oneOf: [
    {
      type: "string",
    },
    {
      type: "number",
    },
    {
      type: "boolean",
    },
    {
      title: "React Element",
    },
  ],
};

TYPE_MAP.set("React.ReactNode", REACT_NODE_SCHEMA);
TYPE_MAP.set("ReactNode", REACT_NODE_SCHEMA);

const REACT_COMPONENT_TYPE_SCHEMA: JSONSchema4 = {
  description: "A React Component, can be a class or function.",
  oneOf: [
    {
      title: "Function",
      type: "object",
      properties: {
        arguments: {
          type: "object",
          properties: {
            "0": {
              title: "props",
              type: "object",
            },
          },
          additionalProperties: false,
        },
        returns: {
          title: "React Element",
        },
      },
      additionalProperties: false,
      required: ["arguments", "returns"],
    },
    {
      title: "Class Component",
    },
  ],
};

TYPE_MAP.set("React.FunctionComponent", REACT_COMPONENT_TYPE_SCHEMA);
TYPE_MAP.set("React.ComponentClass", REACT_COMPONENT_TYPE_SCHEMA);
TYPE_MAP.set("React.ComponentType", REACT_COMPONENT_TYPE_SCHEMA);
TYPE_MAP.set("React.FC", REACT_COMPONENT_TYPE_SCHEMA);
TYPE_MAP.set("FunctionComponent", REACT_COMPONENT_TYPE_SCHEMA);
TYPE_MAP.set("ComponentClass", REACT_COMPONENT_TYPE_SCHEMA);
TYPE_MAP.set("ComponentType", REACT_COMPONENT_TYPE_SCHEMA);
TYPE_MAP.set("FC", REACT_COMPONENT_TYPE_SCHEMA);

const CHANGE_EVENT_SCHEMA: JSONSchema4 = {
  title: "ChangeEvent",
  description: "A synthetic or real ChangeEvent event.",
};

TYPE_MAP.set("React.ChangeEvent", CHANGE_EVENT_SCHEMA);
TYPE_MAP.set("ChangeEvent", CHANGE_EVENT_SCHEMA);

const MOUSE_EVENT_SCHEMA: JSONSchema4 = {
  title: "MouseEvent",
  description: "A synthetic or real MouseEvent event.",
};

TYPE_MAP.set("React.MouseEvent", MOUSE_EVENT_SCHEMA);
TYPE_MAP.set("MouseEvent", MOUSE_EVENT_SCHEMA);

const TOUCH_EVENT_SCHEMA: JSONSchema4 = {
  title: "TouchEvent",
  description: "A synthetic or real TouchEvent event.",
};

TYPE_MAP.set("React.TouchEvent", TOUCH_EVENT_SCHEMA);
TYPE_MAP.set("TouchEvent", TOUCH_EVENT_SCHEMA);

TYPE_MAP.set("Date", {
  title: "Date",
  description: "A JavaScript builtin Date object.",
});

const CSS_PROPS_SCHEMA: JSONSchema4 = {
  title: "CSSProperties",
  description: "A React's CSS properties object.",
  type: "object",
  additionalProperties: {
    type: "string",
  },
  propertyNames: {
    type: "string",
  },
};

TYPE_MAP.set("CSSProperties", CSS_PROPS_SCHEMA);
TYPE_MAP.set("React.CSSProperties", CSS_PROPS_SCHEMA);
