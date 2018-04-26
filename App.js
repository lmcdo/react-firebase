import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as firebase from 'firebase';

const newLocal = "https://react-firebase-5c49c.firebaseio.com";
// Initialise Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDyJ4XMrUdrYO6D59ukFHLnNA6TmT-F9QM",
  authDomain: "react-firebase-5c49c.firebaseapp.com",
  databaseURL: "https://react-firebase-5c49c.firebaseio.com",
  projectId: "react-firebase-5c49c",
  storageBucket: "react-firebase-5c49c.appspot.com",
};

firebase.initializeApp(firebaseConfig);

import { Container, Content, Header, Form, Input, Item, Button, Label } from 'native-base';

export default class App extends React.Component {
  
  constructor(props){
    super(props)

    this.state = ({
      email:'',
      password: ''
    })
  }


  componentDidMount(){

      firebase.auth().onAuthStateChanged((user) => {
        if (user != null){
          console.log(user)
        }
      })


  }

  signUpUser = (email, password) =>  {

      try{

        if (this.state.password.length < 6) {
          alert("Please enter at least 6 characters")
          return;
        }

        firebase.auth().createUserWithEmailAndPassword(email, password)
      }
      catch(error){
        console.log(error.toString())
      }
  }

  loginUser = (email, password) =>  {

    try {

        firebase.auth().signInWithEmailAndPassword(email, password).then(function (user) {
          console.log(user)
        })
    }

    catch (error) {

          console.log(error.toSTring())

    }

  }
  

  async loginWithFacebook(){

    const {type,token} = await Expo.Facebook.logInWithReadPermissionsAsync
    ('149713282541098', { permissions: ['public_profile'] })

    if (type == 'success'){

      const credential = firebase.auth.FacebookAuthProvider.credential(token)


    firebase.auth().signInWithCredential(credential).catch((error) =>{
        console.log(error);
})

}
  }  
  render() {
    return (
      <Container style={styles.container}>
        <Form>
          <Item floatingLabel >
            <Label> Email </Label>
            <Input
            autoCorrect={false}
            autoCapitalize="none"
            onChangeText={(email) => this.setState({email})}
            />
          </Item>
          <Item floatingLabel >
            <Label> Password </Label>
            <Input
            secureTextentry={true}
            autoCorrect={false}
            autoCapitalize="none"
            onChangeText={(password) => this.setState({password})}
            />
          </Item>

          <Button style={{ marginTop: 10 }}
            full
            rounded 
            success
            onPress={() => this.loginUser(this.state.email, this.state.password)}
        
          >
          <Text style={{ color: 'white'}}> Login </Text>
          </Button>

          <Button style={{ marginTop: 10 }}
            full
            rounded 
            primary
            onPress={() => this.signUpUser(this.state.email, this.state.password)}

        
          >
          <Text style={{ color: 'white'}}> Sign Up  </Text>
          </Button>

          <Button style={{ marginTop: 10 }}
            full
            rounded 
            primary
            onPress={() => this.loginWithFacebook()}
        
          >
          <Text style={{ color: 'white'}}> Login With Facebook  </Text>
          </Button>


        </Form>
      </Container>
        
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    
    justifyContent: 'center',
    padding: 10
  },
});
