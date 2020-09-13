import React from 'react';
import {withFormik} from 'formik';
import {connect} from 'react-redux';
import {Item, Label, Input, Form, Button, Text, Spinner,Toast} from 'native-base';
import { useNavigation} from '@react-navigation/native';

import material from '../../native-base-theme/variables/material';

import {
  fetchAccountPending,
  fetchAccountSuccess,
  fetchAccountError,
} from '../actions/accountAction';
import {WS} from '../services';

const formikConfig = {
  displayName: 'AccountForm',
  //enableReinitialize: true,
  mapPropsToValues: () => ({cardId: '', password: ''}),
  // Custom sync validation
  validate: (values, props) => {
    const errors = {};
    if (!values.cardId) {
      errors.cardId = 'Obligatoire';
    } else if (!/^[0-9]{6,7}$/.test(values.cardId)) {
      errors.cardId = 'Le numero à six chiffre inscrit sur votre carte';
    } else if (Object.keys(props.accounts).indexOf(values.cardId) != -1) {
      errors.cardId = 'Carte déja présente';
    }
    if (!values.password) {
      errors.password = 'Obligatoire';
    } else if (!/^[a-zA-Z]{4}$/.test(values.password)) {
      errors.password = 'Les 4 premières lettres de votre nom de famille';
    }
    return errors;
  },
  handleSubmit: async (values, {props, setSubmitting, setFieldError}) => {
    //await new Promise((r) => setTimeout(r, 500));
    //alert(JSON.stringify(values, null, 2));
    values.password = values.password.toLowerCase();
    await props
      .addAccount(values)
      .then((newAccount) => {
        //console.log('addAccount success', newAccount);
        const triggerPostToastClosed = ()=>{}
        const onToastClosed = new Promise(triggerPostToastClosed);
        Toast.show({
          type: 'success',
          text: 'Carte ajoutée!',
          buttonText: 'Ok',
          onClose: () => {
            props.navigation.goBack();
            triggerPostToastClosed();
            setSubmitting(false);
          },
        });
        //return promise resolved only when taost is closed, otherwise setSubmitting go to false
        return onToastClosed;
      })
      .catch((error) => {
        //console.log('addAccount error', error.message);
        setFieldError('general',error.message);
        setSubmitting(false);
      });
  },
};

const AccountForm = (props) => {
  const {
    values,
    touched,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
    isValid,
    resetForm
  } = props;

  return (
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
          secureTextEntry={false}
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
      <Text note style={{color: material.brandDanger}}>
        {errors.general}
      </Text>
    </Form>
  );
};

function loginThunk(credentials) {
  // Redux Thunk will inject dispatch here:
  return (dispatch) => {
    // Perform the actual API call
    return WS.login(credentials.cardId, credentials.password).then(
      (accountData) => {
        console.log('fetchAccountSuccess', accountData);
        return dispatch(fetchAccountSuccess(accountData));
      },
    );
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


//withNavigation no more exist in react navigation
const withNavigation = (Component) => {
  return (props) => {
    const navigation = useNavigation();
    return <Component navigation={navigation} {...props} />;
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withNavigation(withFormik(formikConfig)(AccountForm)));
