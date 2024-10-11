using Microsoft.AspNetCore.Authentication.BearerToken;

namespace server.Models;

public class LoginResponse
{
    public string Message { get; set; }
    public AccessTokenResponse Token { get; set; }
}