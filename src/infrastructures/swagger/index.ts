import { NestApplication } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";


export const swaggerConfig = async (app: NestApplication) => {
    const config = new DocumentBuilder()
        .setTitle('Короткие ссылки')
        .setDescription('Microservice для сокращения ссылок')
        .setVersion('1.0')
        .addTag('short-links')
        .build();
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, documentFactory);
}