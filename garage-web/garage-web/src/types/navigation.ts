// src/types/navigation.ts
export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
  CarList: undefined;
  AddCar: undefined;
  CarDetail: { carId: string };
  Payment: { carId: string };
};
