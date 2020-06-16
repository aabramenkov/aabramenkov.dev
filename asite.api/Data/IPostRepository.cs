using System.Collections.Generic;
using System.Threading.Tasks;
using jsite.api.Models;

namespace jsite.api.Data
{
    public interface IPostRepository
    {
        void Add<T> (T entity) where T: class;
        void Delete<T> (T entity) where T: class;
        void Update<T> (T entity) where T: class;
        Task<bool> SaveAll();
        Task<Post> GetPost(int id);
        Task<List<Post>> GetPosts();

    }
}