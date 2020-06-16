using Newtonsoft.Json.Linq;

namespace jsite.api.GraphQL.Queries
{
  public class GraphQLQuery
  {
    public string OperationName { get; set; }
    public string NamedQuery { get; set; }
    public string Query { get; set; }
    public JObject Variables { get; set; }
  }
}