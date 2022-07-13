import React from "react";
import { Switch } from "../../src";

describe("Switch.cy.ts", () => {
  it("switch container should correctly add default classes", () => {
    cy.mount(React.createElement(Switch, {}));
    cy.get("input").parent().should("have.class", "Switch");
  });

  it("should correctly render a checkbox", () => {
    cy.mount(React.createElement(Switch, {}));
    const input = cy.get("input");
    input.should("have.attr", "type", "checkbox");

    input.then(($input) => {
      cy.get("label").should("have.attr", "for", $input.get(0).id);
    });
  });

  it("should correctly render labels", () => {
    cy.mount(React.createElement(Switch, {}));
    cy.get("label").get("span").should("not.exist");

    cy.mount(React.createElement(Switch, { labels: true }));
    cy.get("label").get("span").first().should("have.text", "On");
    cy.get("label").get("span").last().should("have.text", "Off");

    cy.mount(React.createElement(Switch, { labels: ["Left", "Right"] }));
    cy.get("label").get("span").first().should("have.text", "Left");
    cy.get("label").get("span").last().should("have.text", "Right");
  });

  it("should correctly change the state", () => {
    const onChange = cy.stub();
    cy.mount(React.createElement(Switch, { onChange }));
    cy.get("input").should("not.be.checked");
    cy.get("input").click({ force: true });
    cy.get("input").should("be.checked");
    cy.get("label").click({ force: true });
    cy.get("input").should("not.be.checked");
  });
});
