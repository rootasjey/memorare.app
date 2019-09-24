import { InMemoryCache }      from 'apollo-cache-inmemory';
import { ApolloClient }       from 'apollo-client';
import { HttpLink }           from 'apollo-link-http';
import { ApolloLink, concat } from 'apollo-link';
import gql                    from 'graphql-tag';

import config                 from './config.json';

const httpLink = new HttpLink({ uri: config.url });

const authMiddleware = new ApolloLink((operation, forward) => {
  operation.setContext({
    headers: {
      apikey: config.apikey,
      token: localStorage.getItem('token'),
    }
  });

  return forward(operation);
});

export const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: concat(authMiddleware, httpLink),
});

export const CHECK_EMAIL = gql`
  mutation ($userId: String!, $token: String!) {
    checkEmail(userId: $userId, token: $token) {
      _id
      name
      emailConfig { isVerified }
    }
  }
`;

export const IS_EMAIL_VALID = gql`
  query ($email: String!) {
    isEmailValid(email: $email)
  }
`;

export const IS_NAME_VALID = gql`
  query ($name: String!) {
    isNameValid(name: $name)
  }
`;

export const IS_PASSWORD_VALID = gql`
  query ($password: String!) {
    isPasswordValid(password: $password)
  }
`;

export const LIST_AUTHORS = gql`
  query {
    listAuthors(limit: 10) {
      entries {
        name
        imgUrl
      }
    }
  }
`;

export const QUOTIDIAN = gql`
  query {
    quotidian {
      name
      author
      references
    }
  }
`;

export const SEND_EMAIL_VERIFICATION = gql`
  query ($userId: String!) {
    sendEmailVerification(userId: $userId)
  }
`;

export const SIGNUP = gql`
  mutation ($email: String!, $password: String!, $name: String!) {
    signup(email: $email, password: $password, name: $name) {
      _id
      email
      name
      token
    }
  }
`;

export const SIGNIN = gql`
  mutation ($login: String!, $pass: String!) {
    signin(login: $login, pass: $pass) {
      _id
      email
      name
      token
    }
  }
`;

export const TINY_LIST_AUTHORS = gql`
  query {
    listAuthors(limit: 3) {
      entries {
        name
        imgUrl
        quotes(limit: 1) {
          name
        }
      }
    }
  }
`;

export const TIP = gql`
  query {
    tip {
      name
    }
  }
`;
