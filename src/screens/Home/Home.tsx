import {
  FlatList,
  Image,
  SafeAreaView,
  Text,
  Dimensions,
  View,
} from 'react-native';
import {styles} from './styles';
import {API_KEY, API_URL} from '../../services';
import {useEffect, useState} from 'react';

const {width, height} = Dimensions.get('screen');

const Home = () => {
  const [photos, setPhotos] = useState([]);

  const fetchImagesFromPexels = async () => {
    const response = await fetch(
      `${API_URL}search?query=tigers&orientation=portrait&size=small&per_page=20`,
      {
        headers: {
          Authorization: API_KEY,
        },
      },
    );

    const {photos} = await response.json();

    setPhotos(photos);
  };

  useEffect(() => {
    fetchImagesFromPexels();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={photos}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        renderItem={({item}) => (
          <Image source={{uri: item.src.portrait}} style={{width, height}} />
        )}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  );
};

export default Home;
