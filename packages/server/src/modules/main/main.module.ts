import { Resolver, Query, Authorized } from 'type-graphql';
import { USER_ROLE_MAP } from '../../../../common/src/entity/users/User';

@Resolver()
export class MainResolver {
  @Authorized(USER_ROLE_MAP.PUBLIC)
  @Query(returns => Boolean)
  isReady() {
    return true;
  }
}
