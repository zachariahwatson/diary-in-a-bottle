using Microsoft.AspNetCore.Identity;
using server.Helpers;

namespace server.Services;

public class CustomUserValidator<TUser> : UserValidator<TUser> where TUser : class
{
    public CustomUserValidator(IdentityErrorDescriber? errors = null) : base(errors)
    {
    }

    public override async Task<IdentityResult> ValidateAsync(UserManager<TUser> manager, TUser user)
    {
        ArgumentNullThrowHelper.ThrowIfNull(manager);
        ArgumentNullThrowHelper.ThrowIfNull(user);

        // Only validate username, skipping email validation
        var errors = await ValidateUserName(manager, user).ConfigureAwait(false);
        return errors?.Count > 0 ? IdentityResult.Failed(errors.ToArray()) : IdentityResult.Success;
    }

    //remake ValidateUserName since the one in UserValidator is private
    private async Task<List<IdentityError>?> ValidateUserName(UserManager<TUser> manager, TUser user)
    {
        List<IdentityError>? errors = null;
        var userName = await manager.GetUserNameAsync(user).ConfigureAwait(false);
        if (string.IsNullOrWhiteSpace(userName))
        {
            errors ??= new List<IdentityError>();
            errors.Add(Describer.InvalidUserName(userName));
        }
        else if (!string.IsNullOrEmpty(manager.Options.User.AllowedUserNameCharacters) &&
            userName.Any(c => !manager.Options.User.AllowedUserNameCharacters.Contains(c)))
        {
            errors ??= new List<IdentityError>();
            errors.Add(Describer.InvalidUserName(userName));
        }
        else
        {
            var owner = await manager.FindByNameAsync(userName).ConfigureAwait(false);
            if (owner != null &&
                !string.Equals(await manager.GetUserIdAsync(owner).ConfigureAwait(false), await manager.GetUserIdAsync(user).ConfigureAwait(false)))
            {
                errors ??= new List<IdentityError>();
                errors.Add(Describer.DuplicateUserName(userName));
            }
        }

        return errors;
    }
}
