import React, { createContext, useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [userProfile, setUserProfile] = useState({});
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const storedToken = await AsyncStorage.getItem('token');
                const storedUser = await AsyncStorage.getItem('user');
                if (storedToken && storedUser) {
                    setUserProfile(JSON.parse(storedUser));
                    router.replace('/');
                } else {
                    router.replace('/Login');
                }
            } catch (error) {
                console.error('Failed to retrieve user from storage:', error);
                router.replace('/Login');
            }
        };

        checkAuth();
    }, []);

    const login = async (token, user) => {
        if (!token || !user) {
            console.error('Token or user is null or undefined');
            return;
        }
        try {
            setUserProfile(user);
            await AsyncStorage.setItem('token', token);
            await AsyncStorage.setItem('user', JSON.stringify(user));
            router.replace('/');
        } catch (error) {
            console.error('Failed to save user to storage:', error);
        }
    };

    const logout = async () => {
        try {
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('user');
            setUserProfile(null);
            router.replace('/Login');
        } catch (error) {
            console.error('Failed to remove user from storage:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ userProfile, setUserProfile, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;