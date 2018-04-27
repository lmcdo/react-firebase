import React from 'react';
import { StyleSheet, Text, View, StatusBar, ListView } from 'react-native';
import * as firebase from 'firebase';
import { Container, Content, Header, Form, Input, Item, Button, Label, Icon, List, ListItem } from 'native-base';



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

var data= []


export default class App extends React.Component {
  
  constructor(props){
    super(props)

    this.ds = new ListView.DataSource({rowHasChanged: (r1,r2) => r1 !== r2})

    this.state = ({
      email:'',
      password: '',
      listViewData: data,
      newContact:""
    })
  }

  addRow(data){

    var key = firebase.database().ref('/contacts').push().key
    firebase.database().ref('/contacts').child(key).set({ name: data })

  }

  async deleteRow(secId, rowId, rowMap, data){

    await firebase.database().ref('contacts/'+data.key).set(null)

    rowMap[`${secId}${rowId}`].props.closeRow();
    var newData = [...this.state.listViewData];
    newData.splice(rowId, 1)
    this.setState({ listViewData: newData}); 


  }

  showInformation(){




  }





  componentDidMount(){

     var that = this
     firebase.database().ref('/contacts').on('child_added', function(data){

        var newData = [...that.state.listViewData]
        newData.push(data)
        that.setState({listViewData : newData})
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
        {/* <Form>
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

          


        </Form> */}

        <Header style={{ marginTop: StatusBar.currentHeight }}>
        <Content>
          <Item>
            <Input
              placeholder="Add Name"
              onChangeText = {(newContact) => this.setState({newContact})}
            />
            <Button onPress={() => this.addRow(this.state.newContact)}>
              <Icon name="add" />
            </Button>
          </Item>
          </Content>
        </Header>

        <Content>
            <List
            enableEmptySections
            dataSource={this.ds.cloneWithRows(this.state.listViewData)}
            renderRow={data=>
            <ListItem>
              <Text>{data.val().name}</Text>
            </ListItem>
            }

            renderLeftHiddenRow={data =>
            <Button full onPress={()=> this.addRow(data)}>
            <Icon name="information-circle"/>
            </Button>
            }

            renderRightHiddenRow={(data, secId, rowId, rowMap) =>
              <Button full danger onPress={()=>this.deleteRow(secId, rowId, rowMap,data)}>
              <Icon name="trash"/>
              </Button>
              }

              leftOpenValue={-75}
              rightOpenValue={-75}

            />
          </Content>
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
