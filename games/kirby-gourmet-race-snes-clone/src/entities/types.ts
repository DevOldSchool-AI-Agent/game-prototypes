export type Mode = 'start' | 'play' | 'win' | 'lose';

export type Point = {
  x: number;
  y: number;
};

export type Pickup = Point & {
  id: string;
  active: boolean;
  sprite: any;
};
