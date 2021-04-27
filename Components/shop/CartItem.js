import React from 'react';
import {FlatList, StyleSheet, View, Text, Button, TouchableOpacity,Platform} from 'react-native';
import Colors  from '../../Constants/Colors';
import Ionicons from 'react-native-vector-icons/Ionicons';

const CartItem = props =>{
    return (
        <View style={styles.carItem}>
            <View style={styles.itemData}>
                <Text style={styles.quantity}>{props.quantity}   </Text>
                 <Text style={styles.mainText}>{props.title}</Text>
            </View>
            <View style={styles.itemData}>
                <Text style={styles.mainText}>${props.amount}</Text>
                {props.deletable && <TouchableOpacity onPress={props.onRemove} style={styles.deleteButton}>
                    <Ionicons  name={Platform.OS==='android' ? 'md-trash' : 'ios-trash'} 
                                size={23}
                                color="red" />
                </TouchableOpacity>}
            </View>
        </View>
    );
};

const styles= StyleSheet.create({
    carItem :{
        padding : 10,
        backgroundColor: 'white',
        flexDirection : 'row',
        justifyContent:'space-between',
        marginHorizontal: 20
    },
    itemData : {
        flexDirection:'row',
        alignItems:'center',

    },
    quantity:{
        color:'#888',
        fontSize: 16
    },
    mainText : {
        fontWeight:'bold',
        fontSize: 16,
        maxWidth: 120
    },
    deleteButton:{
        marginLeft : 20
    }

});


export default CartItem;