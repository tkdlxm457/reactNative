import React, { useEffect, useState } from "react"
import * as Location from 'expo-location';
import { StyleSheet, Text, Dimensions, View, ScrollView, ActivityIndicator } from 'react-native';
import { Fontisto } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const API_KEY = "1df0128bfaaeb29fd5bfdaa2aa62f8d0";

const icons = {
  Clouds: "cloudy",
  Clear: "day-sunny",
  Atomosphere: "cloudy-gusts",
  Snow: "snow",
  Rain: "rains",
  Drizzle: "rain",
  Thunderstorm: "lightning",

}

export default function App() {

  const [city, setCity] = useState("Loading...");

  const [days, setDays] = useState([]);

  const [ok, setOk] = useState(true);

  const getWeather = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setOk(false);
    }
    const { coords: { latitude, longitude } } = await Location.getCurrentPositionAsync({ accuracy: 5 });
    const location = await Location.reverseGeocodeAsync(
      { latitude, longitude },
      { useGoogleMaps: false }
    );
    setCity(location[0].district);
    const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric`)
    const json = await response.json();
    setDays(json.daily);
  }

  useEffect(() => {
    getWeather();
  }, [])

  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.weather}>
        {
          days.length === 0 ? (
            <View style={styles.day}>
              <ActivityIndicator style={{...styles.days, alignItems: "center"}}/>
            </View>
          ) : (
            days.map((day, index) =>
              <View style={styles.day}>
                <View style={{flexDirection: "row", alignItems: "center", width: "100%", justifyContent: "space-between"}}>
                  <Text style={styles.teamp}>
                    {parseFloat(day.temp.day).toFixed(1)}°
                  </Text>
                  <Fontisto name={icons[day.weather[0].main]} size={68} color="black" />
                </View>

                <Text style={styles.desc}>{day.weather[0].main}</Text>
                <Text style={styles.tinyText}>{day.weather[0].description}</Text>
              </View>
            )
          )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "yellow",
  },
  city: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cityName: {
    fontSize: 60,
    fontWeight: "500",
  },
  weather: {

  },
  day: {
    width: SCREEN_WIDTH,
    alignItems: "flex-start",
    padding: 15,
  },
  teamp: {
    marginTop: 50,
    fontSize: 120,
  },
  desc: {
    marginTop: -30,
    fontSize: 30,
  },
  tinyText: {
    fontSize: 20,
  },
});
