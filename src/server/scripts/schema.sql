--    1   │ id,manager,office,extension_number,mascot,cleaning_duty,project
--    2   │ 1,Mandy Warren,101A,#5709,Panda,Monday,Hyperion
create table teams (
    id int primary key,
    manager varchar(30),
    office varchar(10),
    extension_number varchar(10),
    mascot varchar(30),
    cleaning_duty varchar(15),
    project varchar(30)
);

--    1   │ id,job,requirement
--    2   │ developer,programming,computer science degree
create table roles (
    id varchar(30) primary key,
    job varchar(15),
    requirement varchar(100)
);

--    1   │ id,team
--    2   │ ergonomic mouse,1
create table supplies (
    id varchar(30) primary key,
    team int,
    constraint fk_team
        foreign key (team)
            references teams (id)
);

--    1   │ id,used_by,count,new_or_used
--    2   │ machanical keyboard,developer,24,used
create table equipments (
    id varchar(30) primary key,
    used_by varchar(30),
    count int,
    new_or_used varchar(10),
    constraint fk_id
        foreign key (id)
            references supplies (id),
    constraint fk_used_by
        foreign key (used_by)
            references roles (id)
);

--    1   │ id,first_name,last_name,sex,blood_type,serve_years,role,team,from
--    2   │ 1,Alex,Davidson,male,O,2,developer,2,California
create table people (
    id int primary key generated always as identity,
    first_name varchar(20),
    last_name varchar(20),
    sex varchar(10),
    blood_type int,
    serve_years int,
    role varchar(30),
    team int,
    froms varchar(30),
    constraint fk_team
        foreign key (team)
            references teams (id),
    constraint fk_role
        foreign key (role)
            references roles (id)
);
--    1   │ id,used_by,developed_by,description
--    2   │ Eclipse,developer,Eclipse Foundation,integrated development environment
create table software (
    id varchar(30) primary key,
    used_by varchar(15),
    developed_by varchar(30),
    description varchar(100),
    constraint fk_used_by
        foreign key (used_by)
            references roles (id)
);

