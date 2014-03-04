(function() {
  define(['infopik', 'kinetic'], function(infopik, kinetic) {
    var Polygon, withs;
    withs = ['advice', 'emitter', 'draw', 'node', 'container', 'propertyholder', 'serialize', 'eventdeligate'];
    Polygon = (function() {
      function Polygon(property) {
        this.on('click', function(e) {});
        this.after('connect', function(e) {
          return this.fire('newevent', {
            target: e.target,
            source: e.source,
            sample: e.sample
          });
        });
        this.set(property, {
          x: 0,
          y: 0,
          height: 100,
          width: 100,
          background: 'blue',
          foreground: 'red'
        });
      }

      Polygon.prototype.draw = function(ctx) {
        return kinetic.drawPolygon(ctx);
      };

      return Polygon;

    })();
    return infopik.component(withs, Polygon);
  });

}).call(this);
