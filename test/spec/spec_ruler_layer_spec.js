"use strict";

define([
  'build/infopik',
  'build/spec/SpecPainter',
  'build/spec/SpecRulerLayer',
  'test/spec/infographic/sample_01'
], function (
  infopik,
  SpecPainter,
  SpecRulerLayer,
  sample_01
) {

  describe('RulerLayer', function () {

    var html_container;
    var app;
    var infographic;

    beforeEach(function() {

      if(!html_container) {
        html_container = document.createElement('div');
        html_container.setAttribute('id', 'spec_ruler_layer_spec');
        document.body.appendChild(html_container);
      }

      app = infopik.app({
        application_spec: SpecPainter,
        container: 'painter_spec',
        width: 1000,
        height: 400
      });
    });

    it('should move offset by dragging content-edit-layer background', function (done) {
      var contentEditLayer = app.findComponent('content-edit-layer')[0];
      var contentEditLayerView = app.getAttachedViews(contentEditLayer)[0];
      var background = contentEditLayerView.__background__;

      var stage = background.getStage();
      var top = stage.content.getBoundingClientRect().top;

      var originOffset = contentEditLayerView.offset();

      stage._mousedown({
          clientX: 200,
          clientY: 200 + top
      });

      setTimeout(function() {
        stage._mousemove({
            clientX: 200,
            clientY: 200 + top
        });

        stage._mousemove({
            clientX: 100,
            clientY: 100 + top
        });

        assert(background.isDragging(), 'background should be dragging');

        Kinetic.DD._endDragBefore();
        stage._mouseup({
            clientX: 100,
            clientY: 100 + top
        });
        Kinetic.DD._endDragAfter({
          dragEndNode:background,
            clientX: 100,
            clientY: 100 + top
        });

        contentEditLayerView.getOffset().x.should.equal(originOffset.x + 100);
        contentEditLayerView.getOffset().y.should.equal(originOffset.y + 100);

        contentEditLayerView.draw();

        done();
      }, 20);
    });

    it('should move offset by dragging content-edit-layer background', function (done) {
      var contentEditLayer = app.findComponent('content-edit-layer')[0];
      var contentEditLayerView = app.getAttachedViews(contentEditLayer)[0];
      var background = contentEditLayerView.__background__;

      var stage = background.getStage();
      var top = stage.content.getBoundingClientRect().top;

      var originOffset = contentEditLayerView.offset();

      stage._mousedown({
          clientX: 100,
          clientY: 100 + top
      });

      setTimeout(function() {
        stage._mousemove({
            clientX: 100,
            clientY: 100 + top
        });

        stage._mousemove({
            clientX: 200,
            clientY: 200 + top
        });

        assert(background.isDragging(), 'background should be dragging');

        Kinetic.DD._endDragBefore();
        stage._mouseup({
            clientX: 200,
            clientY: 200 + top
        });
        Kinetic.DD._endDragAfter({
          dragEndNode:background,
            clientX: 200,
            clientY: 200 + top
        });

        contentEditLayerView.getOffset().x.should.equal(originOffset.x);
        contentEditLayerView.getOffset().y.should.equal(originOffset.y);

        contentEditLayerView.draw();

        done();
      }, 20);
    });

  });

});

