
const Config = {
  url: 'ldap://adbl.local:389',
  baseDN: 'dc=wk,dc=local',
  adminDN: 'cn=adminblueseas,cn=Users,dc=wk,dc=local',
  adminPass: 'Wuekr0@1',
  secret_key: 'Aomlnwza007',
  saltRounds: 10,
}

const Pgconfig = {
  user: 'postgres',
  host: 'localhost',
  database: 'blueleave',
  password: 'Pass@27052002',
  port: 5432,
}


module.exports = { Config,Pgconfig };