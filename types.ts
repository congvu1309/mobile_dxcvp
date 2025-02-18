import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

export type RootStackParamList = {
    HomeScreen: undefined,
    ProductByAddress: { province: string };
    AllCategory: undefined;
    ProductByCategory: { categoryId: number, categoryTitle: string };
    DetailProduct: { productId: number };
    Login: undefined;
    Register: undefined;
    ProfileStackScreen: undefined;
    ChangePassword: undefined;
    InfoBook: { productId: any, startDate: string, endDate: string, numberOfDays: string, guestCount: string };
    TripScreen: undefined,
};

export type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'HomeScreen'>;
export type HomeScreenRouteProp = RouteProp<RootStackParamList, 'HomeScreen'>;

export type ProductByAddresNavigationProp = StackNavigationProp<RootStackParamList, 'ProductByAddress'>;
export type ProductByAddressRouteProp = RouteProp<RootStackParamList, 'ProductByAddress'>;

export type AllCategoryNavigationProp = StackNavigationProp<RootStackParamList, 'AllCategory'>;
export type AllCategorysRouteProp = RouteProp<RootStackParamList, 'AllCategory'>;

export type ProductByCategoryNavigationProp = StackNavigationProp<RootStackParamList, 'ProductByCategory'>;
export type ProductByCategoryRouteProp = RouteProp<RootStackParamList, 'ProductByCategory'>;

export type DetailProductNavigationProp = StackNavigationProp<RootStackParamList, 'DetailProduct'>;
export type DetailProductRouteProp = RouteProp<RootStackParamList, 'DetailProduct'>;

export type LoginNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;
export type LoginRouteProp = RouteProp<RootStackParamList, 'Login'>;

export type RegisterNavigationProp = StackNavigationProp<RootStackParamList, 'Register'>;
export type RegisterRouteProp = RouteProp<RootStackParamList, 'Register'>;

export type ProfileStackScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ProfileStackScreen'>;
export type ProfileStackScreenRouteProp = RouteProp<RootStackParamList, 'ProfileStackScreen'>;

export type ChangePasswordNavigationProp = StackNavigationProp<RootStackParamList, 'ChangePassword'>;
export type ChangePasswordRouteProp = RouteProp<RootStackParamList, 'ChangePassword'>;

export type InfoBookNavigationProp = StackNavigationProp<RootStackParamList, 'InfoBook'>;
export type InfoBookRouteProp = RouteProp<RootStackParamList, 'InfoBook'>;

export type TripScreenNavigationProp = StackNavigationProp<RootStackParamList, 'TripScreen'>;
export type TripScreenRouteProp = RouteProp<RootStackParamList, 'TripScreen'>;