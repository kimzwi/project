import React, { Component } from 'react';
import { AppRegistry,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/AntDesign';
import { colorsFromUrl } from 'react-native-dominant-color';
import Color from 'color';
import  _  from 'lodash';

import MovieList from './MovieList';
import NotFound from '../Images/Image-not-found.gif';

const deviceWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  image: {
    width: deviceWidth,
    height: (deviceWidth * 16) / 15,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  nameText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
  },
  details: {
    paddingLeft: 60,
  },
  infoWrapper: {
    flexDirection: 'row',
  },
  infoText: {
    color: '#fff',
    fontSize: 18,
  },
  summaryContainer: {
    paddingLeft: 10,
    paddingTop: 5,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryWrapper: {
    paddingLeft: 30,
  },
  nameContainer: {
    height: 60,
  },
  iconContainer: {
    width: 30,
    height: 30,
    borderRadius: 100,
    backgroundColor: '#000',
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityIndicator: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
});
export default class SelectedVideo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: null,
      name: null,
      summary: null,
      rating: null,
      premiered: null,
      runTime: null,
      color: '#616169',
      darkenColor: '#000',
      image: null,
      activityIndicator: false,
    };
  }

  async componentDidMount() {
    // get data from MovieList.js component
    const { navigation } = this.props;
    const id = navigation.getParam('id', 'NO-ID');
    await this.setState({ id: id });

    // fetch details of selected video
    try {
      const response = await axios.get(`http://api.tvmaze.com/shows/${this.state.id}`);

      // remove html tags from summary.
      let summary = response.data.summary != null ? response.data.summary.replace(
        /(<p[^>]+?>|<p>|<\/p>|<b[^>]+?>|<b>|<\/b>|<br[^>]+?>|<br>|<\/br>)/img, ''
      ) : null;
      await this.setState({
        name: response.data.name,
        summary: summary,
        rating: response.data.rating.average,
        premiered: response.data.premiered,
        runTime: response.data.runtime,
        image: response.data.image != null ? response.data.image.original : null,
        activityIndicator: true,
      }, console.log(this.state.image));
    }catch (error) {
      console.log(error);
    }

    // calculate dominant color of image
    colorsFromUrl(this.state.image, (err, colors) => {
      if (!err) {
        this.setState({ color: colors.averageColor });
        var color = Color(this.state.color).alpha(0.5).darken(0.7);
        this.setState({ darkenColor: color, colorHandler: true });
      }
    });
  }

  render() {
    const { colorHandler, darkenColor, color, name, summary, rating, premiered, runTime, image, activityIndicator } = this.state;
    // show indicator when data not fetched

    if (!activityIndicator) {
      return (
        <View style={styles.activityIndicator}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    }

    return (
      <View>
        <ScrollView>
          <View style={styles.iconContainer}>
            <Icon
              name='arrowleft'
              size={20}
              color='#fff'
              onPress={()=>this.props.navigation.navigate('MovieList')}/>
            </View>
            <Image style={styles.image} source={image != null ? { uri: image } : NotFound}/>
            <View style={[styles.infoContainer, { backgroundColor: color }]}>
              <View style={styles.details}>
                <View style={[styles.nameContainer, { backgroundColor: color }]}>
                  <Text style={styles.nameText}>{name != null ? name : '-'}</Text>
                </View>
                <View style={styles.infoWrapper}>
                  <Text style={styles.infoText}>{premiered != null ? premiered : '-'} . </Text>
                  <Text style={styles.infoText}>{runTime != null ? runTime : '-'}min . </Text>
                  <Text style={styles.infoText}>{rating != null ? rating : '-'}/10</Text>
                </View>
              </View>
              <View style={[styles.summaryContainer, { backgroundColor: darkenColor }]}>
                <Icon name="exclamationcircle" color="#fff" size={20}/>
                <View style={styles.summaryWrapper}>
                  <Text style={styles.infoText}>{summary != null ? summary : '-'}</Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      );
  }
}
