import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MapView, { Marker } from 'react-native-maps';

const GOOGLE_PLACES_API_KEY = 'AIzaSyB0gQvoDA3Dj9-YvV3UdufgVmRugvPirLY'; // Replace with your API Key

const Location = () => {
  const [location, setLocation] = useState(null);

  return (
    <View style={styles.container}>
      {/* Google Places Autocomplete Input */}
      {/* <GooglePlacesAutocomplete
        placeholder="Search for an address"
        fetchDetails={true}
        onPress={(data, details = null) => {
          if (details) {
            const { lat, lng } = details.geometry.location;
            setLocation({ latitude: lat, longitude: lng });
          }
        }}
        query={{
          key: GOOGLE_PLACES_API_KEY,
          language: 'en',
        }}
        styles={{
          container: styles.searchContainer,
          textInput: styles.searchInput,
        }}
      /> */}

    
      <MapView
        style={styles.map}
        region={{
          latitude: location?.latitude || 37.7749,
          longitude: location?.longitude || -122.4194,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {location && (
          <Marker coordinate={location} title="Selected Location" />
        )}
      </MapView>

    
      {location && (
        <Text style={styles.coordinates}>
          Latitude: {location.latitude}, Longitude: {location.longitude}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchContainer: { position: 'absolute', top: 50, width: '100%', zIndex: 1 },
  searchInput: { height: 50, fontSize: 16 },
  map: { flex: 1 },
  coordinates: {
    position: 'absolute',
    bottom: 20,
    backgroundColor: 'white',
    padding: 10,
    textAlign: 'center',
    width: '100%',
  },
});

export default Location;
