using asite.api.Dtos;
using AutoMapper;
using jsite.api.Dtos;
using jsite.api.Models;

namespace jsite.api.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<ArticleDto, Article>().ForMember(x => x.Category, opt => opt.Ignore());
            CreateMap<Article, ArticleDto>().
            ForMember(dest => dest.Category, opt => opt.MapFrom(src => src.Category.Name)
            );
            CreateMap<UserForRegisterDto, User>();
            CreateMap<User, UserForReturnDto>();
            CreateMap<Post, PostDto>();
            CreateMap<PostDto, Post>();
            CreateMap<User, UserForSnakeScoreDto>();
        }
    }
}