"use strict";

define([
  'build/infopik',
  'build/spec/SpecPainter',
  'test/spec/infographic/sample_01'
], function (
  infopik,
  SpecPainter,
  sample_01
) {

  describe('Painter', function () {

    var html_container;
    var app;
    var infographic;

    beforeEach(function() {

      if(!html_container) {
        html_container = document.createElement('div');
        html_container.setAttribute('id', 'painter_spec');
        document.body.appendChild(html_container);
      }

      app = infopik.app({
        application_spec: SpecPainter,
        container: 'painter_spec',
        width: 1200,
        height: 400
      });

      infographic = app.createComponent(sample_01);
    });

    it('should ...', function () {

      app.setModel(infographic);

      infographic.forEach(function(child) {
        var view = app.getAttachedViews(child)[0];
        console.log(view.getZIndex(), view.getAttr('id'));
      });

      var last = app.getView().find('#noid-12');
      // last.moveToTop();
      last.setZIndex(100);

      infographic.forEach(function(child) {
        var view = app.getAttachedViews(child)[0];
        console.log(view.getZIndex(), view.getAttr('id'));
      });
    });

  });

});

