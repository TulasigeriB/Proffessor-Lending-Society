import express from 'express';
import http from 'http';
import path from 'path';
import dotenv from 'dotenv';
import cors from 'cors';

import { getLoansById, getLoansByLoanId, getLoanDefaults, login, register, getLoans, createLoan, createLoanRepayment, buyShare, adminLogin, getUserById, connection, getTransactionsByMemberId, getCommitteeMembers } from './db/db.js'

dotenv.config();

const __dirname = path.resolve();
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json({ limit: '50mb' }));
app.use(cors());

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Global error:', err);
    res.status(err.statusCode || 500).json({
        error: err.message || 'Internal Server Error'
    });
});

app.get("/api/admin/viewlogin", (req, res) => {
    try {
        res.sendFile(__dirname + '/public/admin-login.html');
    } catch (error) {
        res.status(500).send(error);
    }
});

function startsWithAdminEmail(email) {
    const regex = /^admin\b/i;
    return regex.test(email);
}

app.post("/api/admin/login", async (req, res) => {
    try {
        let credentials = await adminLogin(req.body);
        if (typeof credentials != "string") {
            if (credentials.password === req.body.password && startsWithAdminEmail(credentials.email)) {
                res.status(200).sendFile(__dirname + "/public/dashboard-admin.html");
            } else {
                res.status(401).send({ "error": 'Invalid password' });
            }
        } else {
            res.status(401).send({ "error": 'Invalid password' });
        }
    } catch (error) {
        console.error('Admin login error:', error);
        res.status(500).send({ "error": "Internal server error" });
    }
});


// START OF AUTH ENDPOINTS

app.post("/api/auth/register", async (req, res) => {
    try {
        let loginDetails = await register(req.body);
        let user = await getUserById(loginDetails);
        res.status(200).send(user);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);

    }
});

app.post("/api/auth/login", async (req, res) => {
    try {
        let credentials = await login(req.body);
        if (typeof credentials != "string") {
            console.log(credentials);

            if (credentials.password === req.body.password) {
                console.log('Password matched');
                res.status(200).send(credentials);
            } else {
                console.log('Invalid password');
                res.status(401).send({ "error": 'Invalid password' });
            }
        } else {
            res.status(401).send({ "error": 'Invalid password' });
        }

    } catch (error) {
        console.error(error);
        res.status(500).send({ "error": "Internal server error" });
    }
});

// END OF AUTH ENDPOINTS

// START OF LOAN ENDPOINTS
app.get("/api/loans/:id", async (req, res) => {
    try {
        let loans = await getLoansById(req.params);
        res.status(200).send(loans);
    } catch (error) {
        res.status(500).send("error while fetching loans");
    }
});

app.get("/api/loan/:id", async (req, res) => {
    try {
        let loans = await getLoansByLoanId(req.params);
        res.status(200).send(loans);
    } catch (error) {
        res.status(500).send("error while fetching loans");
    }
});

app.get("/api/loans", async (req, res) => {
    try {
        let loans = await getLoans();
        res.status(200).send(loans);
    } catch (error) {
        res.status(500).send("error while fetching loans");
    }
});

app.post("/api/loan", async (req, res) => {
    try {
        await createLoan(req.body);
        res.status(200).send("Successfuly created a loan");
    } catch (error) {
        res.status(500).send("Error while creating a Loan" + error);
    }
});

app.post("/api/loan/repay", async (req, res) => {
    try {
        await createLoanRepayment(req.body);
        res.status(200).send("loan EMI is paid.");
    } catch (error) {
        res.status(500).send("failed to pay the EMI try again");
    }
});

// END OF LOAN ENDPOINTS

// START OF THE SHARES RELATED ENDPOINTS
app.post("/api/share/buy", async (req, res) => {
    try {
        await buyShare(req.body);
        res.status(200).send("share bought");
    } catch (error) {
        res.status(500).send("share buy failed try again.")
    }
});
// END OF THE SHARES RELATED ENDPOINTS

app.get("/api/loan-defaults", async (req, res) => {
    try {
        let getDefaults = await getLoanDefaults();
        res.status(200).json(getDefaults);
    } catch (error) {
        res.status(500).send("Error fetching loan defaults");
    }
});
app.get("/api/dashboard/summary", async (req, res) => {
    try {
        const [
            sharePriceResult,
            totalSharesResult,
            fundResult,
            fundsHistoryResult,
            ownedResult,
            reservedResult,
            availableResult,
            transactionsResult
        ] = await Promise.all([
            new Promise((resolve, reject) => {
                connection.query(`SELECT current_price FROM Shares ORDER BY purchase_date DESC LIMIT 1`, (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                });
            }),
            new Promise((resolve, reject) => {
                connection.query(`SELECT SUM(share_count) as total FROM Members WHERE status='active'`, (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                });
            }),
            new Promise((resolve, reject) => {
                connection.query(`SELECT total_value, available_funds, emergency_reserve FROM Fund ORDER BY update_date DESC LIMIT 1`, (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                });
            }),
            new Promise((resolve, reject) => {
                connection.query(`SELECT DATE_FORMAT(update_date, '%b') as month, total_value FROM Fund ORDER BY update_date`, (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                });
            }),
            new Promise((resolve, reject) => {
                connection.query(`SELECT SUM(share_count) as owned FROM Members WHERE status='active'`, (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                });
            }),
            new Promise((resolve, reject) => {
                connection.query(`SELECT emergency_reserve FROM Fund ORDER BY update_date DESC LIMIT 1`, (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                });
            }),
            new Promise((resolve, reject) => {
                connection.query(`SELECT available_funds FROM Fund ORDER BY update_date DESC LIMIT 1`, (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                });
            }),
            new Promise((resolve, reject) => {
                connection.query(`SELECT t.type, t.amount, m.name FROM Transactions t LEFT JOIN Members m ON t.member_id = m.member_id ORDER BY t.transaction_date DESC LIMIT 5`, (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                });
            })
        ]);

        // MySQL returns results directly from the Promise
        const sharePrice = sharePriceResult[0]?.current_price || 0;
        const totalShareHoldings = totalSharesResult[0]?.total || 0;
        const currentMRP = sharePrice;
        const fund = fundResult[0] || {};
        const fundsHistory = fundsHistoryResult || [];
        const shareDistribution = {
            owned: ownedResult[0]?.owned || 0,
            reserved: reservedResult[0]?.emergency_reserve || 0,
            available: availableResult[0]?.available_funds || 0
        };
        const transactions = transactionsResult || [];

        res.json({
            sharePrice,
            totalShareHoldings,
            currentMRP,
            fund,
            fundsHistory,
            shareDistribution,
            transactions
        });
    } catch (error) {
        console.error('Dashboard summary error:', error);
        res.status(500).json({ error: 'Dashboard summary failed' });
    }
});

// START OF TRANSACTION ENDPOINTS
app.get("/api/transactions/:id", async (req, res) => {
    try {
        const transactions = await getTransactionsByMemberId(req.params.id);
        res.status(200).json(transactions);
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ error: "Error while fetching transactions" });
    }
});
// END OF TRANSACTION ENDPOINTS

// START OF COMMITTEE ENDPOINTS
app.get("/api/committee", async (req, res) => {
    try {
        const committeeMembers = await getCommitteeMembers();

        res.status(200).json(committeeMembers);
    } catch (error) {
        console.error('Error fetching committee members:', error);
        
        res.status(500).json({ error: "Error while fetching committee members" });
    }
});
// END OF COMMITTEE ENDPOINTS

server.listen(PORT, () => {
    console.log(`Running on http://localhost:${PORT}/`);
});
