"use strict";

define(['dou', 'src/Component', 'src/Containable'], function (dou, Component, Containable) {

  describe('(Mixin) Containable', function () {
    var Container;

    beforeEach(function() {
        Container = dou.define({
            mixins : Containable,
            name : 'Container'
        });
    });

    describe('initialize', function() {

      it('should make components container for the mixined object', function () {
        
        var inst = new Container();

        inst.initialize({});
        
        inst.add('a');

        inst.select().length.should.equal(1);
      });
    });

    describe('add', function() {

      it('should be able to accept a component or a array of components', function () {

        var inst = new Container();

        inst.initialize({});
        inst.add('a');
        inst.add(['b', 'c', 'd']);

        inst.select().length.should.equal(4);
        inst.select()[3].should.equal('d');
      });

      it('should make container to be a event delegator for component', function () {

        var container = new Container('for_add_container');
        var component = new Component('for_add_component');

        container.initialize({});
        
        var component_added_event_occurred = 0;
        var container_add_event_occurred = 0;
        var delegated_added_event_occurred = 0;

        component.on('all', function(e) {
          switch(e) {
            case 'added' :
              component_added_event_occurred++;
          }
        });
        container.on('all', function(e) {
          switch(e) {
            case 'add' :
              container_add_event_occurred++;
              break;
            case 'added' :
              delegated_added_event_occurred++;
          }
        });

        container.add(component);

        component_added_event_occurred.should.equal(1);
        container_add_event_occurred.should.equal(1);
        delegated_added_event_occurred.should.equal(1);
      });
    });

    describe('remove', function() {

      it('should be able to accept a child or array of children', function () {

        var inst = new Container();

        inst.initialize({});

        inst.add(['a', 'b', 'c', 'd', 'e']);
        inst.remove(['b', 'c', 'd']);

        inst.select().length.should.equal(2);
        inst.select()[1].should.equal('e');
      });

      it('should remove container as a event delegator for removed component', function () {

        var container = new Container('for_remove_container');
        var component = new Component('for_remove_component');

        container.initialize({});
        
        var container_event_count = 0;
        var component_event_count = 0;
        var delegated_event_count = 0;

        component.on('all', function(e) {
          switch(e) {
            case 'added' :
              component_event_count++;
              break;
            case 'removed' :
              component_event_count--;
              break;
          }
        });
        container.on('all', function(e) {
          switch(e) {
            case 'add' :
              container_event_count++;
              break;
            case 'remove' :
              container_event_count--;
              break;
            case 'added' :
              delegated_event_count++;
              break;
            case 'removed' :
              delegated_event_count--;
          }
        });

        container.add(component);

        component_event_count.should.equal(1);
        container_event_count.should.equal(1);
        delegated_event_count.should.equal(1);

        container.remove(component);

        component_event_count.should.equal(0);
        container_event_count.should.equal(0);
        delegated_event_count.should.equal(0);

        /* check container to be removed as a event delegator for the removed component */
        component.trigger('added', {});

        component_event_count.should.equal(1);
        container_event_count.should.equal(0);
        delegated_event_count.should.equal(0);

        component.trigger('removed', {});

        component_event_count.should.equal(0);
        container_event_count.should.equal(0);
        delegated_event_count.should.equal(0);
      });
    });

  });

});

