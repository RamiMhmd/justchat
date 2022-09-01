
// Importing the packages required for the project.  
const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
const randtoken = require('rand-token');
const WebSocket = require('ws');
const mysqlConnection = require('./dbConfig');
const cloudinary = require("cloudinary").v2;
const server = require('http').Server(app);
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  }
});
const port = 3000;
require('dotenv').config()
app.use(bodyparser.json());




// To check whether the connection is succeed for Failed while running the project in console.  
mysqlConnection.connect((err) => {
    if (!err) {
        console.log("Db Connection Succeed");
    }
    else {
        console.log("Db connect Failed \n Error :" + JSON.stringify(err, undefined, 2));
    }
});

// To Run the server with Port Number  
//app.listen(3000, () => console.log("Express server is running at port no : 3000"));
server.listen(port, () => {
    console.log("Listening on port " + port);
  });
// Allow cross origin

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

//Web socket configuration

io.on('connection', (socket) => {
    console.log('new connection made');
    
    socket.on('msgNotify', (data) => {
      console.log(data);
    });  
    });
// const wss = new WebSocket.Server({ port: 8080 })
// const url = 'ws://localhost:8080'
// wss.on('connection', ws => {
//                 ws.on('message', message => {
//                     console.log(`Received message => ${message}`)
//                 })
//                 ws.send('Hello! Message From Server!!')
//             })


//ERROR HANDLING AND JPA METHODS.

//Get user by email

let db = {};
db.getUserByEmail = (email) => {
    return new Promise((resolve, reject) => {
        mysqlConnection.query('SELECT * FROM users WHERE email = ?', [email], (error, users) => {
            if (error) {
                return reject(error);
            }
            return resolve(users[0]);
        });
    });
};

// Get user by token

let db2 = {}
db2.getUserByToken = (token) => {
    return new Promise((resolve, reject) => {
        mysqlConnection.query('SELECT * FROM users WHERE token = ?', [token], (error, users) => {
            if (error) {
                return reject(error);
            }
            return resolve(users[0]);
        });
    });
};

//Get user by user ID

let db3 = {}
db3.getUserByUserId = (id) => {
    return new Promise((resolve, reject) => {
        mysqlConnection.query('SELECT * FROM users WHERE userid = ?', [id], (error, users) => {
            if (error) {
                return reject(error);
            }
            return resolve(users[0]);
        });
    });
};
//Send Message by receiver ID
function sendMsg(req,res,msgdata,senderId,receiverId,status,date,threadid){
      
        let sql = `INSERT INTO messages (msgdata, sender, receiver, status, date, threadid) VALUES 
        ( "${msgdata}", "${senderId}", "${receiverId}","${status}" ,"${date}","${threadid}")`;
        mysqlConnection.query(sql, function (err) {
            if (!err) {
                res.json({
                    message: "Message saved"
                });
                io.emit("msgNotify", receiverId);
            // const connection = new WebSocket(url)
            // connection.onopen = () => {
            //     connection.send('Message From Client: '+ req.params.receiverId)
            // }
            // connection.onerror = (error) => {
            //     console.log(`WebSocket error: ${error}`)
            // }
            // connection.onmessage = (e) => {
            //     console.log(e.data)
            // }
            }
            if (err) throw err;
            console.log('record inserted');
        });
}

//Token Authentication

function verifyToken(req, res, next) {
    let verify_status = false;
    let currentUserId;
    const token = req.headers['authorization'];
    if (token === undefined) {

        return res.status(400).json({ message: 'Access Denied! Unauthorized User' }), verify_status;
    } else {
        jwt.verify(token, process.env.SECRET_KEY, (err, authData) => {
            if (err) {
                return res.status(401).json({ message: 'Invalid Token' }), verify_status;

            } else {
                verify_status = true;
                currentUserId = authData.user;
            }
        })
        return [verify_status, currentUserId];
    }
}

//Pagination

function paginate(page, count, rows) {
    if (page === undefined || page === null || isNaN(page)) {
        page = 1;
    }
    if (count === undefined || count === null || isNaN(count)) {
        count = 10;
    }
    const startIndex = (page - 1) * count;
    const endIndex = page * count;
    const results = {};
    if (endIndex < rows.length) {
        results.next = {
            page: page + 1,
            count: count,
            total: rows.length
        };
    }

    if (startIndex > 0) {
        results.previous = {
            page: page - 1,
            count: count,
            total: rows.length
        };
    }
    results.results = rows.slice(startIndex, endIndex);
    return results;
}


// CRUD METHODS  


//Get all users  
app.get('/users', (req, res, next) => {

    let verify = verifyToken(req, res, next);
    if (!verify[0]) {
        return;
    }
    let page = req.query.page;
    let count = req.query.count;
    mysqlConnection.query('SELECT userid,username,email,image,gender FROM users', (err, rows) => {
        if (!err) {
            rows = paginate(page, count, rows);
            res.send(rows);
        }
        else
            console.log(err);

    })
});

//Get user by id
app.get('/users/:id', (req, res, next) => {
    let verify = verifyToken(req, res, next);
    if (!verify[0]) {
        return;
    }
    mysqlConnection.query('SELECT userid,username,email,image,gender FROM users WHERE userid = ?', [req.params.id], (err, fields) => {
        if (!err) {
            res.send(fields);                         
   
        }
        else
            console.log(err);

    })
});

//Delete user by id
app.delete('/users/:id', (req, res, next) => {
    let verify = verifyToken(req, res, next);
    if (!verify[0]) {
        return;
    }
    mysqlConnection.query('DELETE FROM users WHERE userid = ?', [req.params.id], (err) => {
        if (!err) {
            res.json({
                message: "Data Deletion Successful"
            });
        }
        else
            console.log(err);

    })
});

// Create new user      
app.post('/users', (req, res) => {
    let obj = req.body;
    let sql = `INSERT INTO users (username, email, password, image, gender) VALUES ( "${obj.username}", "${obj.email}", "${obj.password}","${obj.image}" ,"${obj.gender}")`;
    mysqlConnection.query(sql, function (err) {
        if (!err)
            res.json({
                message: "User registerd"
            });
        if (err) throw err;
        console.log('record inserted');
    });
});

//Send a message from one user to another
app.post('/sendmsg/:receiverId', (req, res, next) => {
    let verify = verifyToken(req, res, next);
    if (!verify[0]) {
        return;
    }
    let obj = req.body;
    let senderId = verify[1];
    let receiverId = parseInt(req.params.receiverId);
    let status = 0;
    let d = new Date();
    let date = d.toISOString().slice(0, 19).replace('T', ' ');
    let threadid;
    if (senderId === receiverId) {
        return res.status(400).json({ message: 'Sent message to yourself not allowed' })
    }
    else if(obj.msgdata === undefined || obj.msgdata === null || obj.msgdata.trim().length === 0){
        return res.status(401).json({ message: 'Message not found' })
    }
    else {

        mysqlConnection.query('SELECT * FROM threads WHERE sender = ? AND receiver = ? UNION SELECT * FROM threads WHERE sender = ? AND receiver = ?',
         [senderId,receiverId,receiverId,senderId], (err, rows1) => {
            if (!err) {
                //res.send(rows1);                        
               if(rows1.length === 0){
                let sql1 = `INSERT INTO threads (sender, receiver, lastmsg, date ,status) VALUES ( "${senderId}", "${receiverId}", "${obj.msgdata}","${date}","${status}")`;
                mysqlConnection.query(sql1, function (err,results) {
                    if (!err){
                        threadid = results.insertId;
                        sendMsg(req,res,obj.msgdata,senderId,receiverId,status,date,threadid);
                    }                   
                    if (err) throw err;
                });
               }
               else{
                threadid = rows1[0].threadid; 
                mysqlConnection.query('UPDATE threads SET sender = ? ,receiver = ? ,lastmsg =? ,date = ? ,status = ? WHERE threadid = ? ',
                [senderId, receiverId,obj.msgdata,date,status,threadid], (err) => {
                    if (!err){
                        sendMsg(req,res,obj.msgdata,senderId,receiverId,status,date,threadid);
                        }
                    if (err) throw err;
                });

               }
            }
            else
                console.log(err);
    
        })
        
        // let sql = `INSERT INTO messages (msgdata, sender, receiver, status, date) VALUES ( "${obj.msgdata}", "${senderId}", "${receiverId}","${status}" ,"${date}")`;
        // mysqlConnection.query(sql, function (err) {
        //     if (!err) {
        //         res.json({
        //             message: "Message saved"
        //         });
                
        //             const connection = new WebSocket(url)
        //     connection.onopen = () => {
        //         connection.send('Message From Client: '+ req.params.receiverId)
        //     }
        //     connection.onerror = (error) => {
        //         console.log(`WebSocket error: ${error}`)
        //     }
        //     connection.onmessage = (e) => {
        //         console.log(e.data)
        //     }
        //     }
        //     if (err) throw err;
        //     console.log('record inserted');
        // });
    }
});

//Get messages by senderId and receiverId
app.get('/msg', (req, res, next) => {
    let verify = verifyToken(req, res, next);
    let page = parseInt(req.query.page);
    let count = parseInt(req.query.count);
    if (page === undefined || page === null || isNaN(page)) {
        page = 1;
    }
    if (count === undefined || count === null || isNaN(count)) {
        count = 10;
    }
    if (!verify[0]) {
        return;
    }
    let senderId = verify[1];
    let receiverId = parseInt(req.query.receiverId);
    if (senderId === receiverId) {
        return res.status(400).json({ message: 'No messages send by yourself' })
    }
    mysqlConnection.query('SELECT * FROM messages WHERE sender = ? AND receiver = ? UNION SELECT * FROM messages WHERE receiver = ? AND sender = ? ORDER BY date DESC',
        [senderId, receiverId, senderId, receiverId], (err, rows) => {
            if (!err) {
                rows = paginate(page, count, rows);
                res.send(rows);
            }
            else
                console.log(err);

        })
});

//Read message

app.put('/readmsg/:participantId', (req, res, next) => {
    let verify = verifyToken(req, res, next);
    if (!verify[0]) {
        return;
    }
    let currentUserId = verify[1];
    let participantId = parseInt(req.params.participantId);
    let status = 1;
    if (currentUserId === participantId) {
        return res.status(400).json({ message: 'No messages to read by yourself' })
    }
    mysqlConnection.query('UPDATE messages SET status = ? WHERE sender = ? AND receiver = ?;UPDATE threads SET status = ? WHERE sender = ? AND receiver = ?',
        [status, participantId,currentUserId,status, participantId,currentUserId], (err, rows) => {
            if (!err)
                res.json({
                    message: "Message readed"
                });
            if (err) throw err;
            console.log('Read msg');
        });
});

//Get message threads and last message
app.get('/threads', (req, res, next) => {
    let verify = verifyToken(req, res, next);
    if (!verify) {
        return;
    }
    let page = parseInt(req.query.page);
    let count = parseInt(req.query.count);
    let currentUserId = verify[1];
    let rows3=[];
    // mysqlConnection.query('SELECT msgid,msgdata as lastmsg,sender as senderId,receiver as receiverId,status,date FROM messages WHERE (receiver,date,sender) in (SELECT receiver,MAX(date),sender FROM messages WHERE sender = ? GROUP BY receiver)',
    //     [senderId], (err1, rows1) => {
        mysqlConnection.query('SELECT * FROM threads WHERE sender = ? UNION SELECT * FROM threads WHERE receiver = ? ORDER BY date',
        [currentUserId,currentUserId], (err1, rows1) => {
            if (!err1) {

                mysqlConnection.query('SELECT * FROM users', (err2, rows2) => {
                    if (!err2) {
                        for (let i = 0; i < rows1.length; i++) {
                            for (let j = 0; j < rows2.length; j++) {                               
                                if ((rows1[i].sender === rows2[j].userid && rows1[i].receiver === currentUserId) || 
                                    (rows1[i].receiver === rows2[j].userid && rows1[i].sender === currentUserId)) {
                                    rows3.push({
                                       "participantId": rows2[j].userid,
                                       "participantName": rows2[j].username,
                                       "participantGender": rows2[j].gender,
                                       "participantEmail": rows2[j].email,
                                       "participantImage": rows2[j].image,
                                       "senderId": rows1[i].sender,
                                       "receiverId": rows1[i].receiver,
                                       "lastMsg": rows1[i].lastmsg,
                                       "status": rows1[i].status,
                                       "threadid": rows1[i].threadid,
                                       "date": rows1[i].date,
                                    });
                                }
                            }
                        }
                        rows1 = paginate(page, count, rows3);
                        res.send(rows1);
                    } else { console.log(err2); }
                })

            }
            else { console.log(err1); }
        })
});

//Upload user profile image
app.post('/userimage', async (req, res, next) => {
    let verify = verifyToken(req, res, next);
    if (!verify[0]) {
        return;
    }
    let currentUserId = verify[1];
    const user = await db3.getUserByUserId(currentUserId);
    cloudinary.config({
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.API_KEY,
        api_secret: process.env.API_SECRET
    });
    cloudinary.uploader.upload(req.body.image, { folder: 'JustChat' })
        .then((result) => {
            mysqlConnection.query('UPDATE users SET image = ? WHERE userid = ? ',
                [result.url, currentUserId], (err, rows) => {
                    if (!err) {
                        res.status(200).send({
                            status: "upload success",
                            image: result.url,
                            userid: user.userid,
                            username: user.username,
                            gender: user.gender,
                            email: user.email
                        });
                    }
                    else
                        console.log(err);

                })
        }).catch((error) => {
            res.status(500).send({
                message: "failure",
                error,
            });
        });
});


//Forgot password and send email API
app.post('/forgotpassword', async (req, res, next) => {
    try {
        const email = req.body.email;
        const user = await db.getUserByEmail(email);
        const token = randtoken.generate(20);
        if (!user) {
            return res.status(400).json({ message: 'User not exist' });
        } else {
            user.resetPasswordToken = token;
            user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
            const smtpTransport = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 587,
                auth: {
                    user: 'ramimohammedtr123@gmail.com',
                    pass: 'bdtnkgkupdhrodww',
                },
            });
            smtpTransport.verify().then(console.log).catch(console.error);
            let mailOptions = {
                to: user.email,
                from: 'ramimohammedtr123@gmail.com',
                subject: 'JustChat Password Reset',
                text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                    'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                    'http://' + req.headers.host + '/resetpassword/' + token + '\n\n' +
                    'If you did not request this, please ignore this email and your password will remain unchanged.\n',
                html: '<!DOCTYPE html>' +
                    '<html><head><h2>Reset Password</h2>' +
                    '</head><body><div>' +
                    '<img src="https://res.cloudinary.com/ramimohammed/image/upload/v1660124260/JustChat/JustChat_nhntwo.png" alt="" width="360">' +
                    '<p>Hi &nbsp;' + user.username + '</p>' +
                    '<p>Thank you for being JustChat user.</p>' +
                    '<h3>Here is your Password Reset Token:</h3>' +
                    '<h1 style="color:blue;">' + token + '</h1>' +
                    '<p style="color:red;fontSize:10px">Note : This token valid only for 5 minitues</p>' +
                    '</div></body></html>' +
                    '<style>  h1{ color: red;} h3{ color: blue;}</style>'
            };
            smtpTransport.sendMail(mailOptions, function (err, info) {

                if (err) {
                    return res.status(400).json({ message: 'Email sending failed' });
                }
                else {
                    mysqlConnection.query('UPDATE users SET token = ? WHERE userid = ?',
                        [token, user.userid], (err1, rows) => {
                            if (!err1) {
                                res.json({
                                    message: 'An email has been sent with further instructions.',
                                    token: user.resetPasswordToken,
                                    expiry: user.resetPasswordExpires
                                });
                                setTimeout(() => {
                                    const expired_token = null;
                                    mysqlConnection.query('UPDATE users SET token = ? WHERE userid = ?',
                                        [expired_token, user.userid], (err2, rows) => {
                                            if (!err2) {
                                                console.log("Token expires and clear from DB")
                                            }
                                            if (err2) throw err2;
                                        });
                                    console.log(`Delayed`);
                                }, 300000); //Token will be clear from DB after 5 minutes.
                            }
                            if (err1) throw err1;
                        });
                }
            });
        }
    } catch (e) {
        console.log(e);
    }
});

//Reset Password API

app.put('/resetpassword', async (req, res, next) => {
    let token = req.body.token;
    let password = req.body.password;
    const user = await db2.getUserByToken(token);
    if (user) {
        token = null;
        mysqlConnection.query('UPDATE users SET token = ? , password = ? WHERE userid = ?',
            [token, password, user.userid], (err, rows) => {
                if (!err) {
                    res.json({
                        message: 'Password reset successful',
                        userid: user.userid,
                        username: user.username,
                        email: user.email
                    });
                }
                if (err) throw err;
                console.log('Error');
            });
    }
    else {
        return res.status(400).json({ message: 'Password reset failed' });
    }
});

//Login API

app.post('/login', async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const user = await db.getUserByEmail(email);
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }
        if (password === user.password) {
            user.password = undefined;
            const jsontoken = jwt.sign({ user: user.userid }, process.env.SECRET_KEY, { expiresIn: '1440m' });
            res.cookie('token', jsontoken, { httpOnly: true, secure: true, SameSite: 'strict', expires: new Date(Number(new Date()) + 30 * 60 * 1000) }); //we add secure: true, when using https.
            res.json({ token: jsontoken, email: user.email, userid: user.userid, username: user.username, gender: user.gender, image: user.image });
            //return res.redirect('/mainpage') ;

        } else {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

    } catch (e) {
        console.log(e);
    }
});



