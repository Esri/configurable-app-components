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

// General esri Imports
import { property, subclass } from "esri/core/accessorSupport/decorators";
import Accessor = require("esri/core/Accessor");
import { watch, whenOnce } from "esri/core/reactiveUtils";
import Handles = require("esri/core/Handles");
import { fromJSON } from "esri/geometry/support/jsonUtils";

// Config Panel Imports
import { Expression, ExtentSelector, FilterLayers, FilterOutput, LayerExpression } from "./interfaces/interfaces";

let accordionStyle = `.accordion-item-content { padding: 0!important; }`;

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
  extentSelector: boolean = false;

  @property()
  extentSelectorConfig: ExtentSelector;

  @property()
  expandFilters: boolean;

  @property()
  output: FilterOutput;

  @property()
  layers: FilterLayers = {};
  // ----------------------------------
  //
  //  Private Variables
  //
  // ----------------------------------

  private _timeout: any;
  private _handles: Handles = new Handles();
  private _initDefExpressions: {};

  // ----------------------------------
  //
  //  Lifecycle methods
  //
  // ----------------------------------

  constructor(params?: any) {
    super(params);
  }

  destroy() {
    this._handles.removeAll();
    this._handles = null;
  }

  async initialize(): Promise<void> {
    await whenOnce(() => this.map);
    this._initDefExpressions = {};
    this.map.allLayers.forEach((layer) => {
      if (layer.hasOwnProperty("definitionExpression")) {
        this._initDefExpressions[layer.id] = layer["definitionExpression"];
      }
    });
  }

  // ----------------------------------
  //
  //  Public methods
  //
  // ----------------------------------

  setInitExpression(id: string, expression: Expression, scheduleRender: () => void): void {
    if (expression.field && expression.type) {
      const fl = this.map.findLayerById(id) as __esri.FeatureLayer;
      fl?.load().then(() => {
        const layerField = fl.fields?.find(({ name }) => name === expression.field);
        const domainType = layerField.domain?.type;
        expression.type = domainType === "coded-value" || domainType === "range" ? domainType : expression.type;
        this._updateExpression(id, expression, layerField, scheduleRender);
      });
    } else {
      this._updateExpression(id, expression, null, scheduleRender);
    }
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
    this._openAccordion(accordionItem);
    this._handles.add(watch(() => this.expandFilters, this._openAccordion.bind(this, accordionItem)));
  }

  initCheckbox(id: string, expression: Expression, checkbox: HTMLCalciteCheckboxElement) {
    checkbox.addEventListener("calciteCheckboxChange", (event: CustomEvent) => {
      const node = event.target as HTMLCalciteCheckboxElement;
      expression.checked = node.checked;
      if (node.checked) {
        this.layers[id].expressions[expression.definitionExpressionId] = {
          definitionExpression: expression.definitionExpression
        };
      } else {
        delete this.layers[id].expressions[expression.definitionExpressionId];
      }
      this.generateOutput(id);
    });
  }

  handleComboSelectCreate(expression: Expression, layerId: string, comboBox: HTMLCalciteComboboxElement): void {
    comboBox.addEventListener("calciteLookupChange", this.handleComboSelect.bind(this, expression, layerId));
  }

  handleComboSelect(expression: Expression, layerId: string, event: CustomEvent): void {
    const items = event.detail as HTMLCalciteComboboxItemElement[];
    const { definitionExpressionId, field } = expression;
    if (items && items.length) {
      const values = items.map(({ value }) => (typeof value === "number" ? value : `'${value}'`));
      expression.selectedFields = items.map(({ value }) => value);
      const definitionExpression = `${field} IN (${values.join(",")})`;
      this.layers[layerId].expressions[definitionExpressionId] = {
        definitionExpression
      };
      expression.checked = true;
    } else {
      delete this.layers[layerId].expressions[definitionExpressionId];
      expression.checked = false;
    }
    this.generateOutput(layerId);
  }

  handleSliderCreate(expression: Expression, layerId: string, slider: HTMLCalciteSliderElement): void {
    const { max, min, range } = expression;
    if ((max || max === 0) && (min || min === 0)) {
      slider.setAttribute("min-value", min);
      slider.setAttribute("max-value", max);
      slider.min = min;
      slider.max = max;
      slider.ticks = ((max as number) - (min as number)) / 4;
    }
    if (range && Object.keys(range)) {
      const minValue = range.min as number;
      const maxValue = range.max as number;
      slider.minValue = minValue;
      slider.maxValue = maxValue;
    }
    const style = document.createElement("style");
    style.innerHTML = `.thumb .handle__label--minValue.hyphen::after {content: unset!important}`;
    slider.shadowRoot.prepend(style);
    slider.addEventListener("calciteSliderChange", this.handleSliderChange.bind(this, expression, layerId));
  }

  handleSliderChange(expression: Expression, layerId: string, event: CustomEvent): void {
    const { maxValue, minValue } = event.target as HTMLCalciteSliderElement;
    this._debounceSliderChange(expression, layerId, maxValue, minValue);
  }

  handleDatePickerCreate(expression: Expression, layerId: string, datePicker: HTMLCalciteInputDatePickerElement): void {
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
    const datePicker = document.getElementById(expression.definitionExpressionId) as HTMLCalciteInputDatePickerElement;
    datePicker.start = null;
    datePicker.startAsDate = null;
    datePicker.end = null;
    datePicker.endAsDate = null;
    expression.checked = false;
    delete this.layers[layerId].expressions[expression.definitionExpressionId];
    this.generateOutput(layerId);
  }

  setExpressionDates(startDate: Date, endDate: Date, expression: Expression, layerId: string): void {
    const { expressions } = this.layers[layerId];
    const start = startDate ? this._convertToDate(Math.floor(startDate.getTime()), true) : null;
    const end = endDate ? this._convertToDate(Math.floor(endDate.getTime()), true) : null;
    if (start || end) {
      const chevron = end && !start ? "<" : !end && start ? ">" : null;
      if (chevron) {
        expressions[expression.definitionExpressionId] = {
          definitionExpression: `${expression.field} ${chevron} '${start ?? end}'`
        };
      } else {
        expressions[expression.definitionExpressionId] = {
          definitionExpression: `${expression.field} BETWEEN '${start}' AND '${end}'`
        };
      }
      expression.range = { min: start, max: end };
      expression.checked = true;
      this.generateOutput(layerId);
    }
  }

  handleResetFilter(): void {
    this.layerExpressions.map((layerExpression) => {
      const { id } = layerExpression;
      layerExpression.expressions.map((expression) => {
        const { definitionExpressionId, max, min, type } = expression;
        if (type === "string" || type === "coded-value") {
          const combobox = document.getElementById(definitionExpressionId) as HTMLCalciteComboboxElement;
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
          const datePicker = document.getElementById(definitionExpressionId) as HTMLCalciteInputDatePickerElement;
          datePicker.startAsDate = null;
          datePicker.endAsDate = null;
        } else if (type === "number" || type === "range") {
          const slider = document.getElementById(definitionExpressionId) as HTMLCalciteSliderElement;
          slider.minValue = min as number;
          slider.maxValue = max as number;
        } else {
          const checkbox = document.getElementById(definitionExpressionId) as HTMLCalciteCheckboxElement;
          checkbox.removeAttribute("checked");
        }
        expression.checked = false;
        expression.range = null;
        expression.selectedFields = null;
      });
      this.layers[id].expressions = {};
    });
  }

  generateOutput(id: string): void {
    const defExpressions = [];
    if (!this.layers?.[id]?.expressions) {
      return;
    }

    Object.values(this.layers[id].expressions)?.forEach(({ definitionExpression }) => {
      if (definitionExpression) {
        defExpressions.push(`(${definitionExpression})`);
      }
    });

    const newOutput = {
      id,
      definitionExpression: defExpressions.join(this.layers[id].operator)
    };

    this.set("output", newOutput);
  }

  // ----------------------------------
  //
  //  Private methods
  //
  // ----------------------------------

  private async _getFeatureAttributes(layerId: string, field: string): Promise<string[]> {
    const layer = this.map.allLayers.find(({ id }) => id === layerId) as __esri.FeatureLayer;
    if (layer && layer.type === "feature") {
      const query = layer.createQuery();
      if (layer?.capabilities?.query?.supportsCacheHint) {
        query.cacheHint = true;
      }
      if (field) {
        query.where = this._initDefExpressions?.[layerId] || "1=1";
        query.outFields = [field];
        query.orderByFields = [`${field} DESC`];
        query.returnDistinctValues = true;
        query.returnGeometry = false;
        query.maxRecordCountFactor = 3;
        query.returnExceededLimitFeatures = true;
        if (this.extentSelector && this.extentSelectorConfig) {
          query.geometry = this._getExtent(this.extentSelector, this.extentSelectorConfig);
          query.spatialRelationship = "intersects";
        }
        const results = await layer.queryFeatures(query);
        const features = results?.features.filter((feature) => feature.attributes?.[field]);
        return features?.map((feature) => feature.attributes?.[field]).sort();
      }
    }
    return [];
  }

  private async _calculateMinMaxStatistics(layerId: string, field: string): Promise<__esri.Graphic[]> {
    const layer = this.map.allLayers.find(({ id }) => id === layerId) as __esri.FeatureLayer;
    if (layer && layer.type === "feature") {
      const query = layer.createQuery();
      query.where = this._initDefExpressions?.[layerId] || "1=1";
      if (layer?.capabilities?.query?.supportsCacheHint) {
        query.cacheHint = true;
      }
      if (field) {
        const tmp = [
          {
            onStatisticField: field,
            outStatisticFieldName: `max${field}`,
            statisticType: "max"
          },
          {
            onStatisticField: field,
            outStatisticFieldName: `min${field}`,
            statisticType: "min"
          }
        ];
        query.outStatistics = tmp as any;
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

  private _debounceSliderChange(expression: Expression, layerId: string, max: number, min: number): void {
    if (this._timeout) {
      clearTimeout(this._timeout);
    }
    this._timeout = setTimeout(() => {
      this._updateExpressions(expression, layerId, max, min);
      this.generateOutput(layerId);
    }, 800);
  }

  private _updateExpressions(expression: Expression, layerId: string, max: number, min: number): void {
    if (!this.layers[layerId]) {
      return;
    }
    const { expressions } = this.layers[layerId];
    const { definitionExpressionId } = expression;
    if ((min || min === 0) && (max || max === 0)) {
      if (expressions[definitionExpressionId]) {
        expressions[definitionExpressionId] = {
          ...expressions[definitionExpressionId],
          definitionExpression: `${expression?.field} BETWEEN ${min} AND ${max}`
        };
        expression.checked = true;
        if (min === expression?.min && max === expression?.max) {
          delete expressions[definitionExpressionId];
          expression.checked = false;
        }
      } else {
        if (min !== expression?.min || max !== expression?.max) {
          expressions[definitionExpressionId] = {
            definitionExpression: `${expression?.field} BETWEEN ${min} AND ${max}`
          };
          expression.checked = true;
        }
      }
    }
    expression.range = { min, max };
  }

  private async _updateStringExpression(id: string, expression: Expression): Promise<boolean> {
    const { definitionExpressionId, field } = expression;
    expression.selectFields = await this._getFeatureAttributes(id, field);
    if (expression?.selectedFields) {
      const selectedFields = expression.selectedFields.map((field: string | number) =>
        typeof field === "number" ? field : `'${field}'`
      );
      const definitionExpression = `${field} IN (${selectedFields.join(",")})`;
      this.layers[id].expressions[definitionExpressionId] = {
        definitionExpression
      };
      return true;
    }
  }

  private async _updateNumberExpression(
    id: string,
    expression: Expression,
    scheduleRender: () => void
  ): Promise<boolean> {
    if ((!expression?.min && expression?.min !== 0) || (!expression?.max && expression?.max !== 0)) {
      const { definitionExpressionId, field } = expression;
      try {
        const graphic = await this._calculateMinMaxStatistics(id, field);
        const attributes = graphic?.[0]?.attributes;
        expression.min = attributes[`min${field}`];
        expression.max = attributes[`max${field}`];
      } catch {
      } finally {
        if (expression?.range && Object.keys(expression.range).length) {
          const { min, max } = expression.range;
          const definitionExpression = `${expression.field} BETWEEN ${min} AND ${max}`;
          this.layers[id].expressions[definitionExpressionId] = {
            definitionExpression
          };
        }
        scheduleRender();
        return true;
      }
    }
  }

  private async _updateDateExpression(
    id: string,
    expression: Expression,
    scheduleRender: () => void
  ): Promise<boolean> {
    const { definitionExpressionId, field, range } = expression;
    try {
      const graphic = await this._calculateMinMaxStatistics(id, field);
      const attributes = graphic?.[0]?.attributes;
      expression.min = this._convertToDate(attributes[`min${field}`]);
      expression.max = this._convertToDate(attributes[`max${field}`]);
    } catch {
    } finally {
      if (range && Object.keys(range).length) {
        let { min, max } = range;
        min = (min as string)?.replace("+", " ");
        max = (max as string)?.replace("+", " ");
        if (min || max) {
          const chevron = max && !min ? "<" : !max && min ? ">" : null;
          if (chevron) {
            this.layers[id].expressions[definitionExpressionId] = {
              definitionExpression: `${field} ${chevron} '${min ?? max}'`
            };
          } else {
            this.layers[id].expressions[definitionExpressionId] = {
              definitionExpression: `${field} BETWEEN '${min}' AND '${max}'`
            };
          }
          expression.start = min;
          expression.end = max;
        }
      }
      scheduleRender();
      return true;
    }
  }

  private _updateCodedValueExpression(id: string, expression: Expression, layerField: __esri.Field): boolean {
    const { definitionExpressionId, field } = expression;
    const selectFields: any[] = [];
    expression.codedValues = {};
    const domain = layerField.domain as __esri.CodedValueDomain;
    domain?.codedValues?.forEach((cv) => {
      const { code, name } = cv;
      selectFields.push(code);
      expression.codedValues[code] = name;
    });
    expression.selectFields = selectFields;
    if (expression?.selectedFields) {
      const selectedFields = expression.selectedFields.map((field: string | number) =>
        typeof field === "number" ? field : `'${field}'`
      );
      const definitionExpression = `${field} IN (${selectedFields.join(",")})`;
      this.layers[id].expressions[definitionExpressionId] = {
        definitionExpression
      };
      return true;
    }
  }

  private _updateRangeExpression(id: string, expression: Expression, layerField: __esri.Field): boolean {
    const { definitionExpressionId, field, range } = expression;
    const domain = layerField.domain as __esri.RangeDomain;
    expression.min = domain?.minValue;
    expression.max = domain?.maxValue;
    if (range && Object.keys(range).length) {
      const { min, max } = range;
      const definitionExpression = `${field} BETWEEN ${min} AND ${max}`;
      this.layers[id].expressions[definitionExpressionId] = {
        definitionExpression
      };
      return true;
    }
  }

  private async _updateExpression(
    id: string,
    expression: Expression,
    layerField: __esri.Field,
    scheduleRender: () => void
  ): Promise<void> {
    let update = false;
    const { definitionExpressionId, type } = expression;
    if (type === "string") {
      update = await this._updateStringExpression(id, expression);
    } else if (type === "number") {
      update = await this._updateNumberExpression(id, expression, scheduleRender);
    } else if (type === "date") {
      update = await this._updateDateExpression(id, expression, scheduleRender);
    } else if (type === "coded-value") {
      update = this._updateCodedValueExpression(id, expression, layerField);
    } else if (type === "range") {
      update = this._updateRangeExpression(id, expression, layerField);
    } else {
      if (expression.checked && expression.definitionExpression) {
        this.layers[id].expressions[definitionExpressionId] = {
          definitionExpression: expression.definitionExpression
        };
        update = true;
      }
    }

    if (update) {
      this.generateOutput(id);
    }
    scheduleRender();
  }

  private _openAccordion(accordionItem: HTMLCalciteAccordionItemElement): void {
    if (this.expandFilters) {
      accordionItem.setAttribute("active", "");
    } else {
      accordionItem.removeAttribute("active");
    }
  }
}

export = FilterListViewModel;
