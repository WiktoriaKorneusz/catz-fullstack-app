using API.Interfaces;

namespace API.Data
{
    public class UnitOfWork(DataContext context, IUserRepository userRepository, IPostRepository postRepository, IFollowRepository followRepository, IMessageRepository messageRepository) : IUnitOfWork
    {
        public IUserRepository UserRepository => userRepository;

        public IPostRepository PostRepository => postRepository;

        public IFollowRepository FollowRepository => followRepository;

        public IMessageRepository MessageRepository => messageRepository;

        public async Task<bool> Complete()
        {
            return await context.SaveChangesAsync() > 0;
        }
        public bool HasChanges()
        {
            return context.ChangeTracker.HasChanges();
        }

    }
}