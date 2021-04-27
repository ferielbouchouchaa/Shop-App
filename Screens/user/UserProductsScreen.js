import React from 'react';
import {FlatList, StyleSheet, Text, Platform, View, Button, Alert} from 'react-native';
import { connect } from 'react-redux'
import Ionicons from 'react-native-vector-icons/Ionicons';
import ProductItem from '../../Components/shop/ProductItem';
import Colors from '../../Constants/Colors';
import * as  productsAction from '../../store/actions/productsAction';
const UserProductsScreen = props =>{

    const deleteHandler =(id)=>{
        Alert.alert('Are you sure ?', 'Do you really sure to delete this item ?', [
            {text : 'No', style: 'default'},
            {text : 'Yes' , style:'destructive' ,onPress:()=>{
                props.dispatch(productsAction.deleteProduct(id))
            }  }

        ])
    }

    const editProductHandler = (id)=>{
        props.navigation.navigate("EditProduct", {productId:id})
    }

    if (props.products.length ===0){
        return <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
            <Text> No Products found, maybe start creating some ?</Text>
        </View>

    }
    return (
        <FlatList 
            data={props.products}
            keyExtractor={item => item.id}
            renderItem={itemData => (
                <ProductItem 
                    image={itemData.item.imageUrl}
                    title={itemData.item.title}
                    price={itemData.item.price}
                    onSelect ={()=>{ editProductHandler(itemData.item.id)}}>
                    
                    <Button
                        color={Colors.primary}
                        title="Edit"
                        onPress={() =>{ editProductHandler(itemData.item.id)}}
                />
                    <Button
                        color={Colors.primary}
                        title="Delete"
                        onPress={deleteHandler.bind(this, itemData.item.id)}
                    />  

                </ProductItem>
            )}/>

    );

  };
const styles= StyleSheet.create({

});

const mapStateToProps = state=>{
    return {
        products: state.products.userProducts
    };
}

export const screenOptions= navData => {
    return {
    headerTitle: 'Your Products',
    headerLeft : () => (
        <Ionicons name='md-menu' 
        color={Platform.OS === 'android' ? 'white' : Colors.primary} 
        size={23} style={{paddingLeft:15}} 
        onPress={()=>{ navData.navigation.toggleDrawer();}}/>
    ),
    headerRight: ()=>(
        <Ionicons name='md-create' 
        color={Platform.OS === 'android' ? 'white' : Colors.primary} 
        size={23} style={{paddingRight:15}} 
        onPress={()=>{ navData.navigation.navigate("EditProduct");}}/>
    )
}
}
  
export default connect(mapStateToProps)(UserProductsScreen);