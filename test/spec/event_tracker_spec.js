"use strict";

define(['dou', 'src/EventTracker'], function (dou, EventTracker) {

  describe('EventTracker', function () {

    describe('core mixins', function() {
      var EventSource = dou.define({
        mixins: [dou.with.event],
        members: {
          test: function(e) {
            this.trigger('dragstart', e);
            for(var i = 0;i < 10;i++)
              this.trigger('dragmove', e);
            this.trigger('dragend', e);
          },
          twice: function(num) {
            return num * 2;
          }
        }
      });

      var evsource;

      beforeEach(function() {
        evsource = new EventSource();
      });

      it('should have functions supported by dou core mixins', function () {
        var startcount = 0;
        var movecount = 0;
        var endcount = 0;

        var tracker = new EventTracker(evsource, {
          dragstart: function(e) {
            startcount++;
          },
          dragmove: function(e) {
            movecount++;
          },
          dragend: function(e) {
            endcount++;
          }
        });

        tracker.on();
        evsource.test();

        startcount.should.equal(1);
        movecount.should.equal(10);
        endcount.should.equal(1);

        tracker.off();

        tracker.on();
        evsource.test();

        startcount.should.equal(2);
        movecount.should.equal(20);
        endcount.should.equal(2);
      });

      it('should bind handlers.self object if handlers has self', function () {
        var self = {
          a: 'a'
        };

        var tracker = new EventTracker(evsource, {
          dragstart: function(e) {
            this.a = 'A';
          }
        }, self);

        tracker.on();
        evsource.test();

        self.a.should.equal('A');
      });

      it('should bind target object if handlers doesn\'t have self', function () {
        var calc = 1;

        var tracker = new EventTracker(evsource, {
          dragstart: function(e) {
            calc = this.twice(calc);
          }
        });

        tracker.on();
        evsource.test();

        calc.should.equal(2);
      });

    });

  });

});

