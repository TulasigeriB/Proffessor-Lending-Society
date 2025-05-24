import express from 'express';
import http from 'http';
import path from 'path';
import dotenv from 'dotenv';
import cors from 'cors';
import bcrypt from 'bcrypt';

import { getLoansById, login, register, getLoans, createLoan, createLoanRepayment, buyShare, adminLogin } from './db/db.js'

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

app.post("/api/admin/login", async (req, res) => {
    try {

        let credentials = await adminLogin(req.body);
        if (typeof credentials != "string") {
            if (credentials.password === req.body.password) {
                res.status(200).sendFile(__dirname+"/public/dashboard-admin.html");
                res.status(200).send(credentials);
            } else {
                res.status(401).send({ "error": 'Invalid password' });
            }
        } else {
            res.status(401).send({ "error": 'Invalid password' });
        }

    } catch (error) {

    }
})


// START OF AUTH ENDPOINTS

app.post("/api/auth/register", async (req, res) => {
    try {
        let loginDetails = await register(req.body);
        res.status(200).send(loginDetails);
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
    }
});

app.post
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

server.listen(PORT, () => {
    console.log(`Running on http://localhost:${PORT}/`);
});