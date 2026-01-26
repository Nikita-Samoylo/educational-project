import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppDataSource } from './data-source';        
import { AuthModule } from './auth/auth.module';      

@Module({
  imports: [
    TypeOrmModule.forRoot(AppDataSource.options),  
    AuthModule,                                    
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}