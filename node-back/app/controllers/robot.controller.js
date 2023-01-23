import { Pool } from "pg";

const pool3 = new Pool({
  user: "kndb",
  host: "172.16.101.98",
  database: "Fdlab1",
  password: "kn13",
  port: 5432,
});

export function getAllData(req, res, next) {
  pool3.query(`SELECT * FROM ${req.params.table}`, (error, results) => {
    if (error) {
      next(error);
    } else {
      res.status(200).json(results.rows);
    }
  });
}

export function getSignalData(req, res, next) {
  let sql = `SELECT * FROM ${req.params.table}
  WHERE city = '${req.params.city}'
  AND
  place = '${req.params.place}'
  AND
  machine = '${req.params.machine}'
  AND
  machine_type = '${req.params.type}'
  AND
  machine_module = '${req.params.module}'
  AND
  signal_name = '${req.params.signalName}'
  AND
  signal_number = '${req.params.signalNumber}'
  `;
  if (req.params.table == "gen1") {
    pool3.query(sql, (error, results) => {
      if (error) {
        next(error);
      } else {
        res.status(200).json(results.rows);
      }
    });
  } else {
    sql = sql.concat(`AND meas_name = '${req.params.measure}'`);
    pool3.query(sql, (error, results) => {
      if (error) {
        next(error);
      } else {
        res.status(200).json(results.rows);
      }
    });
  }
}

export function getrealfilter(req, res, next) {
  if (req.params.table == "gen1") {
    pool3.query(
      `SELECT DISTINCT a.city, a.place, a.machine, a.machine_type, a.machine_module, a.signal_name, a.signal_number, a.signal_unit FROM (SELECT * FROM ${req.params.table}) a`,
      (error, results) => {
        if (error) {
          next(error);
        } else {
          res.status(200).json(results.rows);
        }
      }
    );
  } else {
    pool3.query(
      `SELECT DISTINCT a.city, a.place, a.machine, a.machine_type, a.machine_module, a.signal_name, a.signal_number, a.signal_unit, a.meas_name FROM (SELECT * FROM ${req.params.table}) a`,
      (error, results) => {
        if (error) {
          next(error);
        } else {
          res.status(200).json(results.rows);
        }
      }
    );
  }
}
