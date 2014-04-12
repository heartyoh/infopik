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

    afterEach(function() {
      // app.dispose();
    });

    it('should ...', function () {

      app.setModel(infographic);

      // infographic.forEach(function(child) {
      //   var view = app.getAttachedViews(child)[0];
      // });

      // var last = app.getView().find('#noid-12');
      // last.moveToTop();

      // infographic.forEach(function(child) {
      //   var view = app.getAttachedViews(child)[0];
      // });

      // app.setModel(null);
      app.setModel(app.createComponent(sample_01))      

      // app.setEditMode('MOVE');

      // app.showMinimap();

      // app.setScale(2)
    });

  });

});

