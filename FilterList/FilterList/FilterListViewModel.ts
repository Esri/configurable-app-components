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
import { fromJSON } from "esri/geometry/support/jsonUtils";

// Config Panel Imports
import { Expression, ExtentSelector, FilterLayers, FilterOutput, LayerExpression } from "./interfaces/interfaces";

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
  map: __esri.WebMap;

  @property()
  layerExpressions: LayerExpression[] = [];

  @property()
  theme: "dark" | "light" = "light";

  @property()
  updatingExpression: boolean = false;

  @property()
  extentSelector: boolean = false;

  @property()
  extentSelectorConfig: ExtentSelector;

  @property()
  output: FilterOutput;

  // ----------------------------------
  //
  //  Private Variables
  //
  // ----------------------------------

  private _layers: FilterLayers = {};
  private _timeout: NodeJS.Timeout;

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
    this.layerExpressions?.map((layerExpression) => {
      let tmpExp = {};
      const { id } = layerExpression;
      layerExpression.expressions.map((expression) => {
        if (!expression.checked) {
          expression.checked = false;
        } else {
          tmpExp = {
            [expression.id]: expression.definitionExpression
          };
        }
      });
      this._layers[id] = {
        expressions: tmpExp,
        operator: layerExpression?.operator ?? " AND "
      };
      if (Object.keys(tmpExp).length > 0) {
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
        this._layers[id].expressions[expression.id] = {
          definitionExpression: expression.definitionExpression
        };
      } else {
        delete this._layers[id].expressions[expression.id];
      }
      this._generateOutput(id);
    });
  }

  handleSelect(expression: Expression, layerId: string, event: Event): void {
    const node = event.target as HTMLSelectElement;
    if (node.value !== "default") {
      const definitionExpression = `${expression.field} = '${node.value}'`;
      this._layers[layerId].expressions[expression.id] = {
        definitionExpression
      };
    } else {
      delete this._layers[layerId].expressions[expression.id];
    }
    this._generateOutput(layerId);
  }

  handleComboSelectCreate(expression: Expression, layerId: string, comboBox: HTMLCalciteComboboxElement): void {
    comboBox.addEventListener("calciteLookupChange", this.handleComboSelect.bind(this, expression, layerId));
  }

  handleComboSelect(expression: Expression, layerId: string, event: CustomEvent): void {
    const items = event.detail as HTMLCalciteComboboxItemElement[];
    if (items && items.length) {
      const values = items.map((item) => `'${item.value}'`);
      const definitionExpression = `${expression.field} IN (${values.join(",")})`;
      this._layers[layerId].expressions[expression.id] = {
        definitionExpression
      };
    } else {
      delete this._layers[layerId].expressions[expression.id];
    }
    this._generateOutput(layerId);
  }

  handleNumberInputCreate(
    expression: Expression,
    layerId: string,
    type: "min" | "max",
    input: HTMLCalciteInputElement
  ): void {
    input.addEventListener("calciteInputInput", this.handleNumberInput.bind(this, expression, layerId, type));
  }

  handleNumberInput(expression: Expression, layerId: string, type: "min" | "max", event: CustomEvent): void {
    const { value } = event.detail;
    this._debounceNumberInput(expression, layerId, value, type);
  }

  handleDatePickerCreate(expression: Expression, layerId: string, datePicker: HTMLCalciteInputDatePickerElement): void {
    datePicker.start = this._convertToDate(expression?.start);
    datePicker.end = this._convertToDate(expression?.end);
    datePicker.min = this._convertToDate(expression?.min);
    datePicker.max = this._convertToDate(expression?.max);
    datePicker.addEventListener(
      "calciteDatePickerRangeChange",
      this.handleDatePickerRangeChange.bind(this, expression, layerId)
    );
    datePicker.addEventListener("input", this.handleDatePickerInputChange.bind(this, expression, layerId));
  }

  handleDatePickerRangeChange(expression: Expression, layerId: string, event: CustomEvent): void {
    this.setExpressionDates(event.detail?.startDate, event.detail?.endDate, expression, layerId);
  }

  handleDatePickerInputChange(expression: Expression, layerId: string, event: Event) {
    setTimeout(() => {
      const datePicker = event.target as HTMLCalciteInputDatePickerElement;
      this.setExpressionDates(datePicker.startAsDate, datePicker.endAsDate, expression, layerId);
    }, 1000);
  }

  handleResetDatePicker(expression: Expression, layerId: string, event: Event): void {
    const datePicker = document.getElementById(expression.id.toString()) as HTMLCalciteInputDatePickerElement;
    datePicker.start = null;
    datePicker.startAsDate = null;
    datePicker.end = null;
    datePicker.endAsDate = null;
    delete this._layers[layerId].expressions[expression.id];
    this._generateOutput(layerId);
  }

  setExpressionDates(startDate: Date, endDate: Date, expression: Expression, layerId: string): void {
    const { expressions } = this._layers[layerId];
    const start = startDate ? this._convertToDate(Math.floor(startDate.getTime()), true) : null;
    const end = endDate ? this._convertToDate(Math.floor(endDate.getTime()), true) : null;
    const chevron = end && !start ? "<" : !end && start ? ">" : null;

    if (chevron) {
      expressions[expression.id] = {
        definitionExpression: `${expression.field} ${chevron} '${start ?? end}'`,
        type: "date"
      };
    } else {
      expressions[expression.id] = {
        definitionExpression: `${expression.field} BETWEEN '${start}' AND '${end}'`,
        type: "date"
      };
    }
    this._generateOutput(layerId);
  }

  handleResetFilter(): void {
    this.layerExpressions.map((layerExpression) => {
      const { id } = layerExpression;
      layerExpression.expressions.map((expression) => {
        const { id, type, useCombobox } = expression;
        if (type) {
          if (type === "string" && !useCombobox) {
            const select = document.getElementById(id.toString()) as HTMLSelectElement;
            select.value = "default";
          } else if (type === "string" && useCombobox) {
            const combobox = document.getElementById(id.toString()) as HTMLCalciteComboboxElement;
            const wrapper = combobox.shadowRoot.querySelector(".wrapper");
            for (let i = 0; i < wrapper.children.length; i++) {
              const child = wrapper.children[i];
              if (child.nodeName === "CALCITE-CHIP") {
                const chip = child as HTMLCalciteChipElement;
                chip.style.display = "none";
              }
            }
            for (let i = 0; i < combobox.children.length; i++) {
              const comboboxItem = combobox.children[i] as HTMLCalciteComboboxItemElement;
              comboboxItem.selected = false;
            }
          } else if (type === "date") {
            const datePicker = document.getElementById(id.toString()) as HTMLCalciteInputDatePickerElement;
            datePicker.startAsDate = new Date(expression?.start);
            datePicker.endAsDate = new Date(expression?.end);
          }
        }
        expression.checked = false;
      });
      this._layers[id].expressions = {};
    });
  }

  async calculateStatistics(layerId: string, field: string): Promise<__esri.Graphic[]> {
    const layer = this.map.layers.find(({ id }) => id === layerId) as __esri.FeatureLayer;
    if (layer && layer.type === "feature") {
      const query = layer.createQuery();
      query.where = layer.definitionExpression ? layer.definitionExpression : "1=1";
      if (layer?.capabilities?.query?.supportsCacheHint) {
        query.cacheHint = true;
      }
      if (field) {
        query.outFields = [field];
        query.returnDistinctValues = true;
        query.returnGeometry = false;
        if (this.extentSelector && this.extentSelectorConfig) {
          query.geometry = this._getExtent(this.extentSelector, this.extentSelectorConfig);
          query.spatialRelationship = "intersects";
        }
        const results = await layer.queryFeatures(query);

        return results?.features;
      }
    }
    return [];
  }

  // ----------------------------------
  //
  //  Private methods
  //
  // ----------------------------------

  private _generateOutput(id: string): void {
    const defExpressions = [];
    Object.values(this._layers[id].expressions).forEach(({ definitionExpression }) =>
      defExpressions.push(definitionExpression)
    );
    const newOutput = {
      id,
      definitionExpression: defExpressions.join(this._layers[id].operator)
    };
    this.updatingExpression = true;
    this.set("output", newOutput);
  }

  private _convertToDate(date: string | number, includeTime: boolean = false): string {
    if (date) {
      const tmpDate = new Date(date);
      const formattedDate = `${tmpDate.getFullYear()}-${tmpDate.getMonth() + 1}-${tmpDate.getDate()}`;
      if (includeTime) {
        const time = `${tmpDate.getHours()}:${tmpDate.getMinutes()}:${tmpDate.getSeconds()}`;
        return `${formattedDate} ${time}`;
      } else {
        return formattedDate;
      }
    }
    return null;
  }

  private _getExtent(extentSelector: boolean, extentSelectorConfig: ExtentSelector): __esri.Geometry {
    if (extentSelector && extentSelectorConfig) {
      const { constraints } = extentSelectorConfig;
      let newConstraints = { ...constraints };
      const geometry = newConstraints?.geometry;
      if (geometry) {
        const tmpExtent = fromJSON(geometry);
        if (tmpExtent && (tmpExtent?.type === "extent" || tmpExtent?.type === "polygon")) {
          return tmpExtent;
        }
      }
    }
    return null;
  }

  private _debounceNumberInput(expression: Expression, layerId: string, value: string, type: "min" | "max"): void {
    if (this._timeout) {
      clearTimeout(this._timeout);
    }
    this._timeout = setTimeout(() => {
      this._updateExpressions(layerId, expression.id, value, type);
      this._setNumberRangeExpression(expression, layerId, value);
      this._generateOutput(layerId);
    }, 800);
  }

  private _updateExpressions(layerId: string, id: number, value: string, type: "min" | "max"): void {
    const { expressions } = this._layers[layerId];
    if (expressions[id]) {
      expressions[id] = {
        ...expressions[id],
        type: "number",
        [type]: value
      };
      if (!expressions[id]?.min && !expressions[id]?.max) {
        delete expressions[id];
        this._generateOutput(layerId);
        return;
      }
    } else {
      expressions[id] = {
        definitionExpression: null,
        type: "number",
        [type]: value
      };
    }
  }

  private _setNumberRangeExpression(expression: Expression, layerId: string, value: string): void {
    const { expressions } = this._layers[layerId];
    const { field, id } = expression;
    const displayName = document.getElementById(`${id}-name`);
    const inputMessage = document.getElementById(`${id}-error`) as HTMLCalciteInputMessageElement;
    const min = expressions[id]?.min;
    const max = expressions[id]?.max;
    const chevron = max && !min ? "<" : !max && min ? ">" : null;
    if (chevron) {
      const exprValue = value ? value : max ? max : min ? min : null;
      if (exprValue) {
        displayName.style.color = "inherit";
        inputMessage.active = false;
        expressions[id].definitionExpression = `${field} ${chevron} ${exprValue}`;
      } else {
        delete expressions[id];
      }
    } else if (Number(max) < Number(min)) {
      displayName.style.color = "red";
      inputMessage.active = true;
    } else {
      displayName.style.color = "inherit";
      inputMessage.active = false;
      expressions[id].definitionExpression = `${field} BETWEEN ${min} AND ${max}`;
    }
  }
}

export = FilterListViewModel;
