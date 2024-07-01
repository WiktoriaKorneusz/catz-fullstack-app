using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Text.Json;
using API.Helpers;

namespace API.Extensions
{
    public static class HttpExtensions
    {
        public static void AddPaginationHeader(this HttpResponse httpResponse, PaginationHeader paginationHeader)
        {
            var jsonOptions = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };
            //add instead of append
            httpResponse.Headers.Append("Pagination", JsonSerializer.Serialize(paginationHeader, jsonOptions));
            /* The line `httpResponse.Headers.Append("Access-Control-Expose-Headers", "Pagination");` is adding a
            response header named "Access-Control-Expose-Headers" with the value "Pagination". */
            httpResponse.Headers.Append("Access-Control-Expose-Headers", "Pagination");
        }
    }
}
