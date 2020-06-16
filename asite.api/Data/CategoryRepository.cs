using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using jsite.api.Models;
using jsite.api.Dtos;

namespace jsite.api.Data
{
    public class CategoryRepository : ICategoryRepository
    {
        private readonly DataContext _context;
        public CategoryRepository(DataContext context)
        {
            _context = context;
        }

        public void Add<T>(T entity) where T : class
        {
            _context.Add(entity);
        }

        public void Delete<T>(T entity) where T : class
        {
            _context.Remove(entity);
        }

        public async Task<List<CategoryForTreeViewDto>> GetCategories()
        {
            var articles = await _context.Categories.Select(c => new CategoryForTreeViewDto{
                Id =  c.Id,
                Name = c.Name,
                Articles = _context.Articles.Where(a=> a.CategoryId == c.Id).
                Select(a=>new ArticleForTreeViewDto{Id=a.Id,Name=a.Name, CategoryId = a.CategoryId}).ToList()
            }).ToListAsync();
            
            return articles;
        }

        public async Task<Category> GetCategory(int id)
        {
            var category = await _context.Categories.FirstOrDefaultAsync(c=>c.Id==id);
            return category;
        }

        public async Task<bool> SaveAll()
        {
            return await _context.SaveChangesAsync()>0;
        }

        public void Update<T>(T entity) where T : class
        {
            _context.Update(entity);
        }
    }
}