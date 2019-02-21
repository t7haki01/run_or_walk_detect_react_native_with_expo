import React, { Component } from 'react';
import {View} from 'react-native';
class ColoredBoxes extends Component {
    render() {
        return (
            <div>
                <View>
                    <View>style={{width: 50, height: 50, backgoundColor: "Red"}}</View> 
                </View>                
            </div>
        )
    }
}

export default ColoredBoxes;