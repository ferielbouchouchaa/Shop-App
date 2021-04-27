import React, {useReducer, useCallback, useState,useEffect} from 'react';
import { ScrollView,View, Text, Button, StyleSheet, KeyboardAvoidingView,
ActivityIndicator,Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Card from '../../Components/UI/Card';
import Input from '../../Components/UI/Input';
import Colors from '../../Constants/Colors';
import {connect} from 'react-redux';
import * as authAction from '../../store/actions/authAction';

const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';

const formReducer = (state, action) => {
    if (action.type === FORM_INPUT_UPDATE) {
      const updatedValues = {
        ...state.inputValues,
        [action.input]: action.value
      };
      const updatedValidities = {
        ...state.inputValidities,
        [action.input]: action.isValid
      };
      let updatedFormIsValid = true;
      for (const key in updatedValidities) {
        updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
      }
      return {
        formIsValid: updatedFormIsValid,
        inputValidities: updatedValidities,
        inputValues: updatedValues
      };
    }
    return state;
  };



const AuthScreen = props => {
    const [isLoading, setIsLoading]= useState(false);
    const [isSignup, setIsSignup]= useState(false);
    const [error,setError] = useState(null);
      const [formState, dispatchFormState]=useReducer(formReducer, {
            inputValues: {
               email:'',
               password:'',

              },
              inputValidities: {
                email:false,
                password:false
              },
              formIsValid: false
            });

    useEffect(()=>{
        if(error){
            Alert.alert('An Error Occured !', error, [
                {text : 'Okay' }
            ]);
        }
    },[error]);

    const authHandler = async() =>{
        let action;
        if (isSignup) {
          action = authAction.signup(
            formState.inputValues.email,
            formState.inputValues.password
          );
        } else {
          action = authAction.login(
            formState.inputValues.email,
            formState.inputValues.password
          );
        }
        setError(null)
        setIsLoading(true);
        try{
            await props.dispatch(action);
            // props.navigation.navigate('Shop');
        }catch (err){
            setError(err.message);
            setIsLoading(false);
        }
        

    };

    const inputChangeHandler =  useCallback(
        (inputIdentifier, inputValue, inputValidity) => {
          dispatchFormState({
            type: FORM_INPUT_UPDATE,
            value: inputValue,
            isValid: inputValidity,
            input: inputIdentifier
          });
        },
        [dispatchFormState]
      );

  return (
      <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={50} style={styles.screen}>
        <LinearGradient colors={['#ffedff','#ffe3ff']} style={styles.gradient}>
        <Card style={styles.authContainer}>
            <ScrollView>
                <Input 
                    id="email"  
                    label="E-Mail" 
                    keyboardType='email-address'
                    required
                    email
                    autoCapitalize="none"
                    errorText="Please Enter a valid email address"
                    onInputChange={inputChangeHandler}
                    initialValue=""
                    />
                     <Input 
                    id="password"  
                    label="Password" 
                    keyboardType='default'
                    secureTextEntry
                    required
                    minLength={5}
                    autoCapitalize="none"
                    errorText="Please Enter a valid password"
                    onInputChange={inputChangeHandler}
                    initialValue=""
                    />
                    <View style={styles.buttonContainer}>
                   { isLoading ? <ActivityIndicator
                                size='small'
                                color={Colors.Primary}
                            /> 
                    : <Button 
                        title={isSignup ? "Sign Up" : "Login"} 
                        color={Colors.Primary} 
                        onPress={authHandler}/>}
                        </View>
                    <View style={styles.buttonContainer}>
                    <Button 
                        title={`Switch to ${isSignup ? 'Login' :'Sign Up'}`}
                        color={Colors.Accent}
                        onPress={()=>{
                            setIsSignup(prevState => !prevState)
                        }}/>
                    </View>
            </ScrollView>
        </Card>
        </LinearGradient>
      </KeyboardAvoidingView>
  );
};

export const screenOptions={
    headerTitle: 'Authenticate' 
};
    
const styles = StyleSheet.create({
    screen :{
        flex: 1,
    },
    authContainer:{
        width:'80%',
        maxWidth:400,
        maxHeight:400,
        padding:20   

    },
    gradient:{
       flex:1,
        justifyContent:'center',
        alignItems:'center'  
    },
    buttonContainer:{
        marginTop:10,
    }
});
const mapStateToProps= state=>{
    return {

    }
}
export default connect(mapStateToProps)(AuthScreen);
