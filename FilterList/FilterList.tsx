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
import { watch } from "esri/core/watchUtils";

// esri.widgets.support.widget
import { tsx } from "esri/widgets/support/widget";

// esri.widgets
import Widget = require("esri/widgets/Widget");

// dojo
import i18n = require("dojo/i18n!./Filter/nls/resources");

import { LayerExpression, ResetFilter } from "./FilterList/interfaces/interfaces";
import FilterListViewModel = require("./FilterList/FilterListViewModel");

const CSS = {
  base: "filter-list",
  filterContainer: "filter-list__filter-container",
  headerContainerDark: "filter-list__header-container filter-list__header-container--dark",
  headerContainerLight: "filter-list__header-container filter-list__header-container--light",
  resetContainer: "filter-list__reset-container",
  resetBtn: "filter-list__reset-btn",
  filterItem: {
    single: "filter-list__filter-item-container filter-list__filter-item-container--single",
    accordion: "filter-list__filter-item-container filter-list__filter-item-container--accordion",
    light: "filter-list__filter-item-container--light",
    dark: "filter-list__filter-item-container--dark"
  },
  filterItemTitle: "filter-list__filter-title",
  checkboxContainer: "filter-list__checkbox-container"
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

  @aliasOf("viewModel.definitionExpression")
  definitionExpression: string;

  // ----------------------------------
  //
  //  Private Variables
  //
  // ----------------------------------

  private _reset: ResetFilter;
  private _isSingleFilterList: boolean;

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
      watch(this, "definitionExpression", () => {
        this.scheduleRender();
      })
    );
  }

  render() {
    const filterList = this._initFilterList();
    const header = this._renderFilterHeader();
    const reset = this._renderReset();
    return (
      <div class={CSS.base}>
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
    return (
      <div class={this.theme === "light" ? CSS.headerContainerLight : CSS.headerContainerDark}>
        <h3>{i18n.selectFilter}</h3>
      </div>
    );
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
    const itemTheme = CSS.filterItem[this.theme];
    return layerExpression.expressions.map((expression) => {
      return (
        <div
          class={
            this._isSingleFilterList
              ? this.classes(CSS.filterItem.single, itemTheme)
              : this.classes(CSS.filterItem.accordion, itemTheme)
          }
        >
          <div class={CSS.filterItemTitle}>
            <p>{expression.name}</p>
          </div>
          <div class={CSS.checkboxContainer}>
            <calcite-checkbox
              scale="l"
              checked={expression.checked}
              theme={this.theme}
              afterCreate={this.viewModel.initCheckbox.bind(this.viewModel, expression)}
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
            bind={this.viewModel}
            appearance="outline"
            width="full"
            color={this._reset.color}
            theme={this.theme}
            disabled={this._reset.disabled}
            onclick={this.viewModel.handleResetFilter}
          >
            {i18n.resetFilter}
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
}

export = FilterList;
