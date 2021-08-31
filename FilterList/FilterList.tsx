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
import { aliasOf, property, subclass } from "esri/core/accessorSupport/decorators";
import { init, when, whenTrue } from "esri/core/watchUtils";

// esri.widgets.support.widget
import { tsx } from "esri/widgets/support/widget";

// esri.widgets
import Widget = require("esri/widgets/Widget");
import { getLocale } from "esri/intl";

// dojo
import i18n = require("dojo/i18n!./FilterList/nls/resources");

import {
  Expression,
  ExtentSelector,
  FilterOutput,
  LayerExpression,
  ResetFilter
} from "./FilterList/interfaces/interfaces";
import FilterListViewModel = require("./FilterList/FilterListViewModel");

const CSS = {
  baseDark: "esri-filter-list esri-filter-list--dark",
  baseLight: "esri-filter-list esri-filter-list--light",
  filterContainer: "esri-filter-list__filter-container",
  headerContainer: "esri-filter-list__header-container",
  resetContainer: "esri-filter-list__reset-container",
  resetBtn: "esri-filter-list__reset-btn",
  optionalBtn: "esri-filter-list__optional-btn",
  filterItem: {
    single: "esri-filter-list__filter-item-container esri-filter-list__filter-item-container--single",
    accordion: "esri-filter-list__filter-item-container esri-filter-list__filter-item-container--accordion",
    userInput: "esri-filter-list__filter-item-container esri-filter-list__filter-item-container--user-input"
  },
  filterItemTitle: "esri-filter-list__filter-title",
  checkboxContainer: "esri-filter-list__checkbox-container",
  numberInputContainer: "esri-filter-list__number-input-container",
  numberInput: "esri-filter-list__number-input",
  dateInputContainer: "esri-filter-list__date-picker-input-container",
  operatorDesc: "esri-filter-list__operator-description"
};

@subclass("FilterList")
class FilterList extends Widget {
  // ----------------------------------
  //
  //  Public Variables
  //
  // ----------------------------------

  @aliasOf("viewModel.map")
  map: __esri.WebMap;

  @aliasOf("viewModel.layerExpressions")
  layerExpressions: LayerExpression[];

  @property()
  viewModel: FilterListViewModel = new FilterListViewModel();

  @aliasOf("viewModel.theme")
  theme: "dark" | "light";

  @aliasOf("viewModel.updatingExpression")
  updatingExpression: boolean;

  @aliasOf("viewModel.extentSelector")
  extentSelector: boolean;

  @aliasOf("viewModel.updatingExpression")
  extentSelectorConfig: ExtentSelector;

  @property()
  headerTag: string = "h3";

  @property()
  optionalBtnText: string = "Close Filter";

  @property()
  optionalBtnOnClick: Function;

  @aliasOf("viewModel.output")
  output: FilterOutput;

  // ----------------------------------
  //
  //  Private Variables
  //
  // ----------------------------------

  private _reset: ResetFilter;
  private _isSingleFilterConfig: boolean;
  private _headerTitle: HTMLElement;
  private _locale: string;

  // ----------------------------------
  //
  //  Lifecycle methods
  //
  // ----------------------------------

  constructor(properties?: any) {
    super(properties);
  }

  postInitialize() {
    this._locale = getLocale();
    this.own([
      when(this, "map.loaded", async () => {
        this.layerExpressions?.forEach(async (layerExpression) => {
          const { id } = layerExpression;
          layerExpression.expressions?.forEach(async (expression, index) => {
            if (expression.field && expression.type) {
              const { field, type } = expression;
              expression.definitionExpressionId = `${id}-${index}`;
              if (type === "string") {
                const graphics = await this.viewModel.calculateStatistics(id, field);
                const tmp = [];
                graphics.forEach((graphic) => tmp.push(graphic?.attributes?.[field]));
                expression.selectFields = tmp;
                this.scheduleRender();
              } else if (type === "number") {
                const graphic = await this.viewModel.calculateMinMaxStatistics(id, field);
                expression.min = expression.min ? expression.min : graphic?.[0]?.attributes[`min${field}`]?.toFixed(2);
                expression.max = expression.max ? expression.max : graphic?.[0]?.attributes[`max${field}`]?.toFixed(2);
                this.scheduleRender();
              }
            }
          });
        });
      }),
      whenTrue(this, "updatingExpression", () => {
        this.scheduleRender();
        this.updatingExpression = false;
      }),
      init(this, "layerExpressions", () => {
        this.viewModel.initExpressions();
        this._reset = {
          disabled: this.layerExpressions && this.layerExpressions.length ? false : true,
          color: this.layerExpressions && this.layerExpressions.length ? "blue" : "dark"
        };
      })
    ]);
  }

  render() {
    const filterConfig = this._initFilterConfig();
    const header = this._renderFilterHeader();
    const reset = this.optionalBtnOnClick ? this._renderOptionalButton() : this._renderReset();
    return (
      <div class={this.theme === "light" ? CSS.baseLight : CSS.baseDark}>
        <div class={CSS.filterContainer} style={!this._isSingleFilterConfig ? "border:unset" : null}>
          {header}
          {filterConfig}
          {reset}
        </div>
      </div>
    );
  }

  // ----------------------------------
  //
  //  Private methods
  //
  // ----------------------------------

  private _renderFilterHeader(): any {
    return <div bind={this} afterCreate={this._createHeaderTitle} class={CSS.headerContainer}></div>;
  }

  private _renderLayerAccordion(): any {
    return (
      <calcite-accordion theme={this.theme}>
        {this.layerExpressions.map((layerExpression) => {
          return this._renderFilterAccordionItem(layerExpression);
        })}
      </calcite-accordion>
    );
  }

  private _renderFilterAccordionItem(layerExpression: LayerExpression): any {
    const filter = this._renderFilter(layerExpression);
    const { operator } = layerExpression;
    const operatorTranslation = operator === "OR" ? "orOperator" : "andOperator";
    return (
      <calcite-accordion-item
        key={layerExpression.id}
        bind={this}
        item-title={layerExpression.title}
        item-subtitle={i18n?.[operatorTranslation]}
        icon-position="start"
        afterCreate={this.viewModel.initLayerHeader}
      >
        {filter}
      </calcite-accordion-item>
    );
  }

  private _renderFilter(layerExpression: LayerExpression): any {
    const { id } = layerExpression;
    return layerExpression.expressions.map((expression, index) => {
      return expression.definitionExpression ? (
        <div
          key={`${id}-${index}`}
          class={this._isSingleFilterConfig ? CSS.filterItem.single : CSS.filterItem.accordion}
        >
          <div class={CSS.filterItemTitle}>
            <p>{expression.name}</p>
          </div>
          <div class={CSS.checkboxContainer}>
            <calcite-checkbox
              scale="l"
              checked={expression.checked}
              theme={this.theme}
              afterCreate={this.viewModel.initCheckbox.bind(this.viewModel, id, expression)}
            ></calcite-checkbox>
          </div>
        </div>
      ) : (
        this._initInput(id, expression)
      );
    });
  }

  private _renderReset(): any {
    return (
      <div class={CSS.resetContainer}>
        <div class={CSS.resetBtn}>
          <calcite-button
            bind={this}
            appearance="outline"
            width="half"
            color={this._reset.color}
            theme={this.theme}
            disabled={this._reset.disabled}
            onclick={this._handleResetFilter}
          >
            {i18n.resetFilter}
          </calcite-button>
        </div>
      </div>
    );
  }

  private _renderOptionalButton(): any {
    return (
      <div class={CSS.resetContainer}>
        <div class={CSS.optionalBtn}>
          <calcite-button
            bind={this}
            appearance="outline"
            color={this._reset.color}
            theme={this.theme}
            disabled={this._reset.disabled}
            onclick={this._handleResetFilter}
          >
            reset
          </calcite-button>
          <calcite-button
            bind={this}
            appearance="solid"
            color="blue"
            theme={this.theme}
            onclick={this.optionalBtnOnClick}
          >
            {this.optionalBtnText}
          </calcite-button>
        </div>
      </div>
    );
  }

  // HARDCODED IN EN
  private _renderDatePicker(layerId: string, expression: Expression) {
    return (
      <label class={CSS.filterItem.userInput}>
        <span>{expression?.name}</span>
        <div class={CSS.dateInputContainer}>
          <calcite-input-date-picker
            id={expression?.definitionExpressionId}
            afterCreate={this.viewModel.handleDatePickerCreate.bind(this.viewModel, expression, layerId)}
            scale="s"
            start={expression?.start}
            end={expression?.end}
            min={expression?.min}
            max={expression?.max}
            locale={this._locale ?? "en"}
            next-month-label="Next month"
            prev-month-label="Previous month"
            range
            layout="vertical"
            theme={this.theme}
          ></calcite-input-date-picker>
          <calcite-action
            onclick={this.viewModel.handleResetDatePicker.bind(this.viewModel, expression, layerId)}
            icon="reset"
            label="Reset date picker"
            scale="s"
            theme={this.theme}
          ></calcite-action>
        </div>
      </label>
    );
  }

  // HARDCODED IN EN
  private _renderNumberSlider(layerId: string, expression: Expression) {
    const max = expression?.max as number;
    const min = expression?.min as number;
    const ticks = (max - min) / 4;
    return (
      <label class={CSS.filterItem.userInput}>
        <span>{expression?.name}</span>
        <calcite-slider
          id={expression?.definitionExpressionId}
          afterCreate={this.viewModel.handleNumberInputCreate.bind(this.viewModel, expression, layerId)}
          min={min}
          minValue={min}
          min-label={`${expression.field}, lower bound`}
          max={max}
          maxValue={max}
          max-label={`${expression.field}, upper bound`}
          step={expression?.step ? expression.step : 1}
          label-handles=""
          ticks={ticks}
          snap=""
          is-range
          theme={this.theme}
        ></calcite-slider>
      </label>
    );
  }

  private _renderCombobox(layerId: string, expression: Expression) {
    const comboItems = expression?.selectFields?.map((field, index) => {
      return <calcite-combobox-item key={`${field}-${index}`} value={field} text-label={field}></calcite-combobox-item>;
    });
    return (
      <label key="combo-select" class={CSS.filterItem.userInput}>
        <span>{expression?.name}</span>
        <calcite-combobox
          id={expression?.definitionExpressionId}
          afterCreate={this.viewModel.handleComboSelectCreate.bind(this.viewModel, expression, layerId)}
          label={expression?.name}
          placeholder={expression?.placeholder}
          selection-mode="multi"
          scale="s"
          max-items="6"
          theme={this.theme}
        >
          {comboItems}
        </calcite-combobox>
      </label>
    );
  }

  private _initFilterConfig(): any {
    if (this.layerExpressions && this.layerExpressions.length) {
      if (this.layerExpressions.length === 1) {
        this._isSingleFilterConfig = true;
        return (
          <div>
            <p class={CSS.operatorDesc}>Results will show ALL matching filters</p>
            {this._renderFilter(this.layerExpressions[0])}
          </div>
        );
      } else if (this.layerExpressions.length > 1) {
        this._isSingleFilterConfig = false;
        return this._renderLayerAccordion();
      }
    }
    return;
  }

  private _initInput(layerId: string, expression: Expression) {
    const { type } = expression;
    if (type === "string") {
      return this._renderCombobox(layerId, expression);
    } else if (type === "number") {
      return this._renderNumberSlider(layerId, expression);
    } else if (type === "date") {
      return this._renderDatePicker(layerId, expression);
    }
  }

  private _handleResetFilter(): void {
    const resetLayers: FilterOutput[] = [];
    this.layerExpressions.map((layerExpression) => {
      resetLayers.push({
        id: layerExpression.id,
        definitionExpression: ""
      });
    });
    this.viewModel.handleResetFilter();
    this.emit("filterListReset", resetLayers);
  }

  private _createHeaderTitle(header: HTMLDivElement): void {
    this._headerTitle = document.createElement(this.headerTag);
    this._headerTitle.innerHTML = i18n.selectFilter;
    header.prepend(this._headerTitle);
  }
}

export = FilterList;
