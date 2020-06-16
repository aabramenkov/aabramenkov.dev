using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using jsite.api.Models;
using Microsoft.EntityFrameworkCore;

namespace jsite.api.Data
{
    public class ArticleRepository : IArticleRepository
    {
        private readonly DataContext _context;
        public ArticleRepository(DataContext context)
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

        public async Task<Article> GetArticle(int id)
        {
            var article = await _context.Articles.FirstOrDefaultAsync(a=>a.Id==id);
            return article;
        }

        // public async Task<List<Article>> GetArticles()
        // {
        //     var articles =  await _context.Articles.ToListAsync();
        //     return articles;
        // }

        public async Task<List<Article>> GetArticlesByCategory(string categoryName)
        {
            var articles =  await _context.Articles.Where(a => a.Category.Name == categoryName).ToListAsync();
            return articles;
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