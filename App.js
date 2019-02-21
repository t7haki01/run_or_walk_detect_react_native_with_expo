import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Button, Image } from 'react-native';
import { Accelerometer } from 'expo';
 
var accTot = [];
var accTotAvg = [];
var accWithoutG = [];
var accTotAbs = [];
var accTotAbsAvg = [];
var speed = [];
var IIRcoefficient1 = 0.05;
var IIRcoefficient2 = 0.03;
var speedConstant1 = 0.5;
var speedConstant2 = -0.3;
var xValue = [];
var yValue = [];
var zValue = [];

export default class App extends React.Component {
  
  state = {
    accelerometerData: {},
    onStart: false,
  }

  componentDidMount() {
    // this._pause();
  }

  componentWillUnmount() {
    // this._unsubscribe();
  }
 
  _pause = () => {
    if (this._subscription) {
      this._unsubscribe();
      this.setState({onStart: false});
    } else {
      this._subscribe();
      this.setState({onStart: true});
    }
  }

  _slow = () => {
    Accelerometer.setUpdateInterval(1000); 
  }

  _fast = () => {
    Accelerometer.setUpdateInterval(16);
  }
 
  _subscribe = () => {
    Accelerometer.setUpdateInterval(20); 
    this._subscription = Accelerometer.addListener(accelerometerData => {
      this.setState({ accelerometerData });
    });
    this.setState({onStart : true});
  }

  _unsubscribe = () => {
    this._subscription && this._subscription.remove();
    this._subscription = null;
    this.setState({onStart : false});
  } 


  render() {
    let { x, y, z } = this.state.accelerometerData;
    if(this.state.onStart){
      // console.log("in render state ", JSON.stringify(this.state.accelerometerData));
      // console.log("in render state ", accTot);
      if(Object.keys(this.state.accelerometerData).length !== 0 ){
        if(accTot.length===0){
          xValue.push(x*10);
          yValue.push(y*10);
          zValue.push(z*10);
          accTot.push( Math.sqrt(Math.pow(x*10,2)+Math.pow(y*10,2)+Math.pow(z*10,2)).toFixed(2) );
          // console.log(JSON.stringify(this.state.accelerometerData));
          accTotAvg.push( accTot[accTot.length-1] );
          accWithoutG.push(accTot[accTot.length-1] - accTotAvg[accTotAvg.length-1]);
          accTotAbs.push(Math.abs(accWithoutG[accWithoutG.length-1])); 
          accTotAbsAvg.push(accTotAbs[accTotAbs.length-1]);
          speed.push(accTotAbsAvg[accTotAbsAvg.length-1]*speedConstant1);
        }else{ 
          xValue.push(x*10);
          yValue.push(y*10);
          zValue.push(z*10);
          accTot.push( Math.sqrt(Math.pow(x*10,2)+Math.pow(y*10,2)+Math.pow(z*10,2)).toFixed(2) );
          // console.log(JSON.stringify(this.state.accelerometerData));
          accTotAvg.push( accTotAvg[accTotAvg.length-1]*(1-IIRcoefficient1) + accTot[accTot.length-1]*IIRcoefficient1 );
          accWithoutG.push( accTot[accTot.length-1] - accTotAvg[accTotAvg.length-1] );
          accTotAbs.push( Math.abs(accWithoutG[accWithoutG.length-1]) );
          accTotAbsAvg.push( accTotAbsAvg[accTotAbsAvg.length -1]*(1 - IIRcoefficient2) + accTotAbs[accTotAbs.length-1]*IIRcoefficient2 );  
          speed.push(accTotAbsAvg[accTotAbsAvg.length-1]*speedConstant1);
        }
      }
    } 
    return (
      <View style={styles.container}>
        <Text>Accelerometer:</Text>
        {/* <Text>x: {round(x)} y: {round(y)} z: {round(z)}</Text> */}
        {/* <Text>x: {x} y: {y} z: {z}</Text> */}
 
        {/* <Text>AccTot: {accTot[accTot.length-1]}</Text>
        <Text>AccTotAvg: {accTotAvg[accTotAvg.length-1]}</Text>
        <Text>AccTotWithoutG: {accWithoutG[accWithoutG.length-1]}</Text>
        <Text>AccTot abs: {accTotAbs[accTotAbs.length -1]}</Text>
        <Text>AccTot abs avg: {accTotAbsAvg[accTotAbsAvg.length-1]}</Text>
        <Text>Speed: {speed[speed.length-1]} m/s</Text> */}

        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={this._pause} style={styles.button}>
            <Text>Pause</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this._slow} style={[styles.button, styles.middleButton]}>
            <Text>Slow</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this._fast} style={styles.button}>
            <Text>Fast</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this._subscribe} style={styles.button}>
            <Text>Start</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this._unsubscribe} style={styles.button}>
            <Text>Stop</Text>
          </TouchableOpacity>
        </View>

      <Button
        onPress={makeLogFile}
        title="Console the log"
        color="#841584"
      />
      <Button
        onPress={makeDataZero}
        title="Make Data Zero"
        color="#555555"
      />

      
      {/* {accWithoutG[accWithoutG.length-1]>1 || accWithoutG[accWithoutG.length-1] < -1 ? <Text>You are now running</Text>
      : accWithoutG[accWithoutG.length-1]<0.2 & accWithoutG[accWithoutG.length-1]>-0.2 ? <Text>You are now standing </Text> : 
      <Text>You are now walking </Text>
      } */}
      {this.state.onStart ?
       accTotAbsAvg[accTotAbsAvg.length-1] >= 2 ?         
          <View style={styles.container_center}>
          <Text>Now you are running</Text>
          <Image source={{uri: 'https://media.giphy.com/media/kEKcOWl8RMLde/giphy.gif'}}
                style={{width: 300, height:300 }}
          /></View> :
          accTotAbsAvg[accTotAbsAvg.length-1] < 2 && accTotAbsAvg[accTotAbsAvg.length-1] >= 0.7 ?
          <View style={styles.container_center}>
          <Text>Now you are walking</Text>
          <Image source={{uri: 'https://media.giphy.com/media/QpWDP1YMziaQw/giphy.gif'}}
                style={{width: 300, height:300}}
          /></View> :
          accTotAbsAvg[accTotAbsAvg.length-1] <= 0.1 && accTotAbsAvg[accTotAbsAvg.length-1] >= 0 ?
          <View style={styles.container_center}>
          <Text>Now you are standing perheps..?</Text>
          <Image source={{uri:'https://media.giphy.com/media/VexAmQw9qpIQ/giphy.gif'}}
                style={{width:300, height:300}}
          />
          <Text>Prepare to run!</Text>
          </View> :
          <View style={styles.container_center}>
          <Text>Calculating...</Text>
          <Image source={{uri:'https://media.giphy.com/media/Vd6WCzi2QNiy4/giphy.gif'}}
                style={{width:300, height:300}}
          />
          <Text>Show some movement!</Text>
        </View>
         : null
     }


      {/* </View> */}
        {/* <Text>Open up App.js to start working on your app!</Text> */}

          {/* <View style={{flex: 1, flexDirection: 'row'}}>
            <View style={{width: 50, height: 50, backgroundColor: 'powderblue'}} />
            <View style={{width: 50, height: 50, backgroundColor: 'skyblue'}} />
            <View style={{width: 50, height: 50, backgroundColor: 'steelblue'}} />
          </View> */}
      </View>
    );
  }
}
 
function makeLogFile(){
  console.log("Here called log caller")
  if(accTot.length>4){
    for(var i = 0; i<accTot.length; i++){
      // console.log(/*accTot[i] + ", ", */accTotAvg[i], ", ", accWithoutG[i], ", ", accTotAbs[i], ", ", accTotAbsAvg[i]);
      // console.log("Speed: ", speed[speed.length-1]);
      console.log(xValue[i], ", ", yValue[i], ", ", zValue[i], ", ", accTotAbsAvg[i] );
    }
  }
} 
function makeDataZero(){  
  accTotAvg.length = 0;
  accTot.length = 0;
  accWithoutG.length = 0;
  accTotAbs.length = 0;
  accTotAbsAvg.length = 0;
  speed.length = 0;
  xValue.length = 0;
  yValue.length = 0;
  zValue.length = 0;
}





function round(n) {
  if (!n) {
    return 0;
  }

  return Math.floor(n * 100) / 100;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
   },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginTop: 15
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',
    padding: 10,
  },
  middleButton: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#ccc',
  },
  sensor: {
    marginTop: 15,
    paddingHorizontal: 10,
  },
  container_center: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
