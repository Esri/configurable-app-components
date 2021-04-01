// esri.core
import Accessor = require("esri/core/Accessor");

// esri.core.accessorSupport
import { subclass, property } from "esri/core/accessorSupport/decorators";

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
class InfoViewModel extends Accessor {
  constructor(value?: unknown) {
    super(value);
  }

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
    const infoExpandBtn = document.querySelector(
      "div[aria-controls='infoExpand_controls_content']"
    ) as HTMLDivElement;
    const focusInt = setInterval(() => {
      infoExpandBtn.focus();
      if (document.activeElement === infoExpandBtn) {
        clearInterval(focusInt);
      }
    }, 0);
  }
}

export = InfoViewModel;
