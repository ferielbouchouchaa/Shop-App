import React , {useEffect, useState, useCallback} from 'react';
import {FlatList, StyleSheet, Platform, Button, View, ActivityIndicator, Text} from 'react-native';
import { connect } from 'react-redux'
import ProductItem from '../../Components/shop/ProductItem';
import * as cartAction from '../../store/actions/cartAction';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Colors from '../../Constants/Colors';
import * as productsActions from '../../store/actions/productsAction';
const ProductOverviewScreen = props =>{
  const [isRefreshing,setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false)
  const [error,setError] = useState();

  const loadProducts = useCallback(async() => {
    setError(null);
    setIsRefreshing(true);
    
    try{
    await props.dispatch(productsActions.fetchProducts());
    }catch (err){
      setError(err.message);
    }
    setIsRefreshing(false);
    
  }, [props.dispatch, setIsLoading, setError]);


  useEffect(() =>{
    const unsubscribe= props.navigation.addListener('focus', loadProducts);
    return () =>{
      unsubscribe();
    }
  },[loadProducts]);

  useEffect(() => {
    setIsLoading(true);
    loadProducts().then(() =>{
      setIsLoading(false);
    });
  }, [props.dispatch, loadProducts])

  const selectItemHandler =(id, title) =>{

    props.navigation.navigate("ProductDetail",
    {productId : id, productTitle: title} );
  }

  if(error){
    return <View style={styles.centred}>
      <Text>An error occured !</Text>
      <Button title="Try Again" onPress={loadProducts} color={Colors.Primary}/>
    </View>
  }
  if (isLoading){
    return <View style={styles.centred}>
      <ActivityIndicator size='large' color={Colors.Primary}/>
    </View>
  }

  if(! isLoading && props.availableProducts.length === 0){
    return <View style={styles.centred}>
      <Text>No products found. Maybe start adding some !</Text>
    </View>
  }
    return (
      <View>
        <FlatList 
            onRefresh={loadProducts}
            refreshing={isRefreshing}
            data={props.availableProducts}
            keyExtractor={item =>item.id}
            renderItem={itemData => 
            <ProductItem 
            image={itemData.item.imageUrl}
            title={itemData.item.title}
            price = {itemData.item.price}
            onSelect={()=>{selectItemHandler(itemData.item.id,itemData.item.title);}}
            >
              <Button
                color={Colors.primary}
                title="View Details"
                onPress={() =>{selectItemHandler(itemData.item.id,itemData.item.title);}}
           />
            <Button
                color={Colors.primary}
                title="To Cart"
                onPress={()=>{props.dispatch(cartAction.addToCart(itemData.item))}}
            />  
            </ProductItem>
               }
            />

            
      </View>
    );
            }
export const screenOptions = navData => {
    return {
      headerTitle: 'All Products',
      headerRight: () =>(
        <Ionicons name='md-cart' 
        color={Platform.OS === 'android' ? 'white' : Colors.primary} 
        size={23} style={{paddingRight:15}} 
        onPress={()=>{ navData.navigation.navigate('Cart')}}/>
      ),
      headerLeft : () => (
        <Ionicons name='md-menu' 
        color={Platform.OS === 'android' ? 'white' : Colors.primary} 
        size={23} style={{paddingLeft:15}} 
        onPress={()=>{ navData.navigation.toggleDrawer();}}/>
      )
    };
  };
const styles= StyleSheet.create({
  centred :{
    flex:1, 
    justifyContent: 'center' , 
    alignItems : 'center'
  }
});

const mapStateToProps = state => {
    return {
    availableProducts: state.products.availableProducts
    }
  }
export default connect(mapStateToProps)(ProductOverviewScreen);