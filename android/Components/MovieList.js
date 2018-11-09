import React, { Component } from 'react';
import {
AppRegistry,
 Text,
 View,
 TouchableOpacity,
 StyleSheet,
 FlatList,
 Image,
 Dimensions,
 TextInput,
 ActivityIndicator
  } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import Icon from 'react-native-vector-icons/Feather';
import axios from 'axios';
import  _  from 'lodash';

import image from '../Images/Image-not-found.gif';
import SelectedVideo from './SelectedVideo';

const deviceWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  navbar: {
    height: 50,
    backgroundColor: 'blue',
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 10,
    paddingLeft: 10,
  },
  text: {
    color: '#fff',
    fontSize: 20,
    marginLeft: 10,
  },
  navbarElement: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  image: {
    height: (16 * (deviceWidth - 12)) / 18,
    width: (deviceWidth - 12) / 2,
    margin: 3,
  },
  imageContainer: {
    flexWrap: 'wrap',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row-reverse',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: 200,
    textAlign: 'center',
    flex: 1,
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    color: '#fff',
    fontSize: 20,
  },
  activityIndicator: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },

});
class MovieList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      movies: [],
      searchString: 'kimia',
    };
  }

  async componentDidMount() {
    // fetch data
    try {
      const response = await axios.get(`http://api.tvmaze.com/search/shows?q=${this.state.searchString}`);
      console.log(response.data);
      this.setState({ movies: response.data });
    }catch (error) {
      console.log(error);
    }
  }

  async showSearch(text) {
    // handle search
    this.setState({ movies: null });
    try {
      const response = await axios.get(`http://api.tvmaze.com/search/shows?q=${text}`);
      this.setState({ movies: response.data });
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    // show indicator when data not fetched
    if (_.isEmpty(this.state.movies)) {
      return (
        <View style={styles.activityIndicator}>
      <ActivityIndicator size="large" color="#0000ff" />
      </View>
      );
    }

    return (
      <View>
      <View style={styles.navbar}>
        <View style={styles.navbarElement}>
          <Icon name="menu" color="#fff" size={30}/>
        </View>
        <View style={styles.searchContainer}>
        <Icon
          name="search"
          color="#fff"
          size={30}
          onPress={()=>this.showSearch(this.state.searchString)}/>
        <TextInput
            placeholder="Search"
            ref={this.searchInput}

            style={styles.input}
            underlineColorAndroid="transparent"
            placeholderTextColor='#fff'
            autoGrow
            onChangeText={(text) => this.setState({ searchString: text })}

          />
        </View>
      </View>
      <View>
        <FlatList
            data={this.state.movies}
            numColumns={2}
            renderItem={({ item }) => (
              <View style={styles.imageContainer}>
              <TouchableOpacity
                onPress={()=>this.props.navigation.navigate('SelectedVideo', { id: item.show.id })}
                >
              <Image
                source={item.show.image != null ?  { uri: item.show.image.original } : image }
                style={styles.image}
              />
          </TouchableOpacity>
            </View>
        )}
          />
      </View>
    </View>
    );
  }
}

const RootStack = createStackNavigator(
{
  MovieList: MovieList,
  SelectedVideo: SelectedVideo,
},
{
  initialRouteName: 'MovieList',
  headerMode: 'none',
  navigationOptions: {
    headerVisible: false,
  },
}
);
export default RootStack;
