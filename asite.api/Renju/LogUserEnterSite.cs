using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.Filters;
using Renju.Models;

namespace Renju
{
    public class LogUserEnterSite : IActionFilter
    {
        public void OnActionExecuted(ActionExecutedContext context)
        {
            // throw new System.NotImplementedException();
        }

        public void OnActionExecuting(ActionExecutingContext context)
        {
            var id = context.HttpContext.Connection.Id;
            bool alreadyExists = ActiveUsersService.GetActiveGamers().Any(x => x.Id == id);
            if (!alreadyExists)
            {
                Gamer gamer = new Gamer { Id = id, UserName = "UserName" };
                var a = ActiveUsersService.AddActiveGamer(gamer);
            }

        }

        //public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        // {


        // var resultContext = await next();

        // var userId = int.Parse(resultContext.HttpContext.User
        //     .FindFirst(ClaimTypes.NameIdentifier).Value);
        // var repo = resultContext.HttpContext.RequestServices.GetService<IDatingRepository>();
        // var user = await repo.GetUser(userId);
        // user.LastActive = DateTime.Now;
        // await repo.SaveAll();
        // }

    }
}