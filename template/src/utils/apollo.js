import { ApolloClient, InMemoryCache, ApolloLink } from '@apollo/client'
import { onError } from '@apollo/client/link/error'
import { setContext } from '@apollo/client/link/context'
import { createUploadLink } from 'apollo-upload-client'

const uri = '/graphql'
export const host = 'http://localhost:4000'

const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem('token')
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : ''
        }
    }
})

const errorLink = onError(({ graphQLErrors, networkError, forward, operation }) => {
    if (graphQLErrors) {
        graphQLErrors.map(async ({ message, locations, path }) => {
            console.error(
                `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
            )
        })
    }
    if (networkError) console.error(`[Network error]: ${networkError}`)
})

const uploadLink = createUploadLink({
    uri,
    credentials: 'include'
})

const link = ApolloLink.from([errorLink, authLink, uploadLink])

const client = new ApolloClient({
    link,
    cache: new InMemoryCache()
})

export default client
