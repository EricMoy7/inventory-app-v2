import React, { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Switch } from 'react-router-dom';
import './App.css';

import Header from './components/sections/Header';
import SignUp from './components/pages/SignUp';
import SignIn from './components/pages/SignIn';
import ForgotPassword from './components/pages/ForgotPassword';
import Homepage from './components/pages/Homepage';
import Dashboard from './components/pages/Dashboard';
import Settings from './components/pages/Settings';

import PrivateRoute from './components/auth/PrivateRoute';
import PublicRoute from './components/auth/PublicRoute';
import Loader from './components/UI/Loader';
import firebase from './firebase/config';
import {
  getUserById,
  setLoading,
  setNeedVerification,
} from './store/actions/authActions';
import { RootState } from './store';
import AmazonInventory from './components/pages/AmazonInventory';
import ImportDataPage from './components/pages/ImportDataPage';
import Inventory from './components/pages/Inventory';

//Notifications Module
import 'react-notifications-component/dist/theme.css';
import ReactNotification from 'react-notifications-component';

const App: FC = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state: RootState) => state.auth);

  // Mock authenticated user for UI preview
  useEffect(() => {
    dispatch(setLoading(true));
    // Simulate a logged in user
    const mockUser = {
      uid: 'mock-user-123',
      email: 'demo@example.com',
      emailVerified: true,
      displayName: 'Demo User'
    };
    dispatch(getUserById(mockUser.uid));
    dispatch(setLoading(false));
  }, [dispatch]);

  if (loading) {
    return <Loader />;
  }

  return (
    <BrowserRouter>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/icon?family=Material+Icons"
      />
      <ReactNotification />
      <Header />
      <Switch>
        <PublicRoute path="/" component={Homepage} exact />
        <PublicRoute path="/signup" component={SignUp} exact />
        <PublicRoute path="/signin" component={SignIn} exact />
        <PublicRoute path="/forgot-password" component={ForgotPassword} exact />
        <PrivateRoute path="/dashboard" component={Dashboard} exact />
        <PrivateRoute path="/settings" component={Settings} exact />
        <PrivateRoute
          path="/amazon-inventory"
          component={AmazonInventory}
          exact
        />
        <PrivateRoute path="/inventory" component={Inventory} exact />
        <PrivateRoute path="/import-data" component={ImportDataPage} exact />
      </Switch>
    </BrowserRouter>
  );
};

export default App;
