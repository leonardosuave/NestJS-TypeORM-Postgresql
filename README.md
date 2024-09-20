<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).

## Validations request - DTO

Install class-validator and class-transformer

```bash
# install
$ npm i class-validator class-transformer
```

- Add new configuration in main.ts file
app.useGlobalPipes(new ValidationPipe());

This will validate in all aplication when use DTO, like a @Decorator beforer a data request

## Database

Install Postgresql database and ORM Prisma
```bash
# create docker database
$ docker-compose -f compose_db.yml up
```

Install TypeOrm
```bash
# install ORM, driver database and nestjs typeorm
$ npm i typeorm pg @nestjs/typeorm

# Config to connect database when run the application
  # In app.module.ts, import TypeOrmModule.forRoot({}) and pass the object with the params to connect in database, like host, port, database, username.... (option synchronize will delete the register if true, so add validate to be true only local or local/dev).
  # Create the entities in the fold with modules,controller and service or do the specific folder to entities.
  # To use the entity database in the service, go to the each module that will use, like user.module.ts and import the entity like TypeOrmModule.forFeature([UserEntity, another entity...])
```

## Creating entity to a route

- Module
    Create a module
      Imports - In this array need to have all Entity modules in use by the module
        Ex: I create a user.module.ts to register user in database, to register in database i need use the Prisma, so i need to import PrismaMosule.
      Controllers: In this array need to have the class of the Controller in use, like UserController
      Providers: In this array need to have the class of the Services that are injectable in constructor of the Controller 
        In user.controller.ts the contructor of the class use the UserService, so to work i need to insert UserService in providers module.

- Controller
    Create a class and a method like create, insert method route decorate, Body and DTO to validate the body.
    Call the entity service to call the logic and the database if need.
    To use the service neeed to do the injectable in constructor class of Controller, like Angular. (constructor(private readonly userService: UserService){};).

- Service  
    Create a class with decorator @Injectable().
    In the constructor, pass the Services that the class will use, like a PrismaService to call the database (constructor(private readonly prisma: PrismaService){};).
    Create the method with the logic.


## Interceptor
  The interceptor are functions used to interceptor datas from a route and return something that you want in the response, like a execution time to the request. Work like a @Log() from Entergy.

- Create Interceptor
    Create a fold to interceptors and after a file .ts
    Create a class that are implements NestInterceptor, and after a method intercept with context and next params.
    In intercept write the logic to return with request's response.

- Using interceptors
  Interceptor can be applied in 3 different ways, all passing the decorator @UseInterceptors() and the parameter being the class with the created interceptor.
    1 - Specific route handler - Adds the decorator on top of each method, example route to create users ->@UseInterceptors(LogInterceptor).
    2 - In all controller methods - Adds the decorator in the same way, only next to the @Controller() decorator.
    3 - Global - Adds directly to the bootstrap function in main.ts, within the function to identify which app will be used, the interceptor -> app.useGlobalInterceptors(new LogInterceptor()).

## Middlewares
  The middlewares in NestJS working like Express, will pass beforer the controller if will do de check neccessary, if ok will go to controller, if not send error.
  - Create Middleware
    Create a file to the middleware, create a class that are implements "NestMiddleware", use the method "use" that received req, res and next params and in this method do the verify. Out of the method pass the "next()" to go to the controller if the success verifies.

  - Use middleware
    Go tho the module of the entity, like user.modules.ts and in the export class module pass the implements "NestModule" and a method "configure" with params "consume" that are a "MiddlewareConsumer" type. In this method "consume" are a object and using consume.apply() pass the class middleware creare with the logic that want to use in the entity.
    The are the option to specific routes using .forRoutes() or specific route that not want to use the middleware using .exclude().

## Guards
  The Guards are used to verify if can or not access routes, its used to verify if user are authenticated or has permission to access the routes. (Like middleware), returning true or false only. 
  The Guards are created to verify only one things, to verify more things you need to create more guards and do the verify separately.
  Ex: auth-guards.ts verify if token is valid and if valid return user infos.
      auth-status-guard.ts verify if token is valid and return true or false. (fastest route to verify if token in use already valid and if false need create a new token).

  - Create guards
    Create the class implements CanActive from @nestjs/cammon;
    Add contructor() if neccessary import a service to do the verify.
    add method canActivate(context: ExecutionContext) and this method will have the logic to verify if guards can be tru or false.

## Custom Param Decorator
  The Customer Param Decorator are @Decorators that receive the Request data and can be validate before call a service
  - Create
    Create a file with a export const, this const need to call a createParamDecorator() function from @nestjs/common that call another callback with 2 params.
      First param is a param sended when import the final Decorator in the controller, can be a string, object, array.
      Second param is the context, type from ExecutionContext from @nestjs/common and this context can capture the datas sended in the Resquest, like a token send to the Guard, filter there and return the user infos and after capture in Custom Decorator and done a new filter, like return only the datas received in the first params. 

## Autorização RBAC(Controle de Autorização por Role)
  This controlle allow only user with a specific role registered in database to access specific routes. To this, a GUARD can do the check in user in use is allow and return true or false to continue the access flow.
  Ex: I have a route to create something, but only some user roles MASTER and ADMIN can create and i have user roles NORMAL registered. So i use this validate in the guard, taking token access with user infos saved and i check if user roles is allowed.
  To this is used @CustomerDecorator to informe the roles allowed or another data used to validation and a guard in the controller to allowed or no the access.
    IMPORTANT: If validation is only some routes from controller, put the customer decorator beforer method and UseGuard() in the class with guard created to allow or no in the params.
               If validation is in all routes, use in the class, but need to declar first the customerDecorator and after the useGuards.

  OBS: Customer Decorator take the info neccessary to access and the guard take this info from Customer Decorator and do the validation.             

  - Create a Customer Decorator 
    In the decorator folder, create a new file. The const name is the decorator name and the params of arrow function will have the params passed. This arrow function will call SetMetadata from @nestjs/common and will received 2 params. First params is the key name and Second params is the values received in the params of the function. This params is passed in decorator like @CustomerName('Parameter-here').
    

  - Create a guard to verify.
    Create in guards folder a new file to this verify. (The class is a implements from CanActivate).
    In the constructor need to use the reflactor imported from Reflector (This import will reflect the validate in routes in use by this guard).
    In the method canActivate(contect: ExecutionContext) will have the logic to validation.
      In the method use the reflactor to get the roles or another data in use to validation passed into params custommer decorator and setted in Metadata.
        ex: cosnt requiredRoles = this.reflactor.getAllAndOverride<type[]>('Key name setted', [context.getHandler(), context.getClass()])
            the cosnt requiredRoles will received a array and each index is a role allowed => ['MASTER', 'ADMIN']

      With this infos user another services imported in constructor to take another infos to validation or infos saved in another guard, like the auth.guard.ts the runned before and save the user infos in request.user
        To take the request.user use the context to take the infos of Resquest
          ex: const { user } = context.switchToHttp().getRequest().
          Now have user info and can validate with requiredRoles.

## Circular Dependency
  The circular dependency are errors when i controller ou module use another module and this another module use the first module, happen a infinit looping.
    Ex: I have a guard used in users routes, so this guard use the authService to validate the token received in the guard, so i need tho import authModule to use the service. This way the userModule need authModule to work. The auths routes use the userService to register a new user, so i need to import the userModule to use the user service.
      I will have a infinit looping and will generate this error. 
        userModule -> authModule -> userModule ->authModule.........

  - Resolve error
    To resolve the error you need to use the "forwardRef" method and referer the modules in circular dependency. 
      To this in both modules import the Module uwind the forwardRef.
        Ex: (user.module.ts) - > imports:[...., forwardRef(() => AuthModule)]
            (auth.module.ts) - > imports:[...., forwardRef(() => UserModule)]

## DDOS Attack (Throttler)
  To app be security againt DDOS attack can be used the ThrottlerModule from @nestjs/throttler and config the access limit per seconds.
    To use the Throttler need to install -> npm i @nestjs/throttler. (it was used v3.1.0).
    After, import the ThrottlerModule on app.modules.ts and do the start config.
      In Imports, use ThrottlerModule.forRoot({"here put the configs"}).
      To use the ThrottlerModule in all application put in app.modules.ts, providers a new object like a service in use.
        {provide: APP_GUARD, useClass: ThrottlerGuard} -> APP_GUARD from @nestjs/core and ThrottlerGuard from @nestjs/throttler

      If want to limit in a specific controller or specific route, need to use like a Guard -> UseGuards(ThrottlerGuard) and not declair the objet in the app.modules.ts, providers like up exemple.

      If neccess, you want use the Throttler in specific place or in all app and in another specific place overwritte the configs to have a specific config in the route or controller.
        To overwritte when used in all app, you can use the @Decorator @Throttle() and this decorator will receive the params specificated in the app.module.ts
        To ignore the Throttler in a specific route or controller when used in a global system, like all app or controller, use the @Decorator @SkipThrottle() in the route or controller.

    OBS: You can config a new the Throttler in the controller or specific route. To this, UseGuards(new ThrottlerGuard(){"here put the configs"}).

## Upload image/files
  To upload image/files in the route, need to use in the route the interceptor FileInterceptor('name file') to receive only 1 file, FilesInterceptor('name file') to receive in name file one file array or FileFieldsInterceptors() to receive a lot of files name that can be arrays or no. 
    ex: @UseInterceptors(FileInterceptor('file')).

  The datas will received in the @UploadedFile() or @UploadedFiles() in route params like @Body, and the variable can be type as Express.Multer.File 
    ex: async uploadFile(@UploadedFile() file: Express.Multer.File).
    ex: async uploadFilesFields(@UploadedFiles() files: {photo: Express.Multer.File, documents: Express.Multer.File[]}) -> photo is only 1 file and documents is a array files

  The decorator of route can receive params to validate specific things about the file, like max size, file type and another things.
    ex: async uploadPhoto(@UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: 'image/png' }),   -> accept only png type
          new MaxFileSizeValidator({ maxSize: 1024 * 70 })    -> accept max size 70 KB
        ]
      })
    ))

  OBS: In Insomnia or Postman to send a file array need to create 2 or more row with same field name.

  ## Send Emails
    To send emails, the nestJs have package developed using the NodeMailer. To this, search nest mailer (https://github.com/nest-modules/mailer?tab=readme-ov-file).
      Installation:
        npm install --save @nestjs-modules/mailer nodemailer
        npm install --save-dev @types/nodemailer

        Templates to choise (choise 1 template and install) -> It was used the pug.
        npm install --save handlebars
        npm install --save pug
        npm install --save ejs
        npm install --save mjml

    Configurate NodeMailer:
      In app.module.ts, import the follow code to do the connection with host email that will send the emails. It was used the Ethereal Email to send the emails (This is a host test to send emails).

      MailerModule.forRoot({
      transport: {
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
          user: 'myles.leannon@ethereal.email',
          pass: 'bZnYPbSGgZdyYRUMnw',
        },
      },
      defaults: {
        from: '"nest-study" <myles.leannon@ethereal.email>',
      },
      template: {
        dir: __dirname + '/templates',
        adapter: new PugAdapter(),
        options: {
          strict: true,
        },
      },
    }),

    transport can be a string like prisma connection that have all datas neccessary to connect with host email.
    template need to be configurate to work with template installed in the beforer steep. (PugAdapter was imported by dist because the template file need to be in dist fold when transpile to javascript). If not found the template in dist fold try restart the app or go to the nest-cli.json file and in compilerOptions add the follow config to create the the template file/fold in dist fold:
      "compilerOptions": {
        "assets": [{
          "include": "templates/**/*",
          "outDir": "dist"
        }],
      }

   After configurate, create the fold and file with template, in this example was used the pug template.

   To send the emails, declair the variable on the service like a external service improted to use.   
    import { MailerService } from '@nestjs-modules/mailer/dist';
    private readonly mailer: MailerService,

    await this.mailer.sendMail({
      subject: 'Password Recovery',
      to: user.email,
      template: 'forget',
      context: {
        name: user.name,
        token: token,
      },
    });

    In context pass the variables used in template file. 

## Unit Tests
  To start the tests, create files .spec.ts into src (This config to search files on src folder need to be into jest config in the package.json).
  The services to test need to be imported by relative path, so CTRL+SHIFT+P, write JSON and click on "Preferences: Open User Settings(JSON)" and into this file put the follow config:
    "typescript.preferences.importModuleSpecifier": "relative"

  ### Fist config to test and Mocks
    Create into describe a hook beforeEach to run beforer each test and simulate a module test.
    - To create a module, create a const module with type TestingModule and call Test.createTestingModule({providers: []}). compile();
        providers: Is the services to test and mocks.
        compile() to the test module be existed.
    - To create a Mock (simulate the constructor injectable from the service class), create a mock file to each dependency from contructor service and create a object with provide and useValue. (If is a repository the provide need to be getRepositoryToken(Entity from repository))
        provide: It will pass getRepositoryToken() if is repository and this will received in parameter the entity  from the @InjectRepository from the constructor class service. 
        useValue: It are all methods from repository called in the service, like userRepository is the called to database, so values are the methods create, save, find .....
          each value is a object with value jest.fn()
    Create de definition of the services imported on providers to have access the methods of the service
      create a let outside beforeEach to have acces in all test file.
        ex: let userService: UserService;
      After extract the things from the service
        ex: userService = module.get<UserService>(UserService)

## E2E Tests
  To this test was create using a different database where each time that call the npm run test:e2e will run another commands from package.json to clear the database existing, set the config to use uuid_generate_v4() by a separate script, wil run the migrates and after run the tests e2e crating register, etc.
  When the test finish will run another command to clear and drop the tables from database used to the tests.

  OBS: To identify the database test in the commands from package.json, use the libary cross-env and pass this command beforer each execute a command in the scripts. Ex: cross-env ENV=test npm run clear:db:test.
  This libary simulate differents environment to the same variables, using 2 or more .env files. After need configurate in data-source.ts and app.module.ts to use the .env file taking the values from the cross-env ENV='value neccessary'

## Build to PROD
The command npm run prod will run a lot of command to check code format, unit test and tests e2e and if success will build a new dist with the files neccessary to run PROD.
After run the command npm run start:prod and the application will work like prod environment.

OBS: Put this command in pipeline to deploy automatically and run aplication in PROD.
