import React from 'react';
import { connect } from 'react-redux';
import { attemptLogin, fetchConfiguration } from '../state/session';
import { FormattedMessage } from 'react-intl.macro';

interface AttemptLoginProps {
  attemptLogin: () => void,
  fetchConfiguration: () => void
};

// This component checks if we are logged in; if yes, set that in the Redux state;
// if no, redirect to the login page. It should only be shown briefly when the app
// starts up.
class AttemptLoginComponent extends React.Component<AttemptLoginProps, {}> {
  componentDidMount() {
    this.props.attemptLogin();
    this.props.fetchConfiguration();
  }

  render() {
    return <p>
       <FormattedMessage id="authentication.waiting" defaultMessage="Waiting for authentication..."/>

    </p>;
  }
}

export default connect<{}, AttemptLoginProps>(
  null,
  {attemptLogin, fetchConfiguration}
)(AttemptLoginComponent);
