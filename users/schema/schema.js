const graphql = require('graphql');
const _ = require('lodash');
const axios = require('axios');

const { 
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList
} = graphql;

const CompanyType = new GraphQLObjectType({
    name: 'Company',
    fields:() => ({
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        users: {
            type: new GraphQLList(UserType),
            resolve(pv, args){
                return axios.get(`http://127.0.0.1:3000/companies/${pv.id}/users`).then(r => r.data)
            }
        }
    })
})

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: GraphQLString},
        firstName: { type: GraphQLString},
        age: { type: GraphQLInt },
        company: {
            type: CompanyType,
            resolve(parentValue, args){
                return axios
                    .get(`http://127.0.0.1:3000/companies/${parentValue.companyId}`)
                    .then(r => r.data);
            }
        }
    })
})

const users = [
    { id: '23', firstName: 'Bill', age: 20},
    { id: '47', firstName: 'Samantha', age: 21}
]

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        user: {
            type: UserType,
            args: { id: { type: GraphQLString } },
            resolve:async(parentValue, args) => {
                const res = await axios.get(`http://127.0.0.1:3000/users/${args.id}`);
                return res.data;
            }
        },
        company: {
            type: CompanyType,
            args: { id: { type: GraphQLString } },
            resolve(parentValue, args){
                return axios.get(`http://localhost:3000/companies/${args.id}`).then(r => r.data);
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery
})