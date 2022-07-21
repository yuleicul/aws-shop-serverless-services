create extension if not exists "uuid-ossp";

create table product (
	id uuid not null default uuid_generate_v4() primary key,
	title text not null,
	description text,
	price int not null
);

create table stock (
	product_id uuid not null references product(id),
	count int not null default 0
);

insert into product (title, description, price) values ('Remarkably Bright Creatures', 'A Read With Jenna Today Show Book Club Pick!', 15);
insert into product (title, description, price) values ('What My Bones Know: A Memoir of Healing from Complex Trauma', 'A searing memoir of reckoning and healing by acclaimed journalist Stephanie Foo, investigating the little-understood science behind complex PTSD and how it has shaped her life', 14);
insert into product (title, description, price) values ('All My Rage', 'An INSTANT NEW YORK TIMES BESTSELLER! An INSTANT INDIE BESTSELLER!', 9);
insert into product (title, description, price) values ('The Maid', '#1 NEW YORK TIMES BESTSELLER • GOOD MORNING AMERICA BOOK CLUB PICK', 14);

insert into stock (product_id, count) values ('a5a59551-1376-4339-b768-5cab209e2de1', 8);
insert into stock (product_id, count) values ('40ac784c-5870-4ccc-9c96-9c48fad026e2', 18);
insert into stock (product_id, count) values ('5bb01444-3564-48fb-bdcb-f23e052ef868', 12);
insert into stock (product_id, count) values ('4f33097e-6e63-4187-8e19-7270b9ddda22', 3);