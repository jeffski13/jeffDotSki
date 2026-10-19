/// <reference types="vitest/globals" />
import { dragShift, dropIndex } from './useDragReorder';

describe('dropIndex', () => {
  const centers = [20, 60, 100, 140];

  it('stays put until the dragged row passes a neighbour\'s center', () => {
    expect(dropIndex(centers, 1, 60)).toBe(1);
    expect(dropIndex(centers, 1, 99)).toBe(1);
    expect(dropIndex(centers, 1, 21)).toBe(1);
  });

  it('moves down or up past the rows it crosses', () => {
    expect(dropIndex(centers, 1, 101)).toBe(2);
    expect(dropIndex(centers, 1, 500)).toBe(3);
    expect(dropIndex(centers, 2, 19)).toBe(0);
    expect(dropIndex(centers, 2, -500)).toBe(0);
  });
});

describe('dragShift', () => {
  it('slides rows between the start and target up when dragging down', () => {
    expect([0, 1, 2, 3].map((i) => dragShift(i, 0, 2, 40))).toEqual([0, -40, -40, 0]);
  });

  it('slides rows between the target and start down when dragging up', () => {
    expect([0, 1, 2, 3].map((i) => dragShift(i, 3, 1, 40))).toEqual([0, 40, 40, 0]);
  });

  it('leaves everything alone while the row is over its own spot', () => {
    expect([0, 1, 2].map((i) => dragShift(i, 1, 1, 40))).toEqual([0, 0, 0]);
  });
});
