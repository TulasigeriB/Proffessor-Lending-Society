import mysql from 'mysql';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
const saltRounds = 10;

let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'professor_lending'
});

connection.connect(function (err) {
    if (err) {
        return console.error('error: ' + err.message);
    }
    else {
        console.log('Connected to the MySQL server.');
    }
});

async function hashPassword(password) {
    try {
        const hashed = await bcrypt.hash(password, saltRounds);
        return hashed;
    } catch (err) {
        throw err;
    }
}

export async function register(details) {
    return new Promise(async (resolve, reject) => {
        let id = uuidv4();
        let query = `INSERT INTO Members(member_id,name,email,password,phone,department,institution,membership_level,share_count,credit_score,join_date,status) VALUES ('${id}','${details.name}','${details.email}','${details.password}','${details.phone}','${details.dept}','${details.inst}','${details.memb_lv}','${details.sh_count}',700.00,current_timestamp(),'active')`;

        connection.query(query, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(id);
            }
        });
    });
}

export async function login(credentials) {
    return new Promise(async (resolve, reject) => {
        let query = `SELECT * FROM Members where email='${credentials.email}'`;

        connection.query(query, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result.length > 0 ? result[0] : "username not found");
            }
        })
    })
}

export async function getLoansById(params) {
    return new Promise(async (resolve, reject) => {
        let query = `SELECT * FROM Loans where member_id='${params.id}'`;

        connection.query(query, (error, result) => {
            if (error)
                reject(error)
            else
                resolve(result);
        });
    })
}

export async function getLoans() {
    return new Promise(async (resolve, reject) => {
        let query = `SELECT * FROM Loans;`;

        connection.query(query, (error, result) => {
            if (error)
                reject(error)
            else
                resolve(result);
        });
    })
}
export async function createLoan(loan) {
    return new Promise(async (resolve, reject) => {
        let query = `INSERT INTO Loans(loan_id,member_id,amount,purpose,interest_rate,term_months,emi,status,application_date,approval_date,collateral_type,collateral_address,collateral_number,collateral_value,collateral_details,approved_by) VALUES ('${uuidv4()}','${loan.member_id}',${loan.amount},'${loan.purpose}',${loan.interest},${loan.months},${loan.emi},'pending',current_timestamp(),NULL,'${loan.cl_type}','${loan.cl_add}','${loan.cl_num}',${loan.cl_value},'${loan.cl_detail}',NULL);`;

        connection.query(query, (error, result) => {
            if (error)
                reject(error)
            else
                resolve(result);
        });
    })
}

export async function createLoanRepayment(params) {
    return new Promise(async (resolve, reject) => {
        let query = `INSERT INTO Repayments(repayment_id,loan_id,payment_date,amount_paid,is_emi,penalty) VALUES ('${uuidv4()}','${params.loan_id}',current_timestamp(),${params.amount_paid},${params.is_emi},${params.penalty});`;
        connection.query(query, (error, result) => {
            if (error)
                reject(error)
            else
                resolve(result);
        });
    });
}

export async function buyShare(params) {
    return new Promise(async (resolve, reject) => {
        let query = `INSERT INTO Shares(share_id,member_id,purchase_date,purchase_price,current_price) VALUES ('${uuidv4()}','${params.member_id}',current_timestamp(),${params.pur_price},${params.cur_price});`;
        connection.query(query, (error, result) => {
            if (error)
                reject(error)
            else
                resolve(result);
        });
    });
}

export async function adminLogin(params) {
    return new Promise(async (resolve, reject) => {
        let query = `SELECT * FROM Members where email='${params.email}'`;

        connection.query(query, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result.length > 0 ? result[0] : "username not found");
            }
        })
    })
}