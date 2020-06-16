using System.Threading.Tasks;
using GraphQL;
using GraphQL.NewtonsoftJson;
using GraphQL.Types;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using jsite.api.GraphQL.Queries;

namespace JsiteBlog.API.Controllers
{
    [Route("graphql")]
    [ApiController]
    [AllowAnonymous]

    public class GraphqlController:ControllerBase
    {
        private readonly ISchema _schema;
        public GraphqlController(ISchema schema)
        {
            _schema = schema;
        }

        [HttpPost]
        public async Task<ActionResult> Post([FromBody] GraphQLQuery query)
        {

            var inputs = query.Variables.ToInputs();

            var result = await new DocumentExecuter().ExecuteAsync(_ =>
            {
                _.Schema = _schema;
                _.Query = query.Query;
                _.OperationName = query.OperationName;
                _.Inputs = inputs;
            });

            if (result.Errors?.Count > 0)
            {
                return BadRequest(result.Errors);
            }

            return Ok(result);
        }
    }
}