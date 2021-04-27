import React from 'react';
import {Text, View , StyleSheet, ScrollView, Image, Button} from 'react-native';
import { connect } from 'react-redux'
import Colors from '../../Constants/Colors';
import * as cartAction from '../../store/actions/cartAction';
const ProductDetailScreen = props =>{
    const productId = props.route.params.productId;
    console.log(productId)
    const selectedProduct= props.availableProducts.find(item => item.id === productId);
    console.log(selectedProduct)
    
    return (
        <ScrollView >
            <Image style={styles.image} source={{uri: selectedProduct.imageUrl}} />
            <View style={styles.actions}>
                <Button color={Colors.Primary} title="Add To Cart" onPress={()=>
                { this.props.dispatch(cartAction.addToCart(selectedProduct))}}/>
            </View>
            <Text style={styles.price} >${selectedProduct.price}</Text>
            <Text style={styles.description} >{selectedProduct.description}</Text>   
        </ScrollView>
    );
};


export const screenOptions ={
    headerTitle:'Product Detail'
};
const styles= StyleSheet.create({
    image : {
        width:'100%',
        height: 300
    },
    price:{
        fontSize:20,
        color:"#888",
        textAlign: 'center',
        marginVertical:20,

    },
    description:{
        fontSize:14,
        textAlign: 'center',
        marginHorizontal: 20,
        
    },
    actions:{
        marginVertical:10,
        alignItems:'center'
    }
});

const mapStateToProps = state => {
    return {
    availableProducts: state.products.availableProducts
    }
  } 

export default connect(mapStateToProps)(ProductDetailScreen);