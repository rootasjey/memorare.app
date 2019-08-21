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
    }
  });

  return forward(operation);
});

export const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: concat(authMiddleware, httpLink),
});

export const QUOTIDIAN = gql`
  {
    quotidian {
      name
      author
      references
    }
  }
`;

export const LIST_AUTHORS = gql`
  {
    listAuthors(limit: 10) {
      entries {
        name
        imgUrl
      }
    }
  }
`;

export const TINY_LIST_AUTHORS = gql`
  {
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
