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
          draggable: true
        }
      }, {
        type: 'ruler',
        attrs: {
          x: 310,
          y: 110,
          width: 500,
          height: 20,
          draggable: true,
          direction: 'horizontal',
          zeropos: 100,
          margin: [15, 0]
        }
      }, {
        type: 'ruler',
        attrs: {
          x: 310,
          y: 110,
          width: 20,
          height: 500,
          draggable: true,
          direction: 'vertical',
          zeropos: 100,
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