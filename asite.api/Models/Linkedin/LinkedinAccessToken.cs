using Newtonsoft.Json;

namespace jsite.api.Models.Linkedin
{
        public class LinkedinAccessToken
        {
            [JsonProperty("access_token")]
            public string access_token { get; set; }

            [JsonProperty("token_type")]
            public string token_type { get; set; }

            [JsonProperty("expires_in")]
            public string expires_in { get; set; }
        }
}