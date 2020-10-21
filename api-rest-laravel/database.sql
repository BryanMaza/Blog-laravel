CREATE DATABASE IF NOT EXISTS api_rest_laravel;
USE api_rest_laravel;

CREATE TABLE users(
    id           int(255) auto_increment not null,
    name         varchar(50) NOT NULL,
    surname      varchar(100),
    email        varchar(200) NOT NULL,
    password     varchar(250) NOT NULL,
    role         varchar(20),
    description  text,
    image        varchar(225),
    created_at   datetime DEFAULT NULL,
    updated_at   datetime DEFAULT NULL,
    remember_token   varchar(225),

     CONSTRAINT pk_users PRIMARY KEY(id)
) ENGINE=InnoDb;

CREATE TABLE categories(
    id          int(255) auto_increment not null,
    name        varchar(225),
    created_at   datetime DEFAULT NULL,
    updated_at   datetime DEFAULT NULL,

    CONSTRAINT pk_categories PRIMARY KEY(id)
)ENGINE=InnoDb;

CREATE TABLE posts(
    id          int(255) auto_increment not null,
    user_id     int (255) NOT NULL,
    category_id int(255) not null,
    title       varchar(255) not null,
    content     text,
    image       varchar(255),
    created_at   datetime DEFAULT NULL,
    updated_at   datetime DEFAULT NULL,

    CONSTRAINT pk_posts PRIMARY KEY(id),
    CONSTRAINT fk_post_user FOREIGN KEY(user_id) REFERENCES users(id),
    CONSTRAINT fk_post_category FOREIGN KEY(category_id) REFERENCES categories(id)
)ENGINE=InnoDb;