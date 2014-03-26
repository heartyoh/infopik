"use strict";

define(['dou', 'build/ComponentRegistry'], 
  function (dou, ComponentRegistry) {

  describe('ComponentRegistry', function () {
    var componentRegistry;

    var specs = [ {
      type: 'A',
      name: 'Component A',
      description: 'description for Component A',
      defaults: {
        attr1: '1',
        attr2: 'A',
        attr3: 100
      },
      shape_factory: dou.define({
      }),
      handle_factory: dou.define({
      }),
      toolbox_image: 'toolbox_small.png'
    }, {
      type: 'B',
      name: 'Component B',
      description: 'description for Component B',
      defaults: {
        attr1: '2',
        attr2: 'B',
        attr3: 200
      },
      shape_factory: dou.define({
      }),
      handle_factory: dou.define({
      }),
      toolbox_image: 'toolbox_small.png'
    } ];

    beforeEach(function() {
      componentRegistry = new ComponentRegistry();
      specs.forEach(function(spec) {
        componentRegistry.register(spec);
      });
    });

    afterEach(function() {
      componentRegistry.dispose()
    });

    describe('register', function() {

      it('should ', function () {
        componentRegistry.register({
          type: 'C',
          name: 'Component C',
          description: 'description for Component C',
          defaults: {
            attr1: '3',
            attr2: 'C',
            attr3: 300
          },
          shape_factory: dou.define({
          }),
          handle_factory: dou.define({
          }),
          toolbox_image: 'toolbox_small.png'
        });

        var specs = componentRegistry.list();

        Object.keys(specs).length.should.equal(3);

      });

    });

    describe('list', function() {

      it('should return list of registered component specs.', function () {
        var specs = componentRegistry.list();
        var inst = new ComponentRegistry();

        specs.length.should.equal(2);

      });

    });

    describe('get', function() {

      it('should get component spec by type of spec as a key', function () {
        var spec = componentRegistry.get('B');

        spec.name.should.equal('Component B');
        spec.defaults.attr2.should.equal('B');
      });

      it('should not be able to change attributes of regietered spec.', function () {
        var spec = componentRegistry.get('B');

        var origin = spec.name;

        spec.name = origin + ' Changed';
        
        var spec = componentRegistry.get('B');

        spec.name.should.equal(origin);
      });

    });
  });

});

