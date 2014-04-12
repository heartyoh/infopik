infopik
=======
[![Build Status](https://travis-ci.org/heartyoh/infopik.svg?branch=master)](https://travis-ci.org/heartyoh/infopik)

Infographic Painter &amp; Presenter

## Features
 * Canvas base
 * Barcode Symbols
 * Rectangle
 * Circle
 * Line
 * Text
 * Image
 
## Usage

```js
var infopik = require('infopik');

var painter = infopik.painter(canvas, {
	keydown : onKeyDownHandler,
    selectionchange : onSelectionChange,
    propertychange : onPropertyChange
});

var presenter = infopik.presenter(canvas, {
	keydown : onKeyDownHandler
});
```

## API

### Objects
* painter / presenter
* symbol (model) 

### Painter(Presenter) Properties
* get / set
 * edit mode
 * width
 * height
 * root model
* symbol : get symbol

### Symbols (Models) Manipulation
* add : add symbol(s)
* remove : remove symbol(s)
* select : select children symbol(s)

### Selections
* selected : get or set selected symbol

### Move
* move : move delta or move to

### Editing
* undo
* redo
* cut
* copy
* paste

### Align
* align : top, bottom, left, right, vcenter, hcenter

### Arrange Z-Order
* arrange : front, back, forward, backward

### Scale
* scale : enlarge, reduce or set scale
 
## Events

### Painter(Presenter) Property Change
* before / after property change
* before / after close

### Symbols Structure Change
* When symbols structure is changed
* It means some symbol is added, removed or moved on their symbol hierarchy

### Symbol(Model) Property Change


## License
Copyright (c) 2014 Hatio, Lab. Licensed under the MIT license.
