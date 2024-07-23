using System.Text.Json;
using API.Helpers;

namespace API.Extensions
{
    public static class HttpExtensions
    {
        public static void AddPaginationHeader(this HttpResponse httpResponse, PaginationHeader paginationHeader)
        {
            var jsonOptions = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };
            httpResponse.Headers.Append("Pagination", JsonSerializer.Serialize(paginationHeader, jsonOptions));
            httpResponse.Headers.Append("Access-Control-Expose-Headers", "Pagination");
        }
    }
}
