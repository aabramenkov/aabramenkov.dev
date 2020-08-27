using Newtonsoft.Json;

namespace jsite.api.Models.Facebook
{
        public class FbUser
        {
            [JsonProperty("id")]
            public string Id { get; set; }

            [JsonProperty("email")]
            public string Email { get; set; }

            [JsonProperty("name")]
            public string Name {get;set;}

            [JsonProperty("picture")]
            public Picture Picture { get; set; }
        }
}