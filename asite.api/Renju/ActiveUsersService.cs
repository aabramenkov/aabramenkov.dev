using System.Collections.Generic;
using Renju.Models;

namespace Renju
{
    public static class ActiveUsersService
    {
        private static List<Gamer> ActiveGamers = new List<Gamer>();

        public static List<Gamer> GetActiveGamers(){
            return ActiveGamers;
        }

        public static List<Gamer> AddActiveGamer(Gamer gamer){
            ActiveGamers.Add(gamer);
            return ActiveGamers;
        }

        public static List<Gamer> RemoveGamer(Gamer gamer){
            ActiveGamers.Remove(gamer);
            return ActiveGamers;
        }
    }
}