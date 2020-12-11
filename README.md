Files under argon2/ come from https://github.com/P-H-C/phc-winner-argon2

TODO: Add license
TODO: Add blog :D

CREATE TABLE DEMO_DB.PUBLIC.USERS (username STRING, hash STRING);


CREATE OR REPLACE FUNCTION DEMO_DB.PUBLIC.argon2_hash(password_input STRING, diffsalt_input STRING) 
  RETURNS STRING
  LANGUAGE JAVASCRIPT
AS
$$
  // File contents go here
  return wasm_argon2_hash(PASSWORD_INPUT, DIFFSALT_INPUT);
$$
;

CREATE OR REPLACE FUNCTION DEMO_DB.PUBLIC.argon2_verify(hash_input STRING, password_input STRING) 
  RETURNS STRING
  LANGUAGE JAVASCRIPT
AS
$$
  -- File contents go here
  return wasm_argon2_verify(HASH_INPUT, PASSWORD_INPUT);
$$;


```sql
SELECT DEMO_DB.PUBLIC.argon2_verify('password1', 'somesalt1')
```


```sql
SELECT DEMO_DB.PUBLIC.argon2_verify('$argon2i$v=19$m=8,t=2,p=1$c29tZXNhbHQx$Bkvg+m6atN29vDHi/Cx6f+1iy8jpCIfx0XP4VDEbI7E', 'password1')
```

```sql
Select DEMO_DB.PUBLIC.example_js('aaa', 'bbb');
```

```sql
INSERT INTO "DEMO_DB"."PUBLIC"."USERS" (username, hash) VALUES
    ('name1', DEMO_DB.PUBLIC.argon2_hash('password', 'PRESALT' || 'name1'));
```

Error: 
```
SQL compilation error: Invalid expression [JAVASCRIPT_V('ARGON2_HASH', 'PASSWORD_INPUT,DIFFSALT_INPUT', ' va
```


```sql
INSERT INTO "DEMO_DB"."PUBLIC"."USERS" (username, hash) 
SELECT  'name1' as username,
                DEMO_DB.PUBLIC.argon2_hash('password', 'PRESALT' || 'name1')
UNION ALL
SELECT  'name2' as username,
                DEMO_DB.PUBLIC.argon2_hash('password2', 'PRESALT' || 'name2')
```


Read the table:

| Row | USERNAME | HASH |
| 1 | name1 | $argon2i$v=19$m=8,t=2,p=1$UFJFU0FMVG5hbWUx$lQ9WY9LHa8SRyuxtnsvJOwzF0dGTRIw5gxdCMgynQ0k |
| 2 | name2 | $argon2i$v=19$m=8,t=2,p=1$UFJFU0FMVG5hbWUy$A+FjQNP3L/1x/OBYdGM0fVwFkayl09kgHK2q7ZibDZM |


### Checking the valid pass:

``` sql

SELECT username, DEMO_DB.PUBLIC.argon2_verify(hash, 'password') as valid
FROM DEMO_DB.PUBLIC.users
where USERNAME = 'name1'

```

| Row | USERNAME |  VALID |
| 1 | name1 |  true | 


### Checking with an invalid password

``` sql

SELECT username, DEMO_DB.PUBLIC.argon2_verify(hash, 'invalid_password') as valid
FROM DEMO_DB.PUBLIC.users
where USERNAME = 'name1'

```

| Row | USERNAME |  VALID |
| 1 | name1 |  false | 
