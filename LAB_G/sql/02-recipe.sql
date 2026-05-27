create table recipe
(
    id      integer not null constraint recipe_pk primary key autoincrement,
    name text not null,
    steps text not null,
    ingredients text not null
);
