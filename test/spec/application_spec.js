"use strict";

define([
  'src/Application',
  'test/spec/application/spec_application',
  'src/SpecGroup',
  'src/SpecRect'
], function (
  Application,
  SpecSampleApp,
  SpecGroup,
  SpecRect
) {

  describe('Application', function () {

    var html_container;

    beforeEach(function() {

      if(!html_container) {
        html_container = document.createElement('div');
        html_container.setAttribute('id', 'application_spec');
        document.body.appendChild(html_container);
      }

    });

    it('should ...', function () {
      var app = new Application({
        application_spec: SpecSampleApp,
        html_container: 'application_spec'
      });

      var group = app.createComponent(SpecGroup.type, {
        x: 150,
        y: 30,
        width: 200,
        height: 100
      });

      var rect1 = app.createComponent(SpecRect.type, {
        x: 10,
        y: 10,
        fill: 'red',
        stroke: 'darkgray',
        width: 100,
        height: 50
      });

      var rect2 = app.createComponent(SpecRect.type, {
        x: 110,
        y: 110,
        width: 100,
        height: 50
      });

      group.add(rect1);
      group.add(rect2);

      app.setModel(group);
    });

  });

});

