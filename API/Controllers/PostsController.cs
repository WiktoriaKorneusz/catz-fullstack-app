using API.DTOs;
using API.Extensions;
using API.Interfaces;
using API.Models;
using API.Helpers;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;


namespace API.Controllers
{
    [Authorize]

    public class PostsController(IUnitOfWork unitOfWork, IPhotoService photoService, IMapper mapper) : BaseController
    {

        [HttpGet]
        public async Task<ActionResult<IEnumerable<PostDisplayDto>>> GetPosts()
        {
            var posts = await unitOfWork.PostRepository.GetPostsDisplayAsync();
            return Ok(posts);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<PostDisplayDto>> GetPost(int id)
        {
            var post = await unitOfWork.PostRepository.GetPostDisplayByIdAsync(id);
            if (post == null)
            {
                return NotFound();
            }
            return Ok(post);
        }
        [HttpGet("user/{userId:int}")]
        public async Task<ActionResult<PostDisplayDto>> GetUserPosts([FromQuery] PaginationParams paginationParams, int userId)
        {
            var posts = await unitOfWork.PostRepository.GetUserPosts(userId, paginationParams);
            Response.AddPaginationHeader(new PaginationHeader(posts.CurrentPage, posts.PageSize, posts.TotalCount, posts.TotalPages));


            return Ok(posts);
        }

        [HttpPost("add-post")]
        public async Task<ActionResult<PostDisplayDto>> AddPost([FromForm] PostUpdateDto postDto, List<IFormFile> photos)
        {

            var user = await unitOfWork.UserRepository.GetUserByUsernameAsync(User.GetUsername());
            if (user == null) return Unauthorized();

            if (photos.Count == 0) return BadRequest("No photos selected");
            if (photos.Count > 5) return BadRequest("You can't upload more than 5 photos");

            List<Photo> photoList = new List<Photo>();

            foreach (var file in photos)
            {
                var result = await photoService.AddPhotoAsync(file);
                if (result.Error != null) return BadRequest(result.Error.Message);
                var fullUrl = result.SecureUrl.AbsoluteUri;

                var parts = fullUrl.Split('/');
                var versionIndex = Array.FindIndex(parts, part => part.StartsWith('v') && part.Skip(1).All(char.IsDigit));
                var desiredUrl = string.Join("/", parts.Skip(versionIndex));

                var photo = new Photo
                {
                    Url = desiredUrl,
                    PublicId = result.PublicId
                };


                photoList.Add(photo);
            }

            var post = new Post
            {
                Content = postDto.Content,
                Photos = photoList
            };

            user.Posts.Add(post);

            if (await unitOfWork.Complete())
            {
                var createdPost = await unitOfWork.PostRepository.GetPostDisplayByIdAsync(post.Id);
                return CreatedAtAction(nameof(GetPost), new { id = post.Id }, createdPost);

            }


            return BadRequest("Couldn't add post");
        }

        // [HttpPut("{id}")]
        // public async Task<ActionResult> UpdatePost(PostUpdateDto postUpdateDto, int id)
        // {
        //     var post = await unitOfWork.PostRepository.GetPostByIdAsync(id);
        //     if (post == null) return NotFound();

        //     var username = User.GetUsername();
        //     if (post.User.UserName != username) return Unauthorized();

        //     mapper.Map(postUpdateDto, post);

        //     post.IsApproved = false;
        //     post.Created = DateTime.UtcNow;


        //     if (await unitOfWork.Complete()) return NoContent();
        //     return BadRequest("Couldn't update post");
        // }
        [HttpPut("{postId:int}")]
        public async Task<ActionResult> UpdatePost(int postId, [FromForm] PostUpdateDto postUpdateDto, List<IFormFile> photos = null)
        {

            var post = await unitOfWork.PostRepository.GetPostByIdAsync(postId);
            if (post == null) return NotFound();

            var user = await unitOfWork.UserRepository.GetUserByUsernameAsync(User.GetUsername());
            if (user == null || post.User.UserName != user.UserName) return Unauthorized();

            // photos = photos ?? new List<IFormFile>();
            photos ??= new List<IFormFile>();


            if (photos.Count + post.Photos.Count == 0) return BadRequest("No photos selected");
            if (photos.Count + post.Photos.Count > 5) return BadRequest("You can't upload more than 5 photos");

            if (string.IsNullOrEmpty(postUpdateDto.Content.Trim())) return BadRequest("Post content can't be empty");

            foreach (var file in photos)
            {
                var result = await photoService.AddPhotoAsync(file);
                if (result.Error != null) return BadRequest(result.Error.Message);
                var fullUrl = result.SecureUrl.AbsoluteUri;

                var parts = fullUrl.Split('/');
                var versionIndex = Array.FindIndex(parts, part => part.StartsWith('v') && part.Skip(1).All(char.IsDigit));
                var desiredUrl = string.Join("/", parts.Skip(versionIndex));

                var photo = new Photo
                {
                    Url = desiredUrl,
                    PublicId = result.PublicId
                };


                post.Photos.Add(photo);

            }

            mapper.Map(postUpdateDto, post);

            post.IsApproved = false;
            post.Created = DateTime.UtcNow;


            if (await unitOfWork.Complete()) return NoContent();
            return BadRequest("Couldn't update post");
        }

        [HttpDelete("delete-post/{id}")]
        public async Task<ActionResult> DeletePost(int id)
        {
            var post = await unitOfWork.PostRepository.GetPostByIdAsync(id);
            if (post == null) return NotFound();

            var username = User.GetUsername();
            if (post.User.UserName != username) return Unauthorized();

            var user = await unitOfWork.UserRepository.GetUserByUsernameAsync(username);
            if (user == null) return Unauthorized();

            foreach (var photo in post.Photos)
            {
                var result = await photoService.DeletePhotoAsync(photo.PublicId);
                if (result.Error != null) return BadRequest(result.Error.Message);
            }
            user.Posts.Remove(post);
            if (await unitOfWork.Complete()) return NoContent();
            return BadRequest("Couldn't delete post");

        }
        [HttpPost("add-photo/{id}")]
        public async Task<ActionResult<PostDisplayDto>> AddPhoto(IFormFile file, int id)
        {
            var post = await unitOfWork.PostRepository.GetPostByIdAsync(id);
            if (post == null) return NotFound();

            var username = User.GetUsername();
            if (post.User.UserName != username) return Unauthorized();
            var user = await unitOfWork.UserRepository.GetUserByUsernameAsync(username);
            if (user == null) return Unauthorized();

            var result = await photoService.AddPhotoAsync(file);

            if (result.Error != null) return BadRequest(result.Error.Message);
            var fullUrl = result.SecureUrl.AbsoluteUri;

            var parts = fullUrl.Split('/');

            var versionIndex = Array.FindIndex(parts, part => part.StartsWith('v') && part.Skip(1).All(char.IsDigit));

            var desiredUrl = string.Join("/", parts.Skip(versionIndex));


            var photo = new Photo
            {
                Url = desiredUrl,
                // Url = result.SecureUrl.AbsolutePath,

                PublicId = result.PublicId
            };
            if (user.Posts.Count == 0) photo.IsMain = true;
            if (post.Photos.Count >= 5) return BadRequest("user can't have more than 5 photos"); ;


            post.Photos.Add(photo);
            post.IsApproved = false;
            post.Created = DateTime.UtcNow;



            if (await unitOfWork.Complete())
            {
                var createdPost = await unitOfWork.PostRepository.GetPostDisplayByIdAsync(post.Id);
                return CreatedAtAction(nameof(GetPost), new { id = post.Id }, createdPost);
            }

            return BadRequest("Couldn't add post");
        }

        [HttpPut("set-main-photo/{postId}/{photoId}")]
        public async Task<ActionResult> SetMainPhoto(int postId, int photoId)
        {
            var post = await unitOfWork.PostRepository.GetPostByIdAsync(postId);
            if (post == null) return NotFound();

            var username = User.GetUsername();
            if (post.User.UserName != username) return Unauthorized();

            var user = await unitOfWork.UserRepository.GetUserByUsernameAsync(username);
            if (user == null) return Unauthorized();

            var photo = post.Photos.FirstOrDefault(x => x.Id == photoId);
            if (photo == null) return NotFound();

            if (photo.IsMain)
            {
                return BadRequest("This photo is already the main photo.");
            }

            // Find any existing main photo across all posts and set IsMain to false
            var currentMainPhoto = user.Posts.SelectMany(p => p.Photos).FirstOrDefault(p => p.IsMain);
            if (currentMainPhoto != null)
            {
                currentMainPhoto.IsMain = false;

            }

            // Set the new main photo
            photo.IsMain = true;

            // Save changes
            if (await unitOfWork.Complete())
            {
                return NoContent();

            }

            return BadRequest("Could not set the main photo.");
        }


        [HttpDelete("delete-photo/{postId}/{photoId}")]
        public async Task<ActionResult> DeletePhoto(int postId, int photoId)
        {
            var post = await unitOfWork.PostRepository.GetPostByIdAsync(postId);
            if (post == null) return NotFound();

            var username = User.GetUsername();
            if (post.User.UserName != username) return Unauthorized();

            var user = await unitOfWork.UserRepository.GetUserByUsernameAsync(username);
            if (user == null) return Unauthorized();

            if (post.Photos.Count == 1) return BadRequest("Can't delete the only photo");

            var photo = post.Photos.FirstOrDefault(x => x.Id == photoId);
            if (photo == null) return NotFound();

            var result = await photoService.DeletePhotoAsync(photo.PublicId);
            if (result.Error != null) return BadRequest(result.Error.Message);

            post.Photos.Remove(photo);

            if (await unitOfWork.Complete()) return Ok();

            return BadRequest("Couldn't delete photo");

        }



    }
}
