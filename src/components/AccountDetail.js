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
  Toast
} from 'native-base';

import {
  deleteAccount,
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
  } else if (!/^[a-z]{4}$/.test(values.password)) {
    errors.password = 'Les 4 premières lettres minuscule de votre nom';
  }
  return errors;
};

class AccountDetail extends Component {
  render() {
    return (
      <Container>
        <Header>
          <Left>
            <Button transparent>
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
              Toast.show({
                text: "Identifiant et/ou mot de passe incorrect!",
                type: "warning"
              })
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
                <Item floatingLabel>
                  <Label>Numéro de carte</Label>
                  <Input
                    onChangeText={handleChange('cardId')}
                    onBlur={handleBlur('cardId')}
                    value={values.cardId}
                  />
                </Item>
                {touched.cardId && errors.cardId && (
                  <Label error> {errors.cardId} </Label>
                )}
                <Item floatingLabel last>
                  <Label>Mot de passe</Label>
                  <Input
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                    value={values.password}
                    secureTextEntry={true}
                  />
                </Item>
                {touched.password && errors.password && (
                  <Label>{errors.password}</Label>
                )}
                <Button
                  block
                  primary
                  onPress={handleSubmit}
                  disabled={isSubmitting || !isValid}>
                  <Text>Ajouter</Text>
                  {isSubmitting&& <Spinner />}
                </Button>
              </Form>
            )}
          </Formik>
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = (state) => ({
  accounts: state.accounts,
});

const mapDispatchToProps = (dispatch) => {
  return {
    deleteAccount: (cardId) => dispatch(deleteAccount(cardId)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AccountDetail);
