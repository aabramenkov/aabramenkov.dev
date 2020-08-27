using System;
using System.Collections.Generic;
using jsite.api.Models;

namespace jsite.api.Dtos
{
    public class UserForReturnDto
    {
        public int Id{get;set;}
        public string NickName {get;set;}
        public string UserName {get;set;}
        public string Email{get;set;}
        public string PhotoUrl{get;set;}
        public DateTime Created { get; set; }
        public DateTime LastActive { get; set; }
        public string RegisteredVia { get; set; }
        public IList<string> Roles { get; set; }
    }
}