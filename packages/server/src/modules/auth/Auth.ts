import { AuthChecker } from 'type-graphql';
import { AppContext } from '../../middleware/AppContext';
import { User } from '../../../../common/src/entity/users/User';

export const checkAuth: AuthChecker<AppContext> = async (
  { context: { userId } },
  roles
) => {
  if (roles.length !== 0) {
    // no roles required, request requires user to be logged in. Check if userId is undefined
    return userId !== undefined;
  }
  // request requires user to be logged in with specific roles, find user and check roles
  const user = await User.findOne(
    {
      id: userId
    },
    { select: ['roles'] }
  );
  if (!user) {
    return false;
  }
  if (user.roles.some(role => roles.includes(role))) {
    return true;
  }
  //no roles matched, restrict access
  return false;
};
