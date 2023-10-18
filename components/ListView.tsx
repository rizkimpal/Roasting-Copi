import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
function ListView() {
  const [imageList, setImageList] = useState<any>([]);
  const [status, setStatus] = useState(false);

  useEffect(() => {
    const loadCachedImages = async () => {
      try {
        console.log('loadcache');
        const cacheDirectory = RNFetchBlob.fs.dirs.CacheDir;
        const files = await RNFetchBlob.fs.ls(cacheDirectory);

        const imagesWithMetadata: any = await Promise.all(
          files
            .filter(file => file.endsWith('.json'))
            .map(async file => {
              const filePath = `${cacheDirectory}/${file}`;
              const fileData = await RNFetchBlob.fs.readFile(filePath, 'utf8');
              const imageData = JSON.parse(fileData);
              return {
                image: imageData.image,
                metadata: imageData.metadata,
              };
            }),
        );
        setImageList(imagesWithMetadata);
      } catch (error) {
        console.error('Error loading cached images:', error);
      }
    };

    loadCachedImages();
  }, []);

  return (
    <SafeAreaView>
      <TouchableOpacity
        onPress={() => {
          setStatus(true);
        }}
        style={styles.btn}>
        <Text>load</Text>
      </TouchableOpacity>
      <View>
        {status && (
          <View>
            <FlatList
              data={imageList}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item}) => (
                <View style={styles.container}>
                  <Image
                    source={{
                      uri: `data:image/jpg;base64,${item.image}`,
                    }}
                    style={styles.image}
                  />
                  <Text style={styles.text2}>
                    {JSON.stringify(item.metadata.temp)}
                  </Text>
                </View>
              )}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
  },
  text2: {
    color: 'black',
    textAlign: 'center',
  },
  btn: {
    backgroundColor: '#D2691E',
    borderRadius: 10,
    alignItems: 'center',
    width: 220,
    padding: 10,
    marginVertical: 10,
  },
});
export default ListView;
