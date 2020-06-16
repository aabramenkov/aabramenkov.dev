using Newtonsoft.Json;

namespace jsite.api.Models.Linkedin
{
    public class Email
    {
        [JsonProperty("elements")]
        public EmailElement[] Elements { get; set; }
    }

    public class EmailElement
    {
        [JsonProperty("handle~")]
        public Handle ElementHandle { get; set; }

        [JsonProperty("handle")]
        public string Handle { get; set; }
    }

    public class Handle
    {
        [JsonProperty("emailAddress")]
        public string EmailAddress { get; set; }
    }
}