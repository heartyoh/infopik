"use strict";

define(['build/Component', 'build/Container', 'build/EventController'], function (Component, Container, EventController) {

  describe('EventController', function () {
    var controller;
    var target;

    beforeEach(function() {
      target = new Container('container');
      controller = new EventController(target);
    });

    describe('start', function() {

      it('should invoke handler matching with selector-event', function() {

        var comp = new Component('sample');
        target.add(comp);

        var invoked = 0;

        controller.append({
          'sample' : {
            'event1' : function() {
              invoked++;
            }
          }
        });

        controller.start();

        comp.trigger('event1', 'Fired');

        invoked.should.be.equal(1);
      });

    });

  });

});

