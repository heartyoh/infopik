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
      'ruler' : '*'
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
          x: 110,
          y: 110,
          width: 100,
          height: 50,
          draggable: true
        }
      }, {
        type: 'ring',
        attrs: {
          x: 210,
          y: 210,
          fill: 'violet',
          draggable: true
        }
      }, {
        type: 'ruler',
        attrs: {
          x: 320,
          y: 20,
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
          x: 410,
          y: 110,
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
    }],
    links: []
  };
});