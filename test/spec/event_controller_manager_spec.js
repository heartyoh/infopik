"use strict";

define(['src/EventController', 'src/EventControllerManager'], function (EventController, EventControllerManager) {

  describe('EventControllerManager', function () {
    var manager;

    beforeEach(function() {
      manager = new EventControllerManager();
    });

    describe('list', function() {

      it('should contain several controllers', function() {
        var ControllerA = dou.define({
          extend: EventController
        });
        var ControllerB = dou.define({
          extend: EventController
        });

        var controllerA = new ControllerA();
        var controllerB = new ControllerB();

        manager.append(controllerA);
        manager.append(controllerB);

        manager.size().should.equal(2);
      });

    });

    describe('control', function() {

      it('should contain several controllers', function() {
        var ControllerA = dou.define({
          extend: EventController
        });
        var ControllerB = dou.define({
          extend: EventController
        });

        var controllerA = new ControllerA({
          'a' : {
            'event1' : function() {
              console.log(arguments);
            }
          }
        });
        var controllerB = new ControllerB({
          'b' : {
            'event2' : function() {
              console.log(arguments);
            }
          }
        });

        manager.append(controllerA);
        manager.append(controllerB);

        manager.size().should.equal(2);
      });

    });

  });

});

