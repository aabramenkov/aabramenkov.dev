// let expect = require('chai').expect;
const sinon = require('sinon');

import { NgZone, ChangeDetectorRef } from '@angular/core';
import { TimeAgoPipe } from './timeAgo.pipe';
import { TestBed } from '@angular/core/testing';

class NgZoneMock {
  runOutsideAngular(fn: () => void) {
    return fn();
  }
  run(fn: () => void) {
    return fn();
  }
}

describe('time-ago-pipe', () => {
  const now: Date = new Date();
  let clock: any;
  const oneSec = 1000;
  const oneMin = oneSec * 60;
  const oneHour = oneMin * 60;
  const oneDay = oneHour * 24;
  const oneMonth = oneDay * 30.416; // approximation 365/12
  let changeDetectorRef: ChangeDetectorRef;
  let pipe: TimeAgoPipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: ChangeDetectorRef, useValue: { markForCheck: () => {} } },
      ],
    });
    clock = sinon.useFakeTimers(now.getTime());
    changeDetectorRef = TestBed.inject(ChangeDetectorRef);
    pipe = new TimeAgoPipe(changeDetectorRef, new NgZoneMock() as NgZone);
  });

  afterEach(() => {
    clock.restore();
  });

  describe('output tests', () => {
    it('a few seconds ago', () => {
      const pastDate = new Date();
      for (let i = 0; i < 45; i++) {
        clock.tick(oneSec);
        if (i < 44) {
          expect(pipe.transform(pastDate.toString())).toEqual(
            'a few seconds ago'
          );
        }
      }
    });

    it('a minute ago', () => {
      const pastDate = new Date();
      clock.tick(oneSec * 45);
      for (let i = 45; i < 89; i++) {
        clock.tick(oneSec);
        if (i < 89) {
          expect(pipe.transform(pastDate.toString())).toEqual('a minute ago');
        } else {
          expect(pipe.transform(pastDate.toString())).not.toEqual(
            'a minute ago'
          );
        }
      }
    });

    it('x minutes ago', () => {
      const pastDate = new Date();
      clock.tick(oneSec * 50);
      for (let i = 1; i < 44; i++) {
        clock.tick(oneMin);
        if (i < 44) {
          expect(pipe.transform(pastDate.toString())).toEqual(
            i + 1 + ' minutes ago'
          );
        } else {
          expect(pipe.transform(pastDate.toString())).not.toEqual(
            i + 1 + ' minutes ago'
          );
        }
      }
    });

    it('an hour ago', () => {
      const pastDate = new Date();
      // set the time forward 45 mins
      clock.tick(oneMin * 45);
      for (let i = 45; i < 120; i++) {
        clock.tick(oneMin);
        if (i < 90) {
          expect(pipe.transform(pastDate.toString())).toEqual('an hour ago');
        } else {
          expect(pipe.transform(pastDate.toString())).not.toEqual(
            'an hour ago'
          );
        }
      }
    });
    it('x hours ago', () => {
      const pastDate = new Date();
      // set the time forward 50 mins
      clock.tick(oneMin * 50);
      for (let i = 1; i < 25; i++) {
        clock.tick(oneHour);
        if (i < 22) {
          expect(pipe.transform(pastDate.toString())).toEqual(
            i + 1 + ' hours ago'
          );
        } else {
          expect(pipe.transform(pastDate.toString())).not.toEqual(
            i + 1 + ' hours ago'
          );
        }
      }
    });
    it('a day ago', () => {
      const pastDate = new Date();
      clock.tick(oneHour * 22);
      for (let i = 22; i < 40; i++) {
        clock.tick(oneHour);
        if (i < 36) {
          expect(pipe.transform(pastDate.toString())).toEqual('a day ago');
        } else {
          expect(pipe.transform(pastDate.toString())).not.toEqual('a day ago');
        }
      }
    });
    it('x days ago', () => {
      const pastDate = new Date();
      clock.tick(oneHour * 35);
      for (let i = 1; i < 30; i++) {
        clock.tick(oneDay);
        if (i < 25) {
          expect(pipe.transform(pastDate.toString())).toEqual(
            i + 1 + ' days ago'
          );
        } else {
          expect(pipe.transform(pastDate.toString())).not.toEqual(
            i + 1 + ' days ago'
          );
        }
      }
    });
    it('a month ago', () => {
      const pastDate = new Date();
      clock.tick(oneDay * 25);
      for (let i = 25; i < 50; i++) {
        clock.tick(oneDay);
        if (i < 45) {
          expect(pipe.transform(pastDate.toString())).toEqual('a month ago');
        } else {
          expect(pipe.transform(pastDate.toString())).not.toEqual(
            'a month ago'
          );
        }
      }
    });
    it('x month ago', () => {
      const pastDate = new Date();
      clock.tick(oneDay * 43);
      for (let i = 1; i < 13; i++) {
        clock.tick(oneMonth);
        if (i < 10) {
          expect(pipe.transform(pastDate.toString())).toEqual(
            i + 1 + ' months ago'
          );
        } else {
          expect(pipe.transform(pastDate.toString())).not.toEqual(
            i + 1 + ' months ago'
          );
        }
      }
    });
    it('a year ago', () => {
      const pastDate = new Date();
      clock.tick(oneDay * 345);
      for (let i = 345; i < 545; i++) {
        clock.tick(oneDay);
        if (i < 545) {
          expect(pipe.transform(pastDate.toString())).toEqual('a year ago');
        } else {
          expect(pipe.transform(pastDate.toString())).not.toEqual('a year ago');
        }
      }
    });
    it('a year ago', () => {
      const pastDate = new Date();
      clock.tick(oneMonth * 22);
      expect(pipe.transform(pastDate.toString())).toEqual(2 + ' years ago');
      clock.tick(oneMonth * 12);
      expect(pipe.transform(pastDate.toString())).toEqual(3 + ' years ago');
      clock.tick(oneMonth * 36);
      expect(pipe.transform(pastDate.toString())).toEqual(6 + ' years ago');
    });
  });
});
