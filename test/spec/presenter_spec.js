"use strict";

define(['src/Presenter'], function (Presenter) {

  describe('Presenter', function () {

    describe('core mixins', function() {

      it('should have functions supported by dou core mixins', function () {
        var inst = new Presenter();

        inst.set.should.be.a('function');

        inst.serialize.should.be.a('function');

      });


    });

    describe('initialize', function() {

      it('should merge passed attributes and defaults', function() {
        var inst = new Presenter();
        inst.initialize({
        	width: 500
        });

        inst.get('edit_mode').should.equal(Presenter.EDIT_MODE.SELECT);
        inst.get('width').should.equal(500);
        inst.get('height').should.equal(800);
      });

    });

  });

});

