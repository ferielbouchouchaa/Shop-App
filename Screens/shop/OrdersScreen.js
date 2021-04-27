import React , {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {FlatList, StyleSheet, View,Text, ActivityIndicator} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import OrderItem from '../../Components/shop/OrderItem';
import * as orderAction from '../../store/actions/orderAction';
import Colors from '../../Constants/Colors';
const OrdersScreen = props =>{
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        setIsLoading(true);
        props.dispatch(orderAction.fetchOrders()).then(()=>{
            setIsLoading(false);
        });
    }, [props.dispatch]);

    if(isLoading){
        return <View style={styles.centred}>
            <ActivityIndicator  size='large' color={Colors.Primary} />
        </View>
    }

    if (props.Orders.length ===0){
        return <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
            <Text> No Orders found, maybe start ordering some products ?</Text>
        </View>

    }
    return (
        <FlatList 
            data={props.Orders}
            keyExtractor={item => item.id}
            renderItem={itemData=> 
            <OrderItem 
                amount={itemData.item.totalAmount}
                date={itemData.item.readableDate}
                items={itemData.item.items}/>}
            />
    );
};

const styles= StyleSheet.create({
    centred :{
        flex:1,
        justifyContent: 'center',
        alignItems: 'center'

    }
});


export const screenOptions= navData =>{
    return{
    headerTitle: 'Your Orders',
    headerLeft : () => (
        <Ionicons name='md-menu' 
        color={Platform.OS === 'android' ? 'white' : Colors.primary} 
        size={23} style={{paddingLeft:15}} 
        onPress={() => {
            navData.navigation.toggleDrawer();
          }}/>
      )
}
}


const mapStateToProps = state =>{
    return {
        Orders : state.orders.orders
    }
}
export default connect(mapStateToProps)(OrdersScreen);