using System.Collections.Generic;
using System.Threading.Tasks;
using jsite.api.Dtos;
using jsite.api.Models;

namespace jsite.api.Data
{
    public interface ICategoryRepository
    {
        void Add<T> (T entity) where T: class;
         void Delete<T> (T entity) where T: class;
         void Update<T> (T entity) where T: class;
         Task<bool> SaveAll();
         Task<Category> GetCategory(int id);
         Task<List<CategoryForTreeViewDto>> GetCategories();

    }
}