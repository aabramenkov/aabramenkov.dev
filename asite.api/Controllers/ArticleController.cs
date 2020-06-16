using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using jsite.api.Dtos;
using jsite.api.Models;
using Microsoft.AspNetCore.Mvc;
using jsite.api.Data;
using Microsoft.AspNetCore.Authorization;
using System.Linq;
using System.Globalization;

namespace jsite.api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ArticleController : ControllerBase
    {
        private readonly IArticleRepository _repo;
        private readonly IMapper _mapper;
        public ArticleController(IArticleRepository repo, IMapper mapper)
        {
            _mapper = mapper;
            _repo = repo;
        }

        [HttpGet("bycategory/{categoryName}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetArticlesByCategory(string categoryName){
            TextInfo ti = CultureInfo.CurrentCulture.TextInfo;
            categoryName = ti.ToTitleCase(categoryName);
            var articles = await _repo.GetArticlesByCategory(categoryName);
            var articlesToReturn = _mapper.Map<IEnumerable<ArticleDto>>(articles);

            return Ok(articlesToReturn);
        }


        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetArticle(int id)
        {
            var article = await _repo.GetArticle(id);
            var articlesToReturn = _mapper.Map<ArticleDto>(article);
            return Ok(articlesToReturn);
        }

        [HttpPost("create")]
        [Authorize(Policy = "AdminOrModerator")]
        public async Task<IActionResult> CreateArticle([FromBody] ArticleDto articleDto)
        {
            var articleFromRepo = await _repo.GetArticle(articleDto.Id);
            if (articleFromRepo != null)
                return BadRequest("this article already exists in the database");

            var article = _mapper.Map<Article>(articleDto);
            _repo.Add(article);
            if (await _repo.SaveAll())
                return Ok(article);

            return BadRequest();
        }

        [HttpPut("update/{id}")]
        [Authorize(Policy = "AdminOrModerator")]
        public async Task<IActionResult> UpdateArticle(int id, [FromBody] ArticleDto articleDto)
        {
            if (id!=articleDto.Id)
            return BadRequest("id!=articleDto.Id");
            
            var article = await _repo.GetArticle(articleDto.Id);
            if (article is null)
                return BadRequest("article is null");

            article = _mapper.Map(articleDto, article);
            var result = await _repo.SaveAll();
            if (result)
                return Ok(article);
            return BadRequest("Article was not saved");
        }

    }
}