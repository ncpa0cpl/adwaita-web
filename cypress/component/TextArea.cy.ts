import React from "react";
import { TextArea } from "../../src";

describe("TextArea.cy.ts", () => {
  it("textarea container should correctly add default classes", () => {
    cy.mount(React.createElement(TextArea, {}));
    cy.get("textarea").parent().should("have.class", "Input");
    cy.get("textarea").parent().should("have.class", "TextArea");
  });

  it("should correctly work", () => {
    cy.mount(React.createElement(TextArea, { placeholder: "Enter text here" }));

    const textarea = cy.get("textarea");

    textarea.should("have.class", "Input__area");
    textarea.should("have.class", "empty");
    textarea.should("have.attr", "placeholder", "Enter text here");
    textarea.type("Hello World!");
    textarea.should("not.have.class", "empty");
    textarea.should("have.value", "Hello World!");
  });

  it("should correctly invoke onChange callback", () => {
    const onChange = cy.stub();
    cy.mount(React.createElement(TextArea, { onChange }));
    cy.get("textarea")
      .type("Hello World!")
      .then(() => {
        expect(onChange).to.be.callCount(12);
        expect(onChange).to.be.calledWith("Hello World!");
      });
  });
});
