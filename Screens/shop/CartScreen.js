import React , {useState} from 'react';
import {FlatList, StyleSheet, View, Text, Button, ActivityIndicator} from 'react-native';
import Colors  from '../../Constants/Colors';
import {connect} from 'react-redux';
import CartItem from '../../Components/shop/CartItem';
import {removeFromCart} from '../../store/actions/cartAction';
import * as orderAction from '../../store/actions/orderAction';
import Card from '../../Components/UI/Card';

const CartScreen = props =>{
    const [isLoadig, setIsLoadig] = useState(false);
    const sendOrderHandler = async () =>{
        setIsLoadig(true);
        await props.dispatch(orderAction.addOrder(props.cartItems,props.cartTotalAmount))
        setIsLoadig(false);
    };



    return (
        <View style={styles.screen}>
            <Card style={styles.summary}>
                <Text style={styles.summaryText}>TOTAL : <Text style={styles.amount}>
                    {Math.round(props.cartTotalAmount.toFixed(2)) *100 /100}</Text> </Text>
                {isLoadig ? <ActivityIndicator size='small' color={Colors.Primary} /> :
                <Button 
                    color={Colors.Accent}
                    title="Order Now" 
                    disabled={props.cartItems.length ===0}
                    onPress={sendOrderHandler}
                    />
    }
            </Card>
            <FlatList 
            data={props.cartItems}
            keyExtractor={(item => item.productId)}
            renderItem={itemData => <CartItem 
            deletable={true}
            quantity={itemData.item.quantity}
            title={itemData.item.productTitle}
            amount={itemData.item.sum}
            onRemove={()=>{
                props.dispatch(removeFromCart(itemData.item.productId))
            }}/>}/>
        </View>
    );
};
export const screenOptions={
    headerTitle: 'Your Cart'
}


const styles= StyleSheet.create({
    screen :{
        margin : 20,
    },
    summary:{
        flexDirection:'row',
        alignItems: 'center',
        justifyContent:'space-between',
        marginBottom:10,
        padding:10,
       
    },
    summaryText:{
        fontWeight:'bold',
        fontSize: 18,

    },
    amount:{
        color: Colors.Primary
    }
});

const mapStateToProps = state =>{
    const transformedCartItems = [];
    for(const key in state.cart.items){
        transformedCartItems.push({
            productId: key,
            productTitle: state.cart.items[key].productTitle,
            productPrice: state.cart.items[key].productPrice,
            quantity: state.cart.items[key].quantity,
            sum : state.cart.items[key].sum
        })
    }
    return {
        cartTotalAmount: state.cart.totalAmount,
        cartItems : transformedCartItems.sort((a,b) => a.productId > b.productId ? 1 : -1)
        
    }
}
export default connect(mapStateToProps)(CartScreen);