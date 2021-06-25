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
import { getUserById, setLoading, setNeedVerification } from './store/actions/authActions';
import { RootState } from './store';
import AmazonInventory from './components/pages/AmazonInventory';

const App: FC = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state: RootState) => state.auth);
  
  // Check if user exists
  useEffect(() => {
    dispatch(setLoading(true));
    const unsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
      if(user) {
        dispatch(setLoading(true));
        await dispatch(getUserById(user.uid));
        if(!user.emailVerified) {
          dispatch(setNeedVerification());
        }
      }
      dispatch(setLoading(false));
    });

    return () => {
      unsubscribe();
    };
  }, [dispatch]);

  if(loading) {
    return <Loader />;
  }

  return (
    <BrowserRouter>
      <Header />
      <Switch>
        <PublicRoute path="/" component={Homepage} exact />
        <PublicRoute path="/signup" component={SignUp} exact />
        <PublicRoute path="/signin" component={SignIn} exact />
        <PublicRoute path="/forgot-password" component={ForgotPassword} exact />
        <PrivateRoute path="/dashboard" component={Dashboard} exact />
        <PrivateRoute path="/settings" component={Settings} exact />
        <PrivateRoute path="/amazon-inventory" component={AmazonInventory} exact />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
