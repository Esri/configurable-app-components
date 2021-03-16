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
import { whenTrue } from "esri/core/watchUtils";

// esri.widgets.support.widget
import { tsx } from "esri/widgets/support/widget";

// esri.widgets
import Widget = require("esri/widgets/Widget");

// dojo
import i18n = require("dojo/i18n!./FilterList/nls/resources");

import { FilterOutput, LayerExpression, ResetFilter } from "./FilterList/interfaces/interfaces";
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
    accordion: "esri-filter-list__filter-item-container esri-filter-list__filter-item-container--accordion"
  },
  filterItemTitle: "esri-filter-list__filter-title",
  checkboxContainer: "esri-filter-list__checkbox-container"
};

@subclass("FilterList")
class FilterList extends Widget {
  // ----------------------------------
  //
  //  Public Variables
  //
  // ----------------------------------

  @aliasOf("viewModel.layerExpressions")
  layerExpressions: LayerExpression[];

  @property()
  viewModel: FilterListViewModel = new FilterListViewModel();

  @aliasOf("viewModel.theme")
  theme: "dark" | "light";

  @aliasOf("viewModel.updatingExpression")
  updatingExpression: boolean;

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
  private _isSingleFilterList: boolean;
  private _headerTitle: HTMLElement;

  // ----------------------------------
  //
  //  Lifecycle methods
  //
  // ----------------------------------

  constructor(properties?: any) {
    super(properties);
  }

  postInitialize() {
    this.viewModel.initExpressions();
    this._reset = {
      disabled: this.layerExpressions && this.layerExpressions.length ? false : true,
      color: this.layerExpressions && this.layerExpressions.length ? "blue" : "dark"
    };
    this.own(
      whenTrue(this, "updatingExpression", () => {
        this.scheduleRender();
        this.updatingExpression = false;
      })
    );
  }

  render() {
    const filterList = this._initFilterList();
    const header = this._renderFilterHeader();
    const reset = this.optionalBtnOnClick ? this._renderOptionalButton() : this._renderReset();
    return (
      <div class={this.theme === "light" ? CSS.baseLight : CSS.baseDark}>
        <div class={CSS.filterContainer}>
          {header}
          {filterList}
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
    return (
      <calcite-accordion-item
        key={layerExpression.id}
        bind={this}
        item-title={layerExpression.title}
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
      return (
        <div key={`${id}-${index}`} class={this._isSingleFilterList ? CSS.filterItem.single : CSS.filterItem.accordion}>
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
            width="half"
            color={this._reset.color}
            theme={this.theme}
            disabled={this._reset.disabled}
            onclick={this._handleResetFilter}
          >
            {i18n.resetFilter}
          </calcite-button>
          <calcite-button
            bind={this}
            appearance="solid"
            width="half"
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

  private _initFilterList(): any {
    if (this.layerExpressions) {
      if (this.layerExpressions.length === 1) {
        this._isSingleFilterList = true;
        return this._renderFilter(this.layerExpressions[0]);
      } else if (this.layerExpressions.length > 1) {
        this._isSingleFilterList = false;
        return this._renderLayerAccordion();
      }
    }
    return;
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
