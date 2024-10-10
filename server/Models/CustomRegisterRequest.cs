namespace server.Models;

/// <summary>
/// The request type for the "/register" endpoint added by <see cref="IdentityApiEndpointRouteBuilderExtensions.MapIdentityApi"/>.
/// </summary>
public sealed class CustomRegisterRequest
{
    /// <summary>
    /// The user's email address which acts as a user name.
    /// </summary>
    public required string UserName { get; init; }

    /// <summary>
    /// The user's password.
    /// </summary>
    public required string Password { get; init; }
}