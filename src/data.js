import { InMemoryCache }      from 'apollo-cache-inmemory';
import { ApolloClient }       from 'apollo-client';
import { HttpLink }           from 'apollo-link-http';
import { ApolloLink, concat } from 'apollo-link';
import gql                    from 'graphql-tag';

import config                 from './config.json';

const httpLink = new HttpLink({ uri: 'http://165.22.216.90' });

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
