# info-panel-widget

Custom Info Panel widget built using the version 4.x of the ArcGIS API for Javascript

![info-panel-1](images/info-1.png)

![info-panel-2](images/info-2.png)

## Features:

1. Generate two types of user-interfaces to communicate information to a user.

   * List
   
   * Explanation

**\*Note:** Info Panel Widget uses Esri's Calcite CSS Styles.\*

Calcite Web Documentation: https://esri.github.io/calcite-web/documentation/

## Info

### Constructor:

#### new **Info(_properties?_)**

##### Property Overview:

| Name              | Type                 | Summary                                                                      |
| ----------------- | -------------------- | ---------------------------------------------------------------------------- |
| view **              | MapView \| SceneView | A reference to the `MapView` or `SceneView`                                  |
| viewModel         | InfoViewModel       | The view model for this widget.                                              |
| iconClass         | String               | The widget's default CSS icon class.                                         |
| label             | String               | The widget's default label.                                                  |
| iconClass         | String               | The widget's default CSS icon class.                                         |
| infoContent **       | Collection<InfoItem> | Collection of info items to include in the UI.                                   |
| expandWidget **      | Expand               | Expand widget that allows widget to collapse when 'Close' button is clicked. |
| selectedItemIndex ** | number               | Pagination index which indicates the current page.                           |

** = Aliased

## InfoItem

### Constructor:

#### new **InfoItem(_properties?_)**

##### Property Overview:

| Name             | Type         | Summary                                                                                   |
| ---------------- | ------------ | ----------------------------------------------------------------------------------------- |
| type             | InfoItemType | Determines how the information will be displayed. Posible values: `list` \| `explanation` |
| title            | string       | Heading for the page.                                                                     |
| infoContentItems | string[]     | List of content information to be used on the page.                                       |

## InfoViewModel

### Constructor:

#### new **InfoViewModel(_properties?_)**

##### Property Overview:

| Name              | Type                 | Summary                                                                      |
| ----------------- | -------------------- | ---------------------------------------------------------------------------- |
| state             | string               | Current state of the widget.                                                 |
| view              | MapView \| SceneView | A reference to the MapView or SceneView                                      |
| selectedItemIndex | number               | Pagination index which indicates the current page.                           |
| expandWidget      | Expand               | Expand widget that allows widget to collapse when 'Close' button is clicked. |
| infoContent       | Collection<InfoItem> | Collection of info items to include in UI.                                   |

### **Example:**

```

              const infoSteps = [
                "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sapiente expedita ipsum",
                "Sapiente expedita ipsum, inventore nihil sunt quasi nesciunt error fugit atque dolore illo delectus",
                "sit autem repellendus vitae similique voluptate aut numquam tempora"
              ];
              
              const infoExplanation = [
                "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sapiente expedita ipsum",
                "Sapiente expedita ipsum, inventore nihil sunt quasi nesciunt error fugit atque dolore illo delectus",
                "sit autem repellendus vitae similique voluptate aut numquam tempora"
              ];

              const infoContent = new Collection([
                    new InfoItem({
                      type: "list",
                      title: "Lorem Ipsum",
                      infoContentItems: infoSteps
                    }),
                    new InfoItem({
                      type: "explanation",
                      title: newInteractiveLegend,
                      infoContentItems: infoExplanation
                    })
              ]);

              const infoWidget = new Info({
                view,
                infoContent
              });

              const infoExpand = new Expand({
                view,
                content: infoWidget,
                expandTooltip: infoWidget.label
              });

              infoWidget.expandWidget = this.infoExpand;
```

## Resources

- [ArcGIS for JavaScript API Resource Center](http://help.arcgis.com/en/webapi/javascript/arcgis/index.html)
- [ArcGIS Blog](http://blogs.esri.com/esri/arcgis/)
- [twitter@esri](http://twitter.com/esri)

## Issues

Find a bug or want to request a new feature? Please let us know by submitting an issue.

## Contributing

Esri welcomes contributions from anyone and everyone. Please see our [guidelines for contributing](https://github.com/esri/contributing).

## Licensing

Copyright 2019 Esri

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

A copy of the license is available in the repository's [LICENSE](LICENSE) file.
