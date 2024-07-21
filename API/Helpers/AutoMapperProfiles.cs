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
                .ForMember(dest => dest.MainPhotoUrl, opt => opt
                    .MapFrom(src => src.Posts
                    .SelectMany(p => p.Photos)
                    .FirstOrDefault(p => p.IsMain).Url))
            .ForMember(dest => dest.Age, opt => opt.MapFrom(src => src.DateOfBirth.CalculateAge()));
            CreateMap<User, UserInfoDto>()
                .ForMember(dest => dest.MainPhotoUrl, opt => opt.MapFrom(src => src.Posts.SelectMany(p => p.Photos)
                    .FirstOrDefault(p => p.IsMain).Url));
            CreateMap<User, UserRolesDto>()
            .ForMember(dest => dest.Roles, opt => opt.MapFrom(src => src.UserRoles.Select(r => r.Role.Name)));
            CreateMap<User, UserDataDto>()
            .ForMember(dest => dest.MainPhotoUrl, opt => opt.MapFrom(src => src.Posts.SelectMany(p => p.Photos)
                    .FirstOrDefault(p => p.IsMain).Url))
            .ForMember(dest => dest.Age, opt => opt.MapFrom(src => src.DateOfBirth.CalculateAge()));
            CreateMap<UserUpdateDto, User>();
            CreateMap<RegisterDto, User>();


            CreateMap<Post, PostDto>();
            CreateMap<Post, PostDisplayDto>()
                .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.User.UserName))
                .ForMember(dest => dest.Pronouns, opt => opt.MapFrom(src => src.User.Pronouns))
                .ForMember(dest => dest.KnownAs, opt => opt.MapFrom(src => src.User.KnownAs))
                .ForMember(dest => dest.MainPhotoUrl, opt => opt.MapFrom(src => src.User.Posts.SelectMany(p => p.Photos)
                    .FirstOrDefault(p => p.IsMain).Url));
            CreateMap<Post, UserPostDto>()
            .ForMember(dest => dest.FirstPhotoUrl, opt => opt.MapFrom(src => src.Photos[0].Url));
            CreateMap<PostUpdateDto, Post>();

            CreateMap<Photo, PhotoDto>();

            CreateMap<Message, MessageDto>()
                .ForMember(dest => dest.RecipientProfilePicture, opt => opt
                    .MapFrom(src => src.Recipient.Posts
                    .SelectMany(p => p.Photos)
                    .FirstOrDefault(p => p.IsMain).Url))
                .ForMember(dest => dest.SenderProfilePicture, opt => opt
                    .MapFrom(src => src.Sender.Posts
                    .SelectMany(p => p.Photos)
                    .FirstOrDefault(p => p.IsMain).Url));
        }

    }
}