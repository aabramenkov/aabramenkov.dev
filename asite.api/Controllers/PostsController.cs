using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using jsite.api.Data;
using jsite.api.Dtos;
using jsite.api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace jsite.api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Policy = "All")]
    public class PostsController : ControllerBase
    {
        private readonly IPostRepository _repo;
        private readonly IMapper _mapper;
        public PostsController(IPostRepository repo, IMapper mapper)
        {
            _mapper = mapper;
            _repo = repo;
        }

        [HttpGet]
        public async Task<IActionResult> GetPosts(){
            var posts = await _repo.GetPosts();
            var postsToReturn = _mapper.Map<IEnumerable<PostDto>>(posts);
            return Ok(postsToReturn);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetPost(int id){
            var post  = await _repo.GetPost(id);
            var postToReturn = _mapper.Map<PostDto>(post);
            return Ok(postToReturn);
        }

        [HttpPut("update/{id}")]
        [Authorize(Policy = "AdminOrModerator")]
        public async Task<IActionResult> UpdatePost(int id, [FromBody] PostDto postDto)
        {
            if (id!=postDto.Id)
            return BadRequest("id!=PostDto.Id");
            
            var post = await _repo.GetPost(postDto.Id);
            if (post is null)
                return BadRequest("post is null");

            post = _mapper.Map(postDto, post);
            var result = await _repo.SaveAll();
            if (result)
                return Ok(postDto);
            return BadRequest("Post was not saved");
        }

        [HttpPost("add")]
        [Authorize(Policy = "AdminOrModerator")]
        public async Task<IActionResult> AddPost([FromBody] PostDto postDto){
            var post = _mapper.Map<Post>(postDto);
            _repo.Add(post);
            var result = await _repo.SaveAll();
            if (result)
            return Ok(post);
            return BadRequest("Post was not added");
        }

    }
}