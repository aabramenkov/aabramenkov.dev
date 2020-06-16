using Newtonsoft.Json;

namespace jsite.api.Models.Facebook
{
        public class FbAccessToken
        {
            [JsonProperty("access_token")]
            public string access_token { get; set; }

            [JsonProperty("token_type")]
            public string token_type { get; set; }

            [JsonProperty("expires_in")]
            public string expires_in { get; set; }
        }
}