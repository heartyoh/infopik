"use strict";

define([
  'test/spec/application_context/spec_application',
  'build/ApplicationContext',
  'build/spec/SpecGroup',
  'build/spec/SpecRect'
], function (
  SpecSampleApp,
  ApplicationContext,
  SpecGroup,
  SpecRect
) {

  describe('ApplicationContext', function () {

    var html_container;

    beforeEach(function() {

      if(!html_container) {
        html_container = document.createElement('div');
        html_container.setAttribute('id', 'application_spec');
        document.body.appendChild(html_container);
      }

    });

    it('should ...', function () {
      var app = new ApplicationContext({
        application_spec: SpecSampleApp,
        container: 'application_spec',
        width: 600,
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
          height: 50
        }
      });

      var rect2 = app.createComponent({
        type: SpecRect.type, 
        attrs: {
          x: 110,
          y: 110,
          width: 100,
          height: 50
        }
      });

      group.add(rect1);
      group.add(rect2);

      app.setModel(group);
    });

  });

});

