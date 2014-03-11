"use strict";

define([
  'src/infopik',
  'src/SpecPainter',
  'src/SpecGroup',
  'src/SpecRect',
  // 'src/ModelFactory',
  'test/spec/infographic/sample_01'
], function (
  infopik,
  SpecPainter,
  SpecGroup,
  SpecRect,
  // ModelFactory,
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
        width: 1000,
        height: 400
      });

      infographic = app.createComponent(sample_01);
    });

    it('should ...', function () {

      app.setModel(infographic);
    });

  });

});

