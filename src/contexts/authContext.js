import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    token: null,
    gpsFeature: null,
    highResolutionUploads: null,
    roles: [],
    menu: [],
    locations:[],
  });

  const login = (data) => {
    setAuthState({
      token: data.token,
      gpsFeature: data.gpsFeature,
      highResolutionUploads: data.highResolutionUploads,
      roles: data.roles,
      menu: data.menu,
      locations: data.locations,
    });
  };

  const logout = () => {
    setAuthState({
      token: null,
      gpsFeature: null,
      highResolutionUploads: null,
      roles: [],
      menu: [],
      locations: [],
    });
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
