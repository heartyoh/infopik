"use strict";

define([
  'build/infopik',
  'build/spec/SpecPainter'
], function (
  infopik,
  SpecPainter
) {

  describe('ApplicationContext', function () {

    var html_container;
    var app;
    var infographic;

    beforeEach(function() {

      if(!html_container) {
        html_container = document.createElement('div');
        html_container.setAttribute('id', 'application_size_spec');
        document.body.appendChild(html_container);
      }

      app = infopik.app({
        application_spec: SpecPainter,
        container: 'application_size_spec',
        width: 100,
        height: 100
      });
    });

    it('should ...', function (done) {
      var stage = app.getView();

      var count = 0;
      var width = 100;
      var height = 100;

      var timeout = function() {
        if(++count == 11) {
          done();
          return;
        }
        app.setSize(width, height);

        width = width + 30;
        height = height + 30;

        setTimeout(timeout, 10);
      };

      setTimeout(timeout, 10);
    });

  });

});

