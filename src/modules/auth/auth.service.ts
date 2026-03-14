import {
  Inject,
  Injectable,
  UnauthorizedException
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import bcrypt from "bcryptjs";
import { PrismaService } from "../../common/prisma/prisma.service";
import { LoginDto } from "./dto/login.dto";

@Injectable()
export class AuthService {
  constructor(
    @Inject(PrismaService)
    private readonly prisma: PrismaService,
    @Inject(JwtService)
    private readonly jwtService: JwtService
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: loginDto.email
      }
    });

    if (!user) {
      throw new UnauthorizedException("Tài khoản hoặc mật khẩu không đúng.");
    }

    const isValidPassword = await bcrypt.compare(
      loginDto.password,
      user.passwordHash
    );

    if (!isValidPassword) {
      throw new UnauthorizedException("Tài khoản hoặc mật khẩu không đúng.");
    }

    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
      role: user.role,
      fullName: user.fullName
    });

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role
      }
    };
  }
}
