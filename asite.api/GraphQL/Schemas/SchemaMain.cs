using System;
using GraphQL.Types;
using GraphQL.Utilities;
using jsite.api.GraphQL.Queries;

namespace jsite.api.GraphQL.Schemas
{
    public class SchemaMain : Schema
    {
        public SchemaMain(IServiceProvider services) : base(services)
        {
            Query = (IObjectGraphType)services.GetRequiredService(typeof(QueryUser));
            Mutation = (IObjectGraphType)services.GetRequiredService(typeof(MutationUser));
        }
    }
}