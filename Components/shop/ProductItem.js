import React from 'react';
import {View, Text, Image, StyleSheet, Button, TouchableOpacity, 
    TouchableNativeFeedback, Platform} from 'react-native'; 
import Card from '../UI/Card';
const ProductItem= props  =>{
 

    return(
        <TouchableOpacity onPress={props.onSelect} >
    <Card style={styles.product}>
    <View style={styles.imageContainer}>
      <Image style={styles.image} source={{ uri: props.image }} />
    </View>
    <View style={styles.details}>
      <Text style={styles.title}>{props.title}</Text>
      <Text style={styles.price}>${props.price}</Text>
    </View>
    <View style={styles.actions}>
      {props.children}
    </View>
  </Card>
  </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
product: {
 height: 300,
 margin:20
},
imageContainer: {
  width: '100%',
  height: '60%',
  borderTopLeftRadius: 10,
  borderTopRightRadius: 10,
  overflow: 'hidden'
},
image: {
  width: '100%',
  height: '100%'
},
details: {
  alignItems: 'center',
  height: '19%',
  padding: 10
},
title: {
  fontSize: 18,
  marginVertical: 4,
  fontWeight:'bold'
},
price: {
  fontSize: 14,
  color: '#888'
},
actions: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  height: '25%',
  paddingHorizontal: 20
}
});

export default ProductItem;