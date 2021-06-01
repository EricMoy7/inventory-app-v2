import React, { FC, useEffect, FormEvent, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Message from '../UI/Message';
import { setSuccess } from '../../store/actions/authActions';
import { RootState } from '../../store';

import Input from '../UI/Input';
import Button from '../UI/Button';

import Axios from 'axios';
import apiUrl from '../../config';

const Dashboard: FC = () => {
  const { user, needVerification, success } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  const [sellerId, setSellerId] = useState('');
  const [mwsAuthToken, setMwsAuthToken] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if(success) {
      dispatch(setSuccess(''));
    }
  }, [success, dispatch]);

  const submitHandler = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    setLoading(true)
    await Axios.post(`${apiUrl()}/createUserCreds`, {
            uid: user?.id,
            sellerId: sellerId,
            mwsAuthToken: mwsAuthToken
    })
    setLoading(false)
  }

  return(
    <section className="section">
      <div className="container">
        {needVerification && <Message type="success" msg="Please verify your email address." />}
        <h2 className="has-text-centered is-size-2 mb-3">Amazon Authentication</h2>
        <form className="form" onSubmit={submitHandler}>
            <Input 
                name="sellerId" 
                value={sellerId} 
                onChange={(e) => setSellerId(e.currentTarget.value) }
                placeholder="Enter Seller ID"
                label="Seller ID"
            />

            <Input 
                name="mwsAuthToken" 
                value={mwsAuthToken} 
                onChange={(e) => setMwsAuthToken(e.currentTarget.value) }
                placeholder="Enter MWS Authentication Token"
                label="Mms Authentication Token"
            />

            <Button text={loading ? "Loading..." : "Set Credentials"} className="is-primary is-fullwidth mt-5" disabled={loading} />
        </form>
      </div>
    </section>
  );
}

export default Dashboard;