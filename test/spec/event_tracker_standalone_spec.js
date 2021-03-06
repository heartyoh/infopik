"use strict";

define(['dou', 'build/EventTracker'], function (dou, EventTracker) {

  describe('EventTracker.StandAlone', function () {

    describe('on/off', function() {
      var EventSource = dou.define({
        mixins: [dou.with.event],
        members: {
          test: function(e) {
            this.trigger('dragstart', e);
            for(var i = 0;i < 10;i++) {
              this.trigger('dragmove', e);
            }
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

      it('should execute belonging event handlers on the bound events', function () {
        var startcount = 0;
        var movecount = 0;
        var endcount = 0;

        var tracker = new EventTracker.StandAlone(evsource, {
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

        tracker.dispose();
      });

      it('should bind on the specified object when handlers call-backed', function () {
        var self = {
          a: 'a'
        };

        var tracker = new EventTracker.StandAlone(evsource, {
          dragstart: function(e) {
            this.a = 'A';
          }
        }, self);

        tracker.on();
        evsource.test();

        self.a.should.equal('A');

        tracker.dispose();
      });

      it('should bind target object when handlers call-backed if bind object is not specified', function () {
        var calc = 1;

        var tracker = new EventTracker.StandAlone(evsource, {
          dragstart: function(e) {
            calc = this.twice(calc);
          }
        });

        tracker.on();
        evsource.test();

        calc.should.equal(2);

        tracker.dispose();
      });

    });

  });

});

