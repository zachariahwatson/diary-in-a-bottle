namespace server.Models;

public sealed class CustomInfoResponse
{
    /// <summary>
    /// The username associated with the authenticated user.
    /// </summary>
    public required string UserID { get; init; }
    public required string UserName { get; init; }
}