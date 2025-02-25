import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Image, ScrollView, ActivityIndicator, TextInput, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import AuthContext from '@/contexts/AuthContext';
import axios from 'axios';

const Profile = () => {
  const { userProfile, setUserProfile } = useContext(AuthContext);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState({ ...userProfile });

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get('https://actlocal-server.onrender.com/services', {
          params: { userId: userProfile._id },
        });
        setServices(response.data);
      } catch (error) {
        console.error('Failed to fetch services:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [userProfile._id]);

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleSaveProfile = async () => {
    try {
      const response = await axios.put(`https://actlocal-server.onrender.com/users/${userProfile._id}`, updatedProfile);
      setUserProfile(response.data);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleChange = (key, value) => {
    setUpdatedProfile({ ...updatedProfile, [key]: value });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ThemedView style={styles.profileContainer}>
        {userProfile.profilePicture && (
          <Image
            source={{ uri: userProfile.profilePicture }}
            style={styles.profilePicture}
          />
        )}
        {isEditing ? (
          <>
            <TextInput
              style={styles.input}
              value={updatedProfile.firstName}
              onChangeText={(text) => handleChange('firstName', text)}
              placeholder="First Name"
            />
            <TextInput
              style={styles.input}
              value={updatedProfile.email}
              onChangeText={(text) => handleChange('email', text)}
              placeholder="Email"
            />
            <TextInput
              style={styles.input}
              value={updatedProfile.phone}
              onChangeText={(text) => handleChange('phone', text)}
              placeholder="Phone"
            />
            <TextInput
              style={styles.input}
              value={updatedProfile.address}
              onChangeText={(text) => handleChange('address', text)}
              placeholder="Address"
            />
            <TextInput
              style={styles.input}
              value={updatedProfile.bio}
              onChangeText={(text) => handleChange('bio', text)}
              placeholder="Bio"
            />
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
              <ThemedText style={styles.saveButtonText}>Save</ThemedText>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <ThemedText style={styles.name}>{userProfile.firstName}</ThemedText>
            <ThemedText style={styles.email}>{userProfile.email}</ThemedText>
            {userProfile.phone && (
              <ThemedText style={styles.phone}>Phone: {userProfile.phone}</ThemedText>
            )}
            {userProfile.address && (
              <ThemedText style={styles.address}>Address: {userProfile.address}</ThemedText>
            )}
            {userProfile.bio && (
              <ThemedText style={styles.bio}>Bio: {userProfile.bio}</ThemedText>
            )}
            <ThemedText style={styles.rating}>Rating: {userProfile.rating}</ThemedText>
            <ThemedText style={styles.verified}>
              {userProfile.isVerified ? 'Verified' : 'Not Verified'}
            </ThemedText>
            <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
              <ThemedText style={styles.editButtonText}>Edit Profile</ThemedText>
            </TouchableOpacity>
          </>
        )}
      </ThemedView>
      <ThemedView style={styles.servicesContainer}>
        <ThemedText style={styles.servicesHeader}>Services Provided</ThemedText>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
        //   services.map((service) => (
        //     <ThemedView key={service._id} style={styles.serviceItem}>
        //       <ThemedText style={styles.serviceName}>{service.name}</ThemedText>
        //       <ThemedText style={styles.serviceDescription}>{service.description}</ThemedText>
        //     </ThemedView>
        //   ))
        <ThemedText> Hi </ThemedText>
        )}
      </ThemedView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  profileContainer: {
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 3,
    marginBottom: 16,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  email: {
    fontSize: 18,
    color: '#666',
    marginBottom: 8,
  },
  phone: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  address: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  bio: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  rating: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  verified: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  input: {
    width: '100%',
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  editButton: {
    marginTop: 16,
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
  },
  editButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  saveButton: {
    marginTop: 16,
    padding: 10,
    backgroundColor: '#28a745',
    borderRadius: 5,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  servicesContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 3,
  },
  servicesHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  serviceItem: {
    marginBottom: 16,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  serviceDescription: {
    fontSize: 16,
    color: '#666',
  },
});

export default Profile;