import {
  Resolver,
  ArgsType,
  Field,
  Args,
  Mutation,
  Ctx,
  Arg
} from 'type-graphql';
import { User } from '../../../../common/src/entity/users/User';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Repository } from 'typeorm';
import { IsEmail } from 'class-validator';
import { AppContext } from '../../middleware/AppContext';
import * as bcrypt from 'bcrypt';

@ArgsType()
export class RegisterUserArguments {
  @Field(type => String)
  @IsEmail()
  email: string;

  @Field(type => String)
  password: string;
}

@Resolver(User)
export class UserResolver {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>
  ) {}

  @Mutation(returns => User, { nullable: true })
  async registerByEmail(@Args() options: RegisterUserArguments) {
    const user = new User();
    user.email = options.email;
    user.password = options.password;
    return await this.userRepository.save(user);
  }

  @Mutation(returns => User, { nullable: true })
  async loginByEmail(
    @Arg('email') email: string,
    @Arg('password') password: string,
    @Ctx() ctx: AppContext
  ): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      return null;
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return null;
    }
    ctx.req.session!.userId = user.id;
    return user;
  }
}
