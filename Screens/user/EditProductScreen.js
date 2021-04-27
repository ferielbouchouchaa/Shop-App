import React , {useCallback, useState, useEffect, useReducer} from 'react';
import {ScrollView, StyleSheet, KeyboardAvoidingView,Text, Platform, View, ActivityIndicator, Alert} from 'react-native';
import { connect } from 'react-redux'
import Ionicons from 'react-native-vector-icons/Ionicons';
import Colors from '../../Constants/Colors';
import * as productsAction from '../../store/actions/productsAction';
const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';
import Input from '../../Components/UI/Input';


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
const EditProductScreen = props =>{
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const prodId = props.route.params ? props.route.params.productId : null;
    const editedProduct = props.products.find(prod => prod.id === prodId)

    const [formState, dispatchFormState]=useReducer(formReducer, {
        inputValues: {
            title: editedProduct ? editedProduct.title : '',
            imageUrl: editedProduct ? editedProduct.imageUrl : '',
            description: editedProduct ? editedProduct.description : '',
            price: ''
          },
          inputValidities: {
            title: editedProduct ? true : false,
            imageUrl: editedProduct ? true : false,
            description: editedProduct ? true : false,
            price: editedProduct ? true : false
          },
          formIsValid: editedProduct ? true : false
        });
      
       useEffect(() =>{
         if(error) {
          Alert.alert('An error occured ! ', error, [
            {text: 'OKay'}
          ]);
         }
       }, [error]);

    

    
    const submitHandler = useCallback(async () => {
        if (!formState.formIsValid) {
          Alert.alert('Wrong input!', 'Please check the errors in the form.', [
            { text: 'Okay' }
          ]);
          return;
        }

        setError(null);
        setIsLoading(true);

        try{
        if(editedProduct) {
            await props.dispatch(productsAction.updateProduct(prodId, 
                formState.inputValues.title,
                formState.inputValues.description, 
                formState.inputValues.imageUrl));
        }else{
            await props.dispatch(productsAction.createProduct(
                formState.inputValues.title,
                formState.inputValues.description,
                formState.inputValues.imageUrl,
                +formState.inputValues.price));
        }
      }catch(err){
        setError(err)
      }
        setIsLoading(false);
        props.navigation.goBack();
    }, [props.dispatch, prodId, formState]);

    useEffect(() => {
        props.navigation.setOptions({
          
        headerRight : () =>(
            <Ionicons name='md-checkmark' 
            color={Platform.OS === 'android' ? 'white' : Colors.primary} 
            size={23} style={{paddingRight:15}} 
            onPress={submitHandler}/>
        )
        })
    }, [submitHandler]);


    const inputChangeHandler = useCallback(
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

      if(isLoading){
        return (
          <View style={styles.centred}> 
            <ActivityIndicator size='large' color={Colors.Primary}/></View>
        );
      }

    return (
        <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={100}
            style={{flex : 1}}>
        <ScrollView>    
            <View style={styles.form}>
            <Input 
                id="title"
                label="Title"
                errorText="Please enter a valid title!"
                keyboardType="default"
                autoCapitalize="sentences"
                autoCorrect
                returnKeyType="next"
                onInputChange={inputChangeHandler}
                initialValue={editedProduct ? editedProduct.title : ''}
                initiallyValid={!!editedProduct}
                required
                />
            
            <Input 
                id="imageUrl"
                label="Image Url"
                errorText="Please enter a valid image url!"
                keyboardType="default"
                returnKeyType="next"
                onInputChange={inputChangeHandler}
                initialValue={editedProduct ? editedProduct.imageUrl : ''}
                initiallyValid={!!editedProduct}
                required/>

            { editedProduct ? null : (
              <Input 
                id="price"
                label="Price"
                errorText="Please enter a valid price!"
                keyboardType="decimal-pad"
                returnKeyType="next"
                onInputChange={inputChangeHandler}
                required
                min={0.1}/> )}

            <Input 
                id="description"
                label="Description"
                errorText="Please enter a valid description!"
                keyboardType="default"
                autoCapitalize="sentences"
                autoCorrect
                multiline
                numberOfLines={3}
                onInputChange={inputChangeHandler}
                initialValue={editedProduct ? editedProduct.description : ''}
                initiallyValid={!!editedProduct}
                required
                minLength={5}/>
        </View>
        </ScrollView>
        </KeyboardAvoidingView>
    );
        
  };
const styles= StyleSheet.create({
    form:{
        margin: 20,

    },
    centred :{
      flex: 1,
      justifyContent:'center',
      alignItems:'center'
    }

});

const mapStateToProps = state=>{
    return {
        products: state.products.userProducts
    };
}

export const screenOptions= navData => {
    const routeParams = navData.route.params ? navData.route.params : {};
    return {
    headerTitle: routeParams.productId ? 'Edit Products' : 'Add Product',
    headerLeft : () => (
        <Ionicons name='md-menu' 
        color={Platform.OS === 'android' ? 'white' : Colors.primary} 
        size={23} style={{paddingLeft:20}} 
        onPress={()=>{ navData.navigation.toggleDrawer();}}/>
    )
}
}
  
export default connect(mapStateToProps)(EditProductScreen);