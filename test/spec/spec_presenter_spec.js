"use strict";

define([
  'src/ApplicationContext',
  'src/SpecPresenter',
  'src/SpecGroup',
  'src/SpecRect'
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
        html_container: 'presenter_spec'
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
        height: 50,
        draggable: true
      });

      var rect2 = app.createComponent(SpecRect.type, {
        x: 110,
        y: 110,
        width: 100,
        height: 50,
        draggable: true
      });

      group.add(rect1);
      group.add(rect2);

      app.setModel(group);
    });

  });

});

