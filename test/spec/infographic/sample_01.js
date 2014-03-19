"use strict"

define([
], function(
) {

  return {
    type: 'infographic',
    component_specs: {
      'group': '*',
      'rectangle' : '*',
      'ring' : '*',
      'ruler' : '*',
      'image' : '*',
      'text' : '*'
    },
    attrs: {
      width: 1000,
      height: 1000
    },
    components: [{
      type: 'group',
      attrs: {
        x: 0,
        y: 0,
        width: 300,
        height: 300
      },
      components: [{
        type: 'rectangle',
        attrs: {
          x: 10,
          y: 10,
          fill: 'red',
          stroke: 'darkgray',
          width: 100,
          height: 50,
          draggable: true
        }
      }, {
        type: 'rectangle',
        attrs: {
          x: 190,
          y: 10,
          width: 100,
          height: 50,
          draggable: true
        }
      }, {
        type: 'ring',
        attrs: {
          x: 150,
          y: 150,
          fill: 'violet',
          draggable: true
        }
      }, {
        type: 'ruler',
        attrs: {
          x: 310,
          y: 10,
          width: 200,
          height: 40,
          draggable: true,
          direction: 'horizontal',
          zeropos: 180,
          fill: 'black',
          margin: [15, 0]
        }
      }, {
        type: 'ruler',
        attrs: {
          x: 310,
          y: 150,
          width: 30,
          height: 150,
          draggable: true,
          direction: 'vertical',
          zeropos: 15,
          fill: 'white',
          margin: [15, 0]
        }
      }]
    }, {
      type: 'rectangle',
      attrs: {
        x: 10,
        y: 10,
        width: 100,
        stroke: 'cyan',
        height: 50,
        opacity: 0.1,
        draggable: true
      }
    }, {
      type: 'star',
      attrs: {
        x: 430,
        y: 180,
        draggable: true
      }
    }, {
      type: 'image',
      attrs: {
        x: 10,
        y: 240,
        width: 100,
        height: 50,
        url: 'http://www.baidu.com/img/bdlogo.gif'
      }
    }, {
      type: 'text',
      attrs: {
        x: 310,
        y: 60,
        text: 'Sample Text 都'
      }
    }, {
      type: 'barcode',
      attrs: {
        x: 310,
        y: 200,
        symbol: "code39",
        text: "1234567890",
        alttext: "8741493123493123",
        scale_h: 1,
        scale_w: 2,
        rotation: "N",
        includetext: true,
        includecheckintext: true,
        includecheck: true,
        parsefnc: true,
        segments: 4,
        showborder: true,
        version: "iata",
        barcolor: "#FF0000",
        rows: 45,
        columns: 15,
        height: 111,
        backgroundcolor: "DD000011",
        format: "full",
        ccversion: "b",
        cccolumns: 7,
        numeric: true,
        guardwhitespace: true,
        width: 434,
        draggable: true
      }
    }],
    links: []
  };
});