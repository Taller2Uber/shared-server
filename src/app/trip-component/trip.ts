export class Trip {
  id?: number;
  cost: {
    currency: string;
    value: number;
  };
  passenger: number;
  driver: number;
  start: JSON;
  end: JSON;
}
