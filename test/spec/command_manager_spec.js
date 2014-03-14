"use strict";

define(['dou', 'build/Command', 'build/CommandManager'], function (dou, Command, CommandManager) {

  describe('CommandManager', function () {
    var cm;

    var count = 0;
    
    var SampleCommand = dou.define({
      extend: Command,
      members: {
        execute: function() {
          count++;
        },
        unexecute: function() {
          count--;
        }
      }
    });

    beforeEach(function() {
      cm = new CommandManager();
      count = 0;
    });

    describe('execute', function() {

      it('should execute command through CommandManager', function () {
        cm.execute(new SampleCommand());

        count.should.equal(1);
      });
    });

    describe('undo', function() {

      it('should execute reverse actions of the queued command', function () {
        cm.execute(new SampleCommand());

        cm.undo();
        count.should.equal(0);
      });


    });

    describe('redo', function() {

      it('should execute actions of the undoed command', function () {
        cm.execute(new SampleCommand());

        cm.undo();
        count.should.equal(0);

        cm.redo();
        count.should.equal(1);
      });
    });

    describe('reset', function() {

      it('should make undoable to false', function () {
        cm.execute(new SampleCommand());

        cm.undo();
        count.should.equal(0);

        cm.redo();
        cm.undoable().should.equal(true);

        cm.reset();
        cm.undoable().should.equal(false);
      });

      it('should make redoable to false', function () {
        cm.execute(new SampleCommand());

        cm.undo();
        count.should.equal(0);

        cm.redoable().should.equal(true);
        
        cm.reset();
        cm.redoable().should.equal(false);
      });

    });

  });

});

