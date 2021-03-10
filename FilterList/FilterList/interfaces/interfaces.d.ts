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
  definitionExpression: string;
  name: string;
  checked?: boolean;
}

export interface LayerExpression {
  id: string;
  title: string;
  expressions: Expression[];
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
  expressions: string[];
}

export interface FilterLayers {
  [key: string]: Expressions;
}