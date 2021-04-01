import {
  property,
  subclass
} from "esri/core/accessorSupport/decorators";

// esri.core.accessorSupport
import Accessor = require("esri/core/Accessor");

// InfoItemType
type InfoItemType = "list" | "explanation";

@subclass("InfoItem")
class InfoItem extends Accessor {
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
