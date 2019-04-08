import {
  Resolver,
  ArgsType,
  Field,
  Args,
  Mutation,
  Ctx,
  Info
} from 'type-graphql';
import { User } from '../../../../common/src/entity/users/User';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Repository } from 'typeorm';
import { IsEmail, MinLength } from 'class-validator';
import { AppContext } from '../../middleware/AppContext';
import * as bcrypt from 'bcrypt';
import { mapAttributes } from '../../resolvers/Helpers';

@ArgsType()
export class RegisterUserArguments {
  @Field(type => String)
  @IsEmail()
  email: string;

  @Field(type => String)
  @MinLength(6)
  password: string;
}

@ArgsType()
export class LoginUserArguments {
  @Field(type => String)
  @IsEmail()
  email: string;

  @Field(type => String)
  @MinLength(6)
  password: string;
}

@Resolver(of => User)
export class UserResolver {
  constructor(
    @InjectRepository(User, process.env.NODE_ENV || 'default')
    private readonly userRepository: Repository<User>
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
    @Args() options: LoginUserArguments,
    @Ctx() ctx: AppContext,
    @Info() info: any
  ): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { email: options.email },
      select: ['id', 'password', ...mapAttributes(User, info)]
    });
    if (!user) {
      return null;
    }
    const valid = await bcrypt.compare(options.password, user.password);
    if (!valid) {
      return null;
    }
    ctx.req.session!.userId = user.id; // place valid user ID into session
    return user;
  }
}
