// Copyright 2019 Esri

// Licensed under the Apache License, Version 2.0 (the "License");

// you may not use this file except in compliance with the License.

// You may obtain a copy of the License at

//     http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software

// distributed under the License is distributed on an "AS IS" BASIS,

// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.

// See the License for the specific language governing permissions and

// limitations under the License.​

/// <amd-dependency path="esri/core/tsSupport/declareExtendsHelper" name="__extends" />
/// <amd-dependency path="esri/core/tsSupport/decorateHelper" name="__decorate" />

// esri.core
import Accessor = require("esri/core/Accessor");

// esri.core.accessorSupport
import {
  subclass,
  declared,
  property
} from "esri/core/accessorSupport/decorators";

// esri.widgets.Expand
import Expand = require("esri/widgets/Expand");

// esri.views.MapView
import MapView = require("esri/views/MapView");

// esri.views.SceneView
import SceneView = require("esri/views/SceneView");

// esri.core.Collection
import Collection = require("esri/core/Collection");

// InfoItem
import InfoItem = require("./InfoItem");

//----------------------------------
//
//  Info Item Collection
//
//----------------------------------
const InfoItemCollection = Collection.ofType<InfoItem>(InfoItem);

// State
type State = "ready" | "loading" | "disabled";

@subclass("InfoViewModel")
class InfoViewModel extends declared(Accessor) {
  // state
  @property({
    dependsOn: ["view.ready"],
    readOnly: true
  })
  get state(): State {
    const ready = this.get("view.ready");
    return ready ? "ready" : this.view ? "loading" : "disabled";
  }

  // view
  @property()
  view: MapView | SceneView = null;

  // selectedItemIndex
  @property()
  selectedItemIndex: number = 0;

  // expandWidget
  @property()
  expandWidget: Expand = null;

  // infoContent
  @property({
    type: InfoItemCollection
  })
  infoContent: Collection<InfoItem> = new InfoItemCollection();

  // goToPage
  goToPage(event: Event, paginationNodes: any[]): void {
    const node = event.currentTarget as HTMLElement;
    const itemIndex = node.getAttribute("data-pagination-index");
    this.selectedItemIndex = parseInt(itemIndex);
    paginationNodes[this.selectedItemIndex].domNode.focus();
  }

  // nextPage
  nextPage(paginationNodes: any[]): void {
    if (this.selectedItemIndex !== this.infoContent.length - 1) {
      this.selectedItemIndex += 1;
      paginationNodes[this.selectedItemIndex].domNode.focus();
    }
  }

  // previousPage
  previousPage(paginationNodes: any[]): void {
    if (this.selectedItemIndex !== 0) {
      this.selectedItemIndex -= 1;
      paginationNodes[this.selectedItemIndex].domNode.focus();
    }
  }

  // closeInfoPanel
  closeInfoPanel(): void {
    this.selectedItemIndex = 0;
    this.expandWidget.expanded = false;
  }
}

export = InfoViewModel;
