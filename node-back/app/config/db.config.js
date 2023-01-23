export const HOST = "172.16.101.131";
export const USER = "postgres";
export const PASSWORD = "Robotti123";
export const DB = "test_db";
export const dialect = "postgres";
export const pool = {
  max: 5,
  min: 0,
  acquire: 30000,
  idle: 10000
};