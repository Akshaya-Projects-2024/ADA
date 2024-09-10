import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, FlatList } from 'react-native';
import ListFilter from '../../assets/svg/listFilter.svg'

const appointmentsData = [
  {
    id: '1',
    name: 'Mr. Mickey & Rocky',
    status: 'New',
    time: 'Today | 5:30 PM',
    type: 'Home visit',
    service: 'Basic Obedience',
    imageUrl: 'https://placekitten.com/50/50',
  },
  {
    id: '2',
    name: 'Mr. Kishor & Rani',
    time: 'Today | 5:30 PM',
    type: 'Home visit',
    service: 'Basic Obedience',
    imageUrl: 'https://placekitten.com/51/51',
  },
  {
    id: '3',
    name: 'Miss. Sai & Tommy',
    time: 'Today | 5:30 PM',
    status: 'Confirmed',
    type: 'Home visit',
    service: 'Basic Obedience',
    imageUrl: 'https://placekitten.com/52/52',
  },
  {
    id: '4',
    name: 'Mr. Sachin & Sinchan',
    time: 'Today | 5:30 PM',
    status: 'Confirmed',
    type: 'Home visit',
    service: 'Basic Obedience',
    imageUrl: 'https://placekitten.com/53/53',
  },
  {
    id: '5',
    name: 'Miss. Rutuja & Barfi',
    time: 'Today | 5:30 PM',
    status: 'New',
    type: 'Home visit',
    service: 'Basic Obedience',
    imageUrl: 'https://placekitten.com/54/54',
  },
  {
    id: '6',
    name: 'Mr. Ayansh & Navab',
    time: 'Today | 5:30 PM',
    status: 'Canceled',
    type: 'Home visit',
    service: 'Basic Obedience',
    imageUrl: 'https://placekitten.com/55/55',
  },
  {
    id: '7',
    name: 'Mr. Advik & Chintu',
    time: '26th JUN @ 11:00 AM',
    status: 'Rescheduled',
    originalTime: 'Today | 5:30 PM',
    type: 'Home visit',
    service: 'Basic Obedience',
    imageUrl: 'https://placekitten.com/56/56',
  },
];

const Dropdown = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleDropdown = () => {
    setIsVisible(!isVisible);
  };

  return (
    <View style={styles.dropdownContainer}>
      <TouchableOpacity onPress={toggleDropdown}>
        <ListFilter/>
      </TouchableOpacity>
      {isVisible && (
        <View style={styles.dropdown}>
          <TouchableOpacity style={styles.option} onPress={() => console.log('Daily')}>
            <Text style={styles.optionText}>Daily</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.option} onPress={() => console.log('Weekly')}>
            <Text style={styles.optionText}>Weekly</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.option} onPress={() => console.log('Monthly')}>
            <Text style={styles.optionText}>Monthly</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.option} onPress={() => console.log('Custom')}>
            <Text style={styles.optionText}>Custom</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const AppointmentItem = ({ item }) => (
  <View style={[styles.appointmentContainer, styles[item.status?.toLowerCase()]]}>
    <View style={styles.appointmentHeader}>
      {/* <Image source={{ uri: item.imageUrl }} style={styles.avatar} /> */}
      <View style={styles.appointmentDetails}>
        <Text style={styles.nameText}>{item.name}</Text>
        <Text style={styles.serviceText}>{item.service} | {item.type}</Text>
        <Text style={styles.timeText}>
          {item.originalTime && <Text style={styles.strikethrough}>{item.originalTime}</Text>}
          {item.time}
        </Text>
      </View>
    </View>
    {item.status && (
      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>{item.status}</Text>
      </View>
    )}
  </View>
);

const AppointmentsScreen = () => (
  <View style={styles.container}>
    <View style={styles.header}>
      <Text style={styles.title}>Appointments</Text>
      <Dropdown />
    </View>
    <FlatList
      data={appointmentsData}
      renderItem={({ item }) => <AppointmentItem item={item} />}
      keyExtractor={item => item.id}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f8f8',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  dropdownContainer: {
    position: 'relative',
  },
  dropdown: {
    position: 'absolute',
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    zIndex: 10,
  },
  option: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  optionText: {
    fontSize: 16,
  },
  appointmentContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  new: {
    borderColor: '#e0e0e0',
    borderWidth: 2,
  },
  confirmed: {
    backgroundColor: '#e0ffe0',
  },
  canceled: {
    backgroundColor: '#ffe0e0',
  },
  rescheduled: {
    backgroundColor: '#fff0e0',
  },
  appointmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  appointmentDetails: {
    flex: 1,
  },
  nameText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  serviceText: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  timeText: {
    fontSize: 14,
    marginTop: 4,
  },
  strikethrough: {
    textDecorationLine: 'line-through',
    color: '#888',
    marginRight: 4,
  },
  statusContainer: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  statusText: {
    fontSize: 14,
    color: '#888',
  },
});

export default AppointmentsScreen;
