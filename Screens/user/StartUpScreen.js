import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect} from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import Colors from '../../Constants/Colors';
import {connect} from 'react-redux';
import * as authAction from '../../store/actions/authAction';
const StartUpScreen = props => {

    useEffect( ()=>{
        const tryLogin = async() =>{
            const userData = await AsyncStorage.getItem('userData');
            if(!userData){
                // props.navigation.navigate('Auth');
                props.dispatch(authAction.setDidTryAL());
                return;
            }
            const transformedData = JSON.parse(userData);
            const {token, userId, expiryDate} =transformedData;
            const expirationDate = new Date(expiryDate);

            if(expirationDate <= new Date() || !token || !userId){
                // props.navigation.navigate('Auth');
                props.dispatch(authAction.setDidTryAL());
                return;
            }

            const expirationTime = expirationDate.getTime() - new Date().getTime();
            // props.navigation.navigate('Shop');
            props.dispatch(authAction.authenticate(userId, token,expirationTime));

        }
        tryLogin();
    }, [props.dispatch]);

  return ( <View style={styles.screen}>
      <ActivityIndicator size='large' color={Colors.Primary}/>
  </View>);
};

const styles = StyleSheet.create({
    screen :{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    }
});

const mapStateToProps = state =>{
    return {

    }
}
export default connect(mapStateToProps)(StartUpScreen);
