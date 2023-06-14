export type Connection = {
  id: string;
  departureTime: string;
  arrivalTime: string;
  departureStation: string;
  arrivalStation: string;
  price: number;
};

export type PassengerSimplyfied2 = {
  name: string,
  discount: string,
  seat: string,
  status: string
};