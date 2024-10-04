import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

export type RootStackParamList = {
    ProductByAddress: { province: string };
    AllCategory: undefined;
    ProductByCategory: { categoryId: number, categoryTitle: string };
    DetailProduct:  { productId: number  };
    Login: undefined;
    Register: undefined;
};

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