export class Trip {
  id?: number;
  cost: {
    currency: string;
    value: number;
  };
  start:{
    address: {
        street: string,
        location: {
          lat: number,
          lon: number
        }
      }
  }
  passenger: number;
  driver: number;
  end:{
    address: {
        street: string,
        location: {
          lat: number,
          lon: number
        }
      }
  };
}
