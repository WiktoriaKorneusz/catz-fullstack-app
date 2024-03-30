using API.DTOs;
using API.Extensions;
using API.Models;
using AutoMapper;

namespace API.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<User, MemberDto>()
            // .ForMember(dest => dest.MainPhotoUrl, opt => opt.MapFrom(src => src.Photos.FirstOrDefault(x => x.IsMain).Url))
                .ForMember(dest => dest.MainPhotoUrl, opt => opt.MapFrom(src => src.Posts.SelectMany(p => p.Photos)
                    .FirstOrDefault(p => p.IsMain).Url))
            .ForMember(dest => dest.Age, opt => opt.MapFrom(src => src.DateOfBirth.CalculateAge()));
            CreateMap<Post, PostDto>();
            CreateMap<Post, PostDisplayDto>()
                .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.User.UserName))
                .ForMember(dest => dest.Pronouns, opt => opt.MapFrom(src => src.User.Pronouns))
                .ForMember(dest => dest.KnownAs, opt => opt.MapFrom(src => src.User.KnownAs))
                .ForMember(dest => dest.MainPhotoUrl, opt => opt.MapFrom(src => src.User.Posts.SelectMany(p => p.Photos)
                    .FirstOrDefault(p => p.IsMain).Url));

            CreateMap<User, UserInfoDto>();
            CreateMap<Photo, PhotoDto>();
            CreateMap<UserUpdateDto, User>();
            CreateMap<PostUpdateDto, Post>();
        }

    }
}