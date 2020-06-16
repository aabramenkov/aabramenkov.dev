namespace jsite.api.Models
{
    using Newtonsoft.Json;

    public partial class LinkedinUser
    {
        [JsonProperty("firstName")]
        public FirstName FirstName { get; set; }

        [JsonProperty("localizedFirstName")]
        public string LocalizedFirstName { get; set; }

        [JsonProperty("headline")]
        public FirstName Headline { get; set; }

        [JsonProperty("localizedHeadline")]
        public string LocalizedHeadline { get; set; }

        [JsonProperty("vanityName")]
        public string VanityName { get; set; }

        [JsonProperty("id")]
        public string Id { get; set; }

        [JsonProperty("lastName")]
        public FirstName LastName { get; set; }

        [JsonProperty("localizedLastName")]
        public string LocalizedLastName { get; set; }

        [JsonProperty("profilePicture")]
        public ProfilePicture ProfilePicture { get; set; }

        public string Email { get; set; }

        public string PhotoUrl { get; set; }
    }

    public partial class FirstName
    {
        [JsonProperty("localized")]
        public Localized Localized { get; set; }

        [JsonProperty("preferredLocale")]
        public PreferredLocale PreferredLocale { get; set; }
    }

    public partial class Localized
    {
        [JsonProperty("en_US")]
        public string EnUs { get; set; }
    }

    public partial class PreferredLocale
    {
        [JsonProperty("country")]
        public string Country { get; set; }

        [JsonProperty("language")]
        public string Language { get; set; }
    }

    public partial class ProfilePicture
    {
        [JsonProperty("displayImage")]
        public string DisplayImage { get; set; }
    }
}
