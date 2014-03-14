"use strict";

define([
  'build/ApplicationContext',
  'build/spec/SpecPresenter',
  'build/spec/SpecGroup',
  'build/spec/SpecRect'
], function (
  ApplicationContext,
  SpecPresenter,
  SpecGroup,
  SpecRect
) {

  describe('Presenter', function () {

    var html_container;

    beforeEach(function() {

      if(!html_container) {
        html_container = document.createElement('div');
        html_container.setAttribute('id', 'presenter_spec');
        document.body.appendChild(html_container);
      }

    });

    it('should ...', function () {
      var app = new ApplicationContext({
        application_spec: SpecPresenter,
        container: 'presenter_spec',
        width: 1000,
        height: 400
      });

      var group = app.createComponent({
        type: SpecGroup.type, 
        attrs: {
          x: 150,
          y: 30,
          width: 200,
          height: 100
        }
      });

      var rect1 = app.createComponent({
        type: SpecRect.type, 
        attrs: {
          x: 10,
          y: 10,
          fill: 'red',
          stroke: 'darkgray',
          width: 100,
          height: 50,
          draggable: true
        }
      });

      var rect2 = app.createComponent({
        type: SpecRect.type, 
        attrs: {
          x: 110,
          y: 110,
          width: 100,
          height: 50,
          draggable: true
        }
      });

      group.add(rect1);
      group.add(rect2);

      app.setModel(group);
    });

  });

});

