import { UserResolver } from './user/UserResolvers';
import { MainResolver } from './main/main.module';

export const resolvers = [MainResolver, UserResolver];
