import React, {Component} from 'react';
import {Formik} from 'formik';
import {connect} from 'react-redux';
import {
  Container,
  Header,
  Content,
  Item,
  Label,
  Input,
  Form,
  Button,
  Text,
  Left,
  Icon,
  Body,
  Title,
  Spinner,
  Toast,
} from 'native-base';

import material from '../../native-base-theme/variables/material';

import {
  fetchAccountPending,
  fetchAccountSuccess,
  fetchAccountError,
} from '../actions/accountAction';
import {WS} from '../services';

// Synchronous validation
const validate = (values, props /* only available when using withFormik */) => {
  const errors = {};

  if (!values.cardId) {
    errors.cardId = 'Obligatoire';
  } else if (!/^[0-9]{6,7}$/.test(values.cardId)) {
    errors.cardId = 'Le numero a six chiffre inscrit sur votre carte';
  }

  if (!values.password) {
    errors.password = 'Obligatoire';
  } else if (!/^[a-zA-Z]{4}$/.test(values.password)) {
    errors.password = 'Les 4 premières lettres de votre nom';
  }
  return errors;
};

function AccountDetail({navigation}) {
  return (
    <Container>
      <Header>
        <Left>
          <Button transparent onPress={() => navigation.navigate('account')}>
            <Icon name="arrow-back" />
          </Button>
        </Left>
        <Body>
          <Title>Ajout de carte</Title>
        </Body>
      </Header>
      <Content padder>
        <Formik
          validate={validate}
          initialValues={{cardId: '', password: ''}}
          onSubmit={async (values) => {
            await new Promise((r) => setTimeout(r, 500));
            //alert(JSON.stringify(values, null, 2));
            values.password = values.password.toLowerCase();
            this.props.addAccount(values);
            //Toast.show({
            //  text: 'Identifiant et/ou mot de passe incorrect!',
            //  type: 'warning',
            //});
          }}>
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            isValid,
            touched,
            values,
            errors,
          }) => (
            <Form>
              <Item floatingLabel error={touched.cardId && !!errors.cardId}>
                <Label>Numéro de carte</Label>
                <Input
                  onChangeText={handleChange('cardId')}
                  onBlur={handleBlur('cardId')}
                  value={values.cardId}
                />
              </Item>
              {touched.cardId && errors.cardId && (
                <Text note style={{color: material.brandDanger}}>
                  {errors.cardId}
                </Text>
              )}
              <Item floatingLabel error={touched.password && !!errors.password}>
                <Label>Mot de passe</Label>
                <Input
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  value={values.password}
                  secureTextEntry={true}
                />
              </Item>
              {touched.password && errors.password && (
                <Text note style={{color: material.brandDanger}}>
                  {errors.password}
                </Text>
              )}
              <Button
                block
                primary
                onPress={handleSubmit}
                disabled={isSubmitting || !isValid}>
                <Text>Ajouter</Text>
                {isSubmitting && <Spinner />}
              </Button>
            </Form>
          )}
        </Formik>
      </Content>
    </Container>
  );
}

export function loginThunk(credentials) {
  // Redux Thunk will inject dispatch here:
  return (dispatch) => {
    // Reducers may handle this to set a flag like isFetching
    dispatch(fetchAccountPending(credentials.cardId));
    // Perform the actual API call
    return WS.login(credentials.cardId, credentials.password)
      .then((accountData) => {
        console.log('fetchAccountSuccess', accountData);
        dispatch(fetchAccountSuccess(accountData));
      })
      .catch((error) => {
        console.log('fetchAccountError', error);
        dispatch(fetchAccountError(credentials.cardId, error));
      });
  };
}

const mapStateToProps = (state) => ({
  accounts: state.accounts,
});

const mapDispatchToProps = (dispatch) => {
  return {
    addAccount: (credentials) => dispatch(loginThunk(credentials)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AccountDetail);
