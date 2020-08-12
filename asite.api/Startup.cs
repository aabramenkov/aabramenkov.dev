using AutoMapper;
using jsite.api.Helpers;
using jsite.api.Models;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using jsite.api.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Net;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.AspNetCore.Identity;
using jsite.api.GraphQL.GraphTypes;
using GraphQL.Types;
using jsite.api.GraphQL.Schemas;
using jsite.api.GraphQL.Queries;
using Microsoft.AspNetCore.Server.Kestrel.Core;
using GraphQL.Server.Ui.GraphiQL;
using jsite.api.GraphQL.GraphInputTypes;
using Renju.HubConfig;
using Renju;

namespace jsite.api
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        public void ConfigureDevelopmentServices(IServiceCollection services)
        {
            services.AddDbContext<DataContext>(x =>
            {
                // x.UseLazyLoadingProxies();
                x.UseMySql(Configuration.GetConnectionString("DefaultConnectoin"));
            });

            services.Configure<KestrelServerOptions>(options =>
            {
                options.AllowSynchronousIO = true;
            });


            ConfigureServices(services);
        }

        public void ConfigureProductionServices(IServiceCollection services)
        {
            services.AddDbContext<DataContext>(x =>
            {
                x.UseLazyLoadingProxies();
                x.UseMySql(Configuration.GetConnectionString("DefaultConnectoin"));
            });

            ConfigureServices(services);
            ConfigureGraphQL(services);
        }


        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddResponseCompression(options => options.EnableForHttps = true);

            IdentityBuilder builder = services.AddIdentityCore<User>(opt =>
            {
                opt.Password.RequireDigit = false;
                opt.Password.RequiredLength = 4;
                opt.Password.RequireNonAlphanumeric = false;
                opt.Password.RequireUppercase = false;
            });

            builder = new IdentityBuilder(builder.UserType, typeof(Role), builder.Services);
            builder.AddEntityFrameworkStores<DataContext>();
            builder.AddRoleValidator<RoleValidator<Role>>();
            builder.AddRoleManager<RoleManager<Role>>();
            builder.AddSignInManager<SignInManager<User>>();

            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                            .AddJwtBearer(options =>
                            {
                                options.TokenValidationParameters = new TokenValidationParameters
                                {
                                    ValidateIssuerSigningKey = true,
                                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII
                                        .GetBytes(Configuration.GetSection("AppSettings:Token").Value)),
                                    ValidateIssuer = false,
                                    ValidateAudience = false
                                };
                            });
            services.AddAuthorization(options =>
            {
                options.AddPolicy("Admin", policy => policy.RequireRole("Admin"));
                options.AddPolicy("Vip", policy => policy.RequireRole("VIP"));
                options.AddPolicy("AdminOrModerator", policy => policy.RequireRole("Admin", "Moderator"));
                options.AddPolicy("All", policy => policy.RequireRole("Admin", "Moderator","User", "VIP"));
            });

            services.AddMvc(option =>
            {
                option.EnableEndpointRouting = false;
                var policy = new AuthorizationPolicyBuilder()
                    .RequireAuthenticatedUser()
                    .Build();
                option.Filters.Add(new AuthorizeFilter(policy));
            }).AddNewtonsoftJson(opt =>
             {
                 opt.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
             });

            services.AddCors();
            services.AddAutoMapper(typeof(ArticleRepository).Assembly);
            services.Configure<CloudinarySettings>(Configuration.GetSection("CloudinarySettings"));
            services.AddScoped<IArticleRepository, ArticleRepository>();
            services.AddScoped<ICategoryRepository, CategoryRepository>();
            services.AddScoped<IPostRepository, PostRepository>();

            services.AddSignalR();
            services.AddSingleton<IConnectionManager, ConnectionManager>();

        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, DataContext dataContext)
        {
            app.UseResponseCompression();
            //dataContext.Database.Migrate();
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler(builder =>
                {
                    builder.Run(async context =>
                    {
                        context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

                        var error = context.Features.Get<IExceptionHandlerFeature>();
                        if (error != null)
                        {
                            context.Response.AddApplicationError(error.Error.Message);
                            await context.Response.WriteAsync(error.Error.Message);
                        }
                    });
                });

            }
            app.UseRouting();
            // app.UseCors(x => x.WithOrigins("https://localhost:4200", "https://aabramenkov.dev").AllowAnyMethod().AllowAnyHeader());
            app.UseCors(x => x.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
            app.UseAuthentication();
            app.UseAuthorization();
            app.UseDefaultFiles();
            app.UseStaticFiles();
            //app.UseMvc();
            app.UseGraphiQLServer( new GraphiQLOptions{Path ="/graphql"});

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapHub<RenjuHub>("/renju");
                endpoints.MapFallbackToController("Index", "Fallback");
            });
        }

        private void ConfigureGraphQL(IServiceCollection services)
        {
            services.AddScoped<ISchema, SchemaMain>();
            services.AddScoped<QueryUser>();
            services.AddScoped<MutationUser>();

            services.AddScoped<PostCategoryType>();
            services.AddScoped<UserType>();
            services.AddScoped<PostType>();
            services.AddScoped<CommentType>();
            services.AddScoped<ChildCommentType>();

            services.AddScoped<PostCategoryInputType>();
            services.AddScoped<CommentInputType>();
            services.AddScoped<PostInputType>();
            services.AddScoped<ChildCommentInputType>();
            //services.AddGraphQL();
        }

    }
}
