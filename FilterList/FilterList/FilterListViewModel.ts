// Copyright 2021 Esri
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//     http://www.apache.org/licenses/LICENSE-2.0
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.​

// esri.core.accessorSupport
import { property, subclass } from "esri/core/accessorSupport/decorators";

// General esri Imports
import Accessor = require("esri/core/Accessor");

// Config Panel Imports
import { Expression, FilterLayers, FilterOutput, LayerExpression } from "./interfaces/interfaces";

let accordionStyle = `
  .accordion-item-content { padding: 0!important; }
  .accordion-item-header-text { flex-direction: unset!important }`;

@subclass("FilterListViewModel")
class FilterListViewModel extends Accessor {
  // ----------------------------------
  //
  //  Public Variables
  //
  // ----------------------------------

  @property()
  layerExpressions: LayerExpression[] = [];

  @property()
  theme: "dark" | "light" = "light";

  @property()
  updatingExpression: boolean = false;

  @property()
  output: FilterOutput;

  // ----------------------------------
  //
  //  Private Variables
  //
  // ----------------------------------

  private _layers: FilterLayers = {};

  // ----------------------------------
  //
  //  Lifecycle methods
  //
  // ----------------------------------

  constructor(params?: any) {
    super(params);
  }

  // ----------------------------------
  //
  //  Public methods
  //
  // ----------------------------------

  initExpressions(): void {
    this.layerExpressions.map((layerExpression) => {
      const tmpExp = [];
      const { id } = layerExpression;
      layerExpression.expressions.map((expression) => {
        if (!expression.checked) {
          expression.checked = false;
        } else {
          tmpExp.push(expression.definitionExpression);
        }
      });
      this._layers[id] = { expressions: tmpExp };
      if (tmpExp.length > 0) {
        this._generateOutput(id);
      }
    });
  }

  initLayerHeader(accordionItem: HTMLCalciteAccordionItemElement) {
    const style = document.createElement("style");
    if (this.theme === "dark") {
      accordionStyle += ` .accordion-item-header {
        border-bottom: 1px solid rgb(217, 218, 218)!important;
        padding: 14px 20px!important;
      }`;
    } else if (this.theme === "light") {
      accordionStyle += ` .accordion-item-header {
        background: rgb(244, 243, 244)!important;
        border-bottom: 1px solid rgb(217, 218, 218)!important;
        padding: 14px 20px!important;
      }`;
    }
    style.innerHTML = accordionStyle;
    accordionItem.shadowRoot.prepend(style);
  }

  initCheckbox(id: string, expression: Expression, checkbox: HTMLCalciteCheckboxElement) {
    checkbox.addEventListener("calciteCheckboxChange", (event: CustomEvent) => {
      const node = event.target as HTMLCalciteCheckboxElement;
      expression.checked = node.checked;
      if (node.checked) {
        this._layers[id].expressions.push(expression.definitionExpression);
      } else {
        const i = this._layers[id].expressions.findIndex((expr) => expr === expression.definitionExpression);
        if (i > -1) {
          this._layers[id].expressions.splice(i, 1);
        }
      }
      this._generateOutput(id);
    });
  }

  handleResetFilter(): void {
    this.layerExpressions.map((layerExpression) => {
      const { id } = layerExpression;
      layerExpression.expressions.map((expression) => (expression.checked = false));
      this._layers[id].expressions = [];
    });
  }

  // ----------------------------------
  //
  //  Private methods
  //
  // ----------------------------------

  private _generateOutput(id: string): void {
    const newOutput = {
      id,
      definitionExpression: this._layers[id].expressions.join(" AND ")
    };
    this.updatingExpression = true;
    this.set("output", newOutput);
  }
}

export = FilterListViewModel;
