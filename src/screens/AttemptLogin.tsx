import React, { useEffect } from 'react';
import { connect, useSelector } from 'react-redux';
import { attemptLogin, fetchConfiguration, getErrors } from '../state/session';
import { FormattedMessage } from 'react-intl.macro';

interface AttemptLoginProps {
  attemptLogin: () => void,
  fetchConfiguration: () => void
};

// This component checks if we are logged in; if yes, set that in the Redux state;
// if no, redirect to the login page. It should only be shown briefly when the app
// starts up.
const AttemptLoginComponent: React.FC<AttemptLoginProps> = (props) => {
  const { attemptLogin, fetchConfiguration } = props;
  const errors = useSelector(getErrors);

  useEffect(() => {
    attemptLogin();
    fetchConfiguration();
  }, [attemptLogin, fetchConfiguration]);

  return (
    <>
      <p>
        <FormattedMessage id="authentication.waiting" defaultMessage="Waiting for authentication..."/>
      </p>
      {errors.map(e => (<p>{e}</p>))}
    </>
  );
}

export default connect<{}, AttemptLoginProps>(
  null,
  {attemptLogin, fetchConfiguration}
)(AttemptLoginComponent);
