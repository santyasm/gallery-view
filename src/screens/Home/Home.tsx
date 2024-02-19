import {
  FlatList,
  Image,
  SafeAreaView,
  Text,
  Dimensions,
  View,
  TouchableOpacity,
} from 'react-native';
import {styles} from './styles';
import {API_KEY, API_URL} from '../../services';
import {useEffect, useRef, useState} from 'react';

const {width, height} = Dimensions.get('screen');
const IMAGE_SIZE = 80;
const SPACING = 10;

const Home = () => {
  const [photos, setPhotos] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const topRef = useRef();
  const thumbRef = useRef();

  const scrollToActiveIndex = index => {
    setActiveIndex(index);
    topRef?.current?.scrollToOffset({
      offset: index * width,
      animated: true,
    });
    if (index * (IMAGE_SIZE + SPACING) - IMAGE_SIZE / 2 > width / 2) {
      thumbRef?.current?.scrollToOffset({
        offset: index * (IMAGE_SIZE + SPACING) - width / 2 + IMAGE_SIZE / 2,
        animated: true,
      });
    }
  };

  const fetchImagesFromPexels = async () => {
    const response = await fetch(
      `${API_URL}search?query=tigers&orientation=portrait&size=small&per_page=100`,
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
        ref={topRef}
        data={photos}
        horizontal
        pagingEnabled
        onMomentumScrollEnd={ev => {
          scrollToActiveIndex(ev.nativeEvent.contentOffset.x / width);
        }}
        showsHorizontalScrollIndicator={false}
        renderItem={({item}) => (
          <Image source={{uri: item.src.portrait}} style={{width, height}} />
        )}
        keyExtractor={item => item.id.toString()}
      />
      <FlatList
        ref={thumbRef}
        data={photos}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={{position: 'absolute', bottom: 80}}
        contentContainerStyle={{paddingHorizontal: SPACING}}
        renderItem={({item, index}) => (
          <TouchableOpacity
            onPress={() => {
              scrollToActiveIndex(index);
            }}>
            <Image
              source={{uri: item.src.portrait}}
              style={{
                width: IMAGE_SIZE,
                height: IMAGE_SIZE,
                borderRadius: 12,
                marginRight: 10,
                borderWidth: 2,
                borderColor: activeIndex === index ? '#fff' : 'transparent',
              }}
            />
          </TouchableOpacity>
        )}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  );
};

export default Home;
