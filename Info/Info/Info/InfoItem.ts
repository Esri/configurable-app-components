/// <amd-dependency path="esri/core/tsSupport/declareExtendsHelper" name="__extends" />
/// <amd-dependency path="esri/core/tsSupport/decorateHelper" name="__decorate" />

import {
  declared,
  property,
  subclass
} from "esri/core/accessorSupport/decorators";

// esri.core.accessorSupport
import Accessor = require("esri/core/Accessor");

// InfoItemType
type InfoItemType = "list" | "explanation";

@subclass("InfoItem")
class InfoItem extends declared(Accessor) {
  // type
  @property()
  type: InfoItemType = null;

  // title
  @property()
  title: string = null;

  // infoContentItems
  @property()
  infoContentItems: string[] = null;
}

export = InfoItem;
