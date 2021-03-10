# filter-list-widget

filter list widget built for version 4.x of the ArcGIS API for Javascript


### Filters from one layer:
![filter list widget, one layer](images/filter.png)
​
### Filters from multiple layers:
![filter list widget, multiple layers](images/filter-multiple.png)​

## Features:

1.  `MapView` and `SceneView` compatibility
2.  Generate filter list
    - Filter list with expressions from 2 or more layers are placed in accordions

**\*Note:** FilterList Widget uses Esri's design framework - Calcite Components.\*

Calcite Components Repository: https://github.com/Esri/calcite-components

## FilterList Widget

### Constructor:

#### new **FilterList(_properties?_)**

##### Property Overview:

| Name                 | Type                | Summary                                                    |
| -------------------- | -----------------   | ---------------------------------------------------------- |
| layerExpressions     | LayerExpression[]   | An array of custom type LayerExpression.                   |
| viewModel            | FilterListViewModel | The view model for this widget.                            |
| theme                | "light" | "dark"    | The theme for this widget (defaults to "light")            |
| headerTag            | String              | The HTML tag used for header title (defaults to "h3")      |
| output               | FilterOutput        | Output to watch for to update layer's definitionExpression (defaults to "h3")      |
| optionalBtnText      | String              | Add custom text to optional button next to the "Reset Filter" button (defaults to "Close Filter")      |
| optionalBtnOnClick   | Function            | Add custom function to the optional button's onClick       |

## Type: LayerExpression

### **Interface:**

```
  {
    id: string;
    title: string;
    expression: Expression;
  }
```

##### Property Overview:

| Name       | Type         | Summary                             |
| ---------- | ------------ | ----------------------------------- |
| id         | String       | Layer id.                           |
| title      | String       | Layer display name.                 |
| expression | Expression[] | An array of custom type Expression. |

## Type: Expression

### **Interface:**

```
  {
    definitionExpression: string;
    name: string;
    checked: boolean;
  }
```

##### Property Overview:

| Name                 | Type    | Summary                                                                                                         |
| -------------------- | ------- | --------------------------------------------------------------------------------------------------------------- |
| id                   | Number \| String  | Unique identifier. |
| definitionExpression | String  | Definition expression for this layer. |
| name                 | String  | Display name of definition expression in filter list. |
| checked(?)           | boolean | Determines if corresponding checkbox is checked and definition expression is used in filter (defaults to false) |

### Example layerExpressions value:

```
  layerExpressions: ILayerExpression[] = [
    {
      id: "layer1ID",
      title: "Layer One",
      expressions: [
        {
          definitionExpression: "ID = 0",
          name: "First definition expression",
        },
        {
          definitionExpression: "ID = 1",
          name: "Second definition expression"
        }
      ]
    },
    {
      id: "layer2ID",
      title: "Layer Two",
      expressions: [
        {
          definitionExpression: "ID = 'zero",
          name: "First definition expression",
          checked: true
        },
        {
          definitionExpression: "ID = 'one'",
          name: "Second definition expression"
        }
      ]
    }
  ]
```

## Type: FilterOutput

### **Interface:**

```
  {
    id: string;
    definitionExpression: string;
  }
```

##### Property Overview:

| Name       | Type         | Summary                             |
| ---------- | ------------ | ----------------------------------- |
| id         | String       | Layer id.                           |
| definitionExpression | String  | definition expression for this layer. |

## Watch Properties

### output

Watch output for changes and update the layer accordingly

```
  filterList.watch("output", (output: FilterOutput) => {
    console.log("filterList output:", output);
  });
```

Results from console.log:

```
  filterList output: {
    id: "layer1ID",
    definitionExpression: "ID = 1"
  };
```

### filterListReset

Listen for "filterListReset" event. An array of type FilterOutput will be returned after the "filterListReset" event is fired.

```
  filterList.on("filterListReset", (resetLayerExpressions: FilterOutput[]) => {
    console.log('on filterListReset: ', resetLayerExpressions);
  })
```

Results from console.log:

```
  on filterListReset: [
    {
      id: "layer1ID",
      definitionExpression: ""
    },
    {
      id: "layer2ID",
      definitionExpression: ""
    }
  ];
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

Copyright 2021 Esri

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
