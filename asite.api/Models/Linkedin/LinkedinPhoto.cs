using System;
using Newtonsoft.Json;

namespace jsite.api.Models.Linkedin
{
    public partial class LinkedinPhoto
    {
        [JsonProperty("profilePicture")]
        public ProfilePicture ProfilePicture { get; set; }
    }

    public partial class ProfilePicture
    {
        [JsonProperty("displayImage")]
        public string DisplayImage { get; set; }

        [JsonProperty("displayImage~")]
        public DisplayImage ProfilePictureDisplayImage { get; set; }
    }

    public partial class DisplayImage
    {
        [JsonProperty("paging")]
        public Paging Paging { get; set; }

        [JsonProperty("elements")]
        public Element[] Elements { get; set; }
    }

    public class Element
    {
        [JsonProperty("artifact")]
        public string Artifact { get; set; }

        [JsonProperty("authorizationMethod")]
        public string AuthorizationMethod { get; set; }

        [JsonProperty("data")]
        public Data Data { get; set; }

        [JsonProperty("identifiers")]
        public Identifier[] Identifiers { get; set; }
    }

    public class Data
    {
        [JsonProperty("com.linkedin.digitalmedia.mediaartifact.StillImage")]
        public ComLinkedinDigitalmediaMediaartifactStillImage ComLinkedinDigitalmediaMediaartifactStillImage { get; set; }
    }

    public class ComLinkedinDigitalmediaMediaartifactStillImage
    {
        [JsonProperty("mediaType")]
        public string MediaType { get; set; }

        [JsonProperty("rawCodecSpec")]
        public RawCodecSpec RawCodecSpec { get; set; }

        [JsonProperty("displaySize")]
        public DisplaySize DisplaySize { get; set; }

        [JsonProperty("storageSize")]
        public StorageSize StorageSize { get; set; }

        [JsonProperty("storageAspectRatio")]
        public AspectRatio StorageAspectRatio { get; set; }

        [JsonProperty("displayAspectRatio")]
        public AspectRatio DisplayAspectRatio { get; set; }
    }

    public class AspectRatio
    {
        [JsonProperty("widthAspect")]
        public long WidthAspect { get; set; }

        [JsonProperty("heightAspect")]
        public long HeightAspect { get; set; }

        [JsonProperty("formatted")]
        public string Formatted { get; set; }
    }

    public class DisplaySize
    {
        [JsonProperty("width")]
        public long Width { get; set; }

        [JsonProperty("uom")]
        public string Uom { get; set; }

        [JsonProperty("height")]
        public long Height { get; set; }
    }

    public class RawCodecSpec
    {
        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("type")]
        public string Type { get; set; }
    }

    public class StorageSize
    {
        [JsonProperty("width")]
        public long Width { get; set; }

        [JsonProperty("height")]
        public long Height { get; set; }
    }

    public class Identifier
    {
        [JsonProperty("identifier")]
        public Uri IdentifierIdentifier { get; set; }

        [JsonProperty("index")]
        public long Index { get; set; }

        [JsonProperty("mediaType")]
        public string MediaType { get; set; }

        [JsonProperty("file")]
        public string File { get; set; }

        [JsonProperty("identifierType")]
        public string IdentifierType { get; set; }

        [JsonProperty("identifierExpiresInSeconds")]
        public long IdentifierExpiresInSeconds { get; set; }
    }

    public class Paging
    {
        [JsonProperty("count")]
        public long Count { get; set; }

        [JsonProperty("start")]
        public long Start { get; set; }

        [JsonProperty("links")]
        public object[] Links { get; set; }
    }
}
