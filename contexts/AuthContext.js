import React, { createContext, useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
// Import jwtDecode to decode JSON Web Tokens (JWT) and extract user information
import jwtDecode from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [userProfile, setUserProfile] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const storedToken = await AsyncStorage.getItem('token');
                if (storedToken) {
                    router.replace('/');
                } else {
                    router.replace('/Login');
                }
            } catch (error) {
                router.replace('/Login');
            }
        };

        checkAuth();
    }, []);

    const login = async (token) => {
        if (!token) {
            console.error('Token is null or undefined');
            return;
        }
        try {
            await AsyncStorage.setItem('token', token);
            router.replace('/');
        } catch (error) {
            console.error('Failed to save user to storage:', error);
        }
    };

    const logout = async () => {
        try {
            await AsyncStorage.removeItem('token');
            setUserProfile(null);
            router.replace('/Login');
        } catch (error) {
            console.error('Failed to remove user from storage:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ userProfile, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;