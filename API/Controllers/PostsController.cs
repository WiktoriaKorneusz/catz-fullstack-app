using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using API.DTOs;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;


namespace API.Controllers
{
    [Authorize]
    public class PostsController : BaseController
    {
        private readonly IPostRepository _postRepository;
        private readonly IMapper _mapper;

        public PostsController(IPostRepository postRepository, IMapper mapper)
        {
            _postRepository = postRepository;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<PostDisplayDto>>> GetPosts()
        {
            var posts = await _postRepository.GetPostsDisplayAsync();
            return Ok(posts);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<PostDisplayDto>> GetPost(int id)
        {
            var post = await _postRepository.GetPostDisplayByIdAsync(id);
            return Ok(post);



        }

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdatePost(PostUpdateDto postUpdateDto, int id)
        {
            var post = await _postRepository.GetPostByIdAsync(id);
            if (post == null) return NotFound();

            var username = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (post.User.UserName != username) return Unauthorized(); // Make sure this line correctly accesses the UserName

            _mapper.Map(postUpdateDto, post);

            if (await _postRepository.SaveAllAsync()) return NoContent();
            return BadRequest("Couldn't update post");
        }

    }
}