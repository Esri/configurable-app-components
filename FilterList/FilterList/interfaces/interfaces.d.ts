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

export interface Expression {
  id: number;
  definitionExpressionId?: string;
  name: string;
  definitionExpression?: string;
  type?: string;
  field?: ExpressionField;
  checked?: boolean;
  selectFields?: string[] | number[];
  codedValues?: { [key: string]: string };
  placeholder?: string;
  min?: number | string;
  max?: number | string;
  start?: number | string;
  end?: number | string;
  step?: number;
}

export interface LayerExpression {
  id: string;
  title: string;
  expressions: Expression[];
  operator: string;
}

export interface ResetFilter {
  disabled: boolean;
  color: string;
}

export interface FilterOutput {
  id: string;
  definitionExpression: string;
}

interface Expressions {
  expressions: {
    [key: string]: { definitionExpression: string; type?: ExpressionField; min?: number; max?: number };
  };
  operator: string;
}

export interface FilterLayers {
  [key: string]: Expressions;
}

export interface ExtentSelector {
  constraints: __esri.MapViewConstraints;
  mapRotation: number;
}

type ExpressionField = "string" | "number" | "date" | "coded-value" | "range";
