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

export const AUTHOR = gql`
  query ($id: String!) {
    author(id: $id) {
      imgUrl
      job
      name
      summary
      url
      wikiUrl
    }
  }
`;

export const AUTHOR_BY_NAME = gql`
  query ($name: String!) {
    authorByName(name: $name) {
      id
    }
  }
`;

export const CREATE_QUOTIDIAN = gql`
  mutation ($lang: String!, $quoteId: String!, $targetDate: String) {
    createQuotidian(lang: $lang, quoteId: $quoteId, targetDate: $targetDate) {
      id
      date
    }
  }
`;

export const CREATE_TEMP_QUOTE = gql`
  mutation (
    $authorImgUrl: String,
    $authorJob: String,
    $authorName: String,
    $authorSummary: String,
    $authorUrl: String,
    $authorWikiUrl: String,
    $comment: String,
    $lang: String,
    $name: String!
    $origin: String,
    $refName: String,
    $refLang: String,
    $refUrl: String,
    $topics: [String!],
  ) {

    createTempQuote(
      authorImgUrl: $authorImgUrl
      authorJob: $authorJob
      authorName: $authorName
      authorSummary: $authorSummary
      authorUrl: $authorUrl
      authorWikiUrl: $authorWikiUrl
      comment: $comment
      lang: $lang
      name: $name
      origin: $origin
      refName: $refName
      refLang: $refLang
      refUrl: $refUrl
      topics: $topics
    ) {
      id
      date
      name
      validation {
        date
        status
      }
    }
  }
`;

export const DELETE_ACCOUNT = gql`
  mutation ($password: String!) {
    deleteAccount(password: $password) {
      id
      name
    }
  }
 `;

 export const DELETE_AUTHOR = gql`
  mutation ($id: String!) {
    deleteAuthor(id: $id) {
      name
    }
  }
 `;

 export const DELETE_QUOTE = gql`
  mutation ($id: String!) {
    deleteQuote(id: $id) {
      id
    }
  }
 `;

export const DELETE_QUOTIDIAN = gql`
  mutation ($id: String!) {
    deleteQuotidian(id: $id) {
      id
      date
      quote {
        id
      }
    }
  }
`;

export const DELETE_TEMP_QUOTE_ADMIN = gql`
  mutation ($id: String!) {
    deleteTempQuoteAdmin(id: $id) {
      id
    }
  }
`;

export const FORGET_PASSWORD_STEP_ONE = gql`
  query ($email: String!) {
    forgetPasswordStepOne(email: $email)
  }
`;

export const FORGET_PASSWORD_STEP_TWO = gql`
  mutation ($emailToken: String!, $newPassword: String!) {
    forgetPasswordStepTwo(
      emailToken: $emailToken,
      newPassword: $newPassword
    ) {
      id
      token
    }
  }
`;

export const IS_EMAIL_VALID = gql`
  query ($email: String!) {
    isEmailValid(email: $email) {
      bool
      message
    }
  }
`;

export const IS_NAME_VALID = gql`
  query ($name: String!) {
    isNameValid(name: $name) {
      bool
      message
    }
  }
`;

export const IS_PASSWORD_VALID = gql`
  query ($password: String!) {
    isPasswordValid(password: $password) {
      bool
      message
    }
  }
`;

export const LIST_AUTHORS = gql`
  query ($limit: Float, $order: Float, $skip: Float) {
    authors(limit: $limit, order: $order, skip: $skip) {
      entries {
        id
        imgUrl
        name
      }
    }
  }
`;

export const PUBLISHED_QUOTES_ADMIN = gql`
  query ($lang: String, $limit: Float, $skip: Float) {
    publishedQuotesAdmin(lang: $lang, limit: $limit, skip: $skip) {
      entries {
        id
        author { name }
        lang
        name
        topics
      }
      pagination {
        hasNext
        limit
        skip
        nextSkip
      }
    }
  }
`;

export const QUOTES_BY_AUTHOR_ID = gql`
  query ($authorId: String!) {
    quotesByAuthorId(authorId: $authorId) {
      entries {
        name
      }
      pagination {
        hasNext
        limit
        skip
        nextSkip
      }
    }
  }
`;

export const QUOTIDIAN = gql`
  query {
    quotidian {
      id
      date
      quote {
        author {
          id
          name
          imgUrl
        }
        name
        references { name }
      }
    }
  }
`;

export const QUOTIDIANS = gql`
  query ($limit: Float, $skip: Float) {
    quotidians(limit: $limit, skip: $skip) {
      entries {
        id
        date
        quote {
          id
          author { name }
          name
        }
      }
      pagination {
        hasNext
        limit
        skip
        nextSkip
      }
    }
  }
`;

export const RANDOM_QUOTE = gql`
  query ($lang: String!) {
    randomQuote(lang: $lang) {
      author { name }
      name
      references { name }
      topics
    }
  }
`;

export const SEND_EMAIL_VERIFICATION = gql`
  query {
    sendEmailVerification
  }
`;

export const SET_VALIDATION_STATUS_ADMIN = gql`
  mutation ($id: String!, $status: String!) {
    setValidationStatusAdmin(id: $id, status: $status) {
      validation {
        status
      }
    }
  }
`;

export const SIGNUP = gql`
  mutation ($email: String!, $password: String!, $name: String!) {
    signup(email: $email, password: $password, name: $name) {
      id
      imgUrl
      email
      lang
      name
      rights
      token
    }
  }
`;

export const SIGNIN = gql`
  mutation ($email: String!, $password: String!) {
    signin(email: $email, password: $password) {
      id
      imgUrl
      email
      lang
      name
      rights
      token
    }
  }
`;

export const TEMP_QUOTE_ADMIN = gql`
  query($id: String!) {
    tempQuoteAdmin(id: $id) {
      id
      author {
        imgUrl
        job
        name
        summary
        url
        wikiUrl
      }
      date
      lang
      name
      origin
      topics
    }
  }
`;

export const TEMP_QUOTES_ADMIN = gql`
  query ($limit: Float, $skip: Float) {
    tempQuotesAdmin(limit: $limit, skip: $skip) {
      entries {
        id
        name
        author {
          name
        }
        topics
        validation {
          status
        }
      }
      pagination {
        hasNext
        limit
        skip
        nextSkip
      }
    }
  }
`;

export const TINY_LIST_AUTHORS = gql`
  query {
    authors(limit: 3) {
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

export const UPDATE_AUTHOR = gql`
  mutation (
    $id: String!
    $imgUrl: String!
    $job: String!
    $name: String!
    $summary: String!
    $url: String!
    $wikiUrl: String!
  ) {
    updateAuthor(
      id: $id
      imgUrl: $imgUrl
      job: $job
      name: $name
      summary: $summary
      url: $url
      wikiUrl: $wikiUrl
    ) {
      id
    }
  }
`;

export const UPDATE_EMAIL_STEP_ONE = gql`
  query($newEmail: String!) {
    updateEmailStepOne(newEmail: $newEmail)
  }
`;

export const UPDATE_EMAIL_STEP_TWO = gql`
  mutation($emailToken: String!) {
    updateEmailStepTwo(emailToken: $emailToken) {
      email
      token
    }
  }
`;

export const UPDATE_IMG_URL = gql`
  mutation ($imgUrl: String!) {
    updateImgUrl(imgUrl: $imgUrl) {
      imgUrl
    }
  }
`;

export const UPDATE_LANG = gql`
  mutation($lang: String!) {
    updateLang(lang: $lang) {
      id
      lang
      token
    }
  }
`;

export const UPDATE_NAME = gql`
  mutation($name: String!) {
    updateName(name: $name) {
      id
      name
      rights
      token
    }
  }
`;

export const UPDATE_PASSWORD = gql`
  mutation($oldPassword: String!, $newPassword: String!) {
    updatePassword(oldPassword: $oldPassword, newPassword: $newPassword) {
      token
    }
  }
`;

export const UPDATE_QUOTIDIAN = gql`
  mutation($id: String!, $quoteId: String, $targetDate: String) {
    updateQuotidian(id: $id, quoteId: $quoteId, targetDate: $targetDate) {
      id
      date
      quoteId
    }
  }
`;

export const UPDATE_TEMP_QUOTE_ADMIN = gql`
  mutation (
    $id: String!
    $authorJob: String
    $authorImgUrl: String
    $authorName: String
    $authorSummary: String
    $authorUrl: String
    $authorWikiUrl: String
    $comment: String
    $lang: String
    $name: String!
    $origin: String
    $refName: String
    $refLang: String
    $refUrl: String
    $topics: [String!]
  ) {
    updateTempQuoteAdmin(
      id: $id
      authorJob: $authorJob
      authorImgUrl: $authorImgUrl
      authorName: $authorName
      authorSummary: $authorSummary
      authorUrl: $authorUrl
      authorWikiUrl: $authorWikiUrl
      comment: $comment
      lang: $lang
      name: $name
      origin: $origin
      refName: $refName
      refLang: $refLang
      refUrl: $refUrl
      topics: $topics
    ) {
      id
      date
      name
      validation {
        date
        status
      }
    }
  }
`;

export const VALIDATE_TEMP_QUOTE_ADMIN = gql`
  mutation ($id: String!) {
    validateTempQuoteAdmin(id: $id) {
      id
    }
  }
`;

export const VERIFY_EMAIL = gql`
  mutation ($emailToken: String!) {
    verifyEmail(emailToken: $emailToken) {
      id
      email
      name
      emailConfig { isVerified }
    }
  }
`;