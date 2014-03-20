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

    describe('controller#attach', function() {

      it('should attach the view to the model.', function() {
        var controller = dou.mixin({}, MVCMixin.controller);

        controller.attach(model, view1);
        controller.attach(model, view2);

        controller.getAttachedViews(model).should.have.members([view1, view2]);
      });
    });

    describe('controller#detach', function() {

      it('should detach the view from the model.', function() {
        var controller = dou.mixin({}, MVCMixin.controller);

        controller.attach(model, view1);
        controller.attach(model, view2);

        controller.getAttachedViews(model).should.have.members([view1, view2]);

        controller.detach(model, view1);

        controller.getAttachedViews(model).should.have.members([view2]);

        controller.detach(model, view2);

        controller.getAttachedViews(model).should.be.empty;
      });

    });

    describe('controller#detachAll', function() {

      it('should attach all the views from the model.', function() {
        var controller = dou.mixin({}, MVCMixin.controller);

        controller.attach(model, view1);
        controller.attach(model, view2);

        controller.getAttachedViews(model).should.have.members([view1, view2]);

        controller.detachAll(model);

        controller.getAttachedViews(model).should.be.empty;
      });

    });

    describe('controller', function() {

      it('should support views that is not mixed with MVCMixin.view.', function() {
        view1 = {name: 'view1'};
        view2 = {name: 'view2'};
        
        var controller = dou.mixin({}, MVCMixin.controller);

        controller.attach(model, view1);
        controller.attach(model, view2);

        controller.getAttachedViews(model).should.have.members([view1, view2]);

        controller.detachAll(model);

        controller.getAttachedViews(model).should.be.empty;
      });

    });

  });

});

