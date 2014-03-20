"use strict";

define([
  'dou',
  'build/MVCMixin'
], function (
  dou,
  MVCMixin
) {

  describe('MVCMixin', function () {
    var model;
    var view1;
    var view2;

    beforeEach(function() {
      function Model(config) {
        this.config = config;
      };

      function View(config) {
        this.config = config
      };

      model = new Model({name: 'model1'});
      view1 = new View({name: 'view1'});
      view2 = new View({name: 'view2'});

      dou.mixin(Model, MVCMixin.model);
      dou.mixin(View, MVCMixin.view);
    });

    describe('model#attachView', function() {

      it('should attach the view and set the model of the view.', function() {
        model.attachView(view1);

        model.getViews().length.should.equal(1);
        view1.getModel().should.equal(model);

        model.attachView(view2);

        model.getViews().length.should.equal(2);
        view2.getModel().should.equal(model);
      });

    });

    describe('model#detachView', function() {

      it('should detach the view and reset the model of the view.', function() {
        model.attachView(view1);

        model.getViews().length.should.equal(1);
        view1.getModel().should.equal(model);

        model.detachView(view1);

        model.getViews().length.should.equal(0);
        expect(view1.getModel()).to.be.null;
      });
    });

    describe('model#detachAll', function() {

      it('should detach all the views and reset the model of the views.', function() {
        model.attachView(view1);
        model.attachView(view2);

        model.getViews().length.should.equal(2);
        view1.getModel().should.equal(model);
        view2.getModel().should.equal(model);

        model.detachAll();

        model.getViews().length.should.equal(0);
        expect(view1.getModel()).to.be.null;
        expect(view2.getModel()).to.be.null;
      });

    });

    describe('model#getViews', function() {

      it('should return all views through copied Array.', function() {
        model.attachView(view1);
        model.attachView(view2);

        model.getViews().should.have.members([view1, view2]);
      });

    });

    describe('view#setModel', function() {

      it('should set the model of the view and attache the view into the model.', function() {
        view1.setModel(model);

        model.getViews().should.have.members([view1]);
        view1.getModel().should.equal(model);
      });

    });

  });

});

