'use strict';

const should = require('should');
const async = require('async');

const t = require('./../index');
const Tick = t.Tick;

describe('Unit', function () {
    describe('Timer', function () {

        const timer = t.timer;

        it('should return a timer object', function () {
            const newTimer = timer('mytimer');

            newTimer.should.be.instanceOf(Object);
        });

        it('should have all needed helper functions', function () {
            const newTimer = timer('mytimer');
            const helpers = ['median', 'mean', 'duration', 'min', 'max', 'count', 'parse'];

            newTimer.should.be.an.instanceOf(Object).and.have.properties(helpers);

            helpers.forEach(function (helper) {
                newTimer[helper].should.be.type('function');
            });
        });

    });

    describe('Tick', function () {

        it('should have helper functions', function () {
            const tick = new Tick('mytick');

            tick.start.should.be.type('function');
            tick.stop.should.be.type('function');
            tick.getDiff.should.be.type('function');
        });

        it('should push a new item to the timers array', function () {
            const tick = new Tick('mytick');

            tick.start();
            tick.stop();

            t.timers.mytick.should.be.instanceOf(Object);
        });

        it('should wrap a function and return a tick object', function () {
            const tick = Tick.wrap(function myFunction(done) {
                done();
            });

            tick.should.be.instanceOf(Tick);
        });

        it('should wrap a function and use it\'s name to add it to the timer array', function () {
            Tick.wrap(function myFunction(done) {
                done();
            });

            t.timers.myFunction.should.be.instanceOf(Object);
        });

        it('should wrap a function and measure all the calls of it.', function () {

            function myNewFunction(done) {
                done();
            }

            for (let i = 0; i < 10; i++) {
                Tick.wrap(myNewFunction);
            }

            t.timers.myNewFunction.ticks.should.have.lengthOf(10);
        });

        it('should wrap anonymous functions too', function () {
            Tick.wrap(function (done) {
                done();
            });

            t.timers.anon.should.be.instanceOf(Object);
            t.timers.anon.ticks.should.have.a.lengthOf(1);
        });

        it('should wrap functions and use a different name than function\'s name', function () {
            Tick.wrap('myOtherFunc', function (done) {
                done();
            });

            t.timers.myOtherFunc.should.be.instanceOf(Object);
            t.timers.myOtherFunc.ticks.should.have.a.lengthOf(1);

            Tick.wrap('anotherFunc', function someFuncNameThatShouldBePicked(done) {
                done();
            });

            t.timers.anotherFunc.should.be.instanceOf(Object);
            t.timers.anotherFunc.ticks.should.have.a.lengthOf(1);

            should.not.exists(t.timers.someFuncNameThatShouldBePicked);
        });

    });

});