// implement your API here
const express = require('express');
const db = require('./data/db');

const server = express();
server.use(express.json());


// server.post('/api/users', (req, res) => {
//     const userInfo = req.body;
//     console.log(userInfo)
//     db.insert(userInfo)
//         .then(user => {
//             if (!userInfo.name || !userInfo.bio){
//                 res.status(400).json({ errorMessage: "Please provide name and bio for the user."});
//             }
//             else {
//                 console.log(user.id)
//                 db.findById(user.id).then(newUser => {
//                     res.status(200).json(newUser)
//                 } )
//                 .catch(error => res.status(500).json({error: "The user information could not be modified."}))
                

//                 res.status(201).json(user);
//             }
//         })
//         .catch(err => {
//             res.status(500).json({error: "There was an error while saving the user to the database."});
//         });
// });

server.post('/api/users', (req, res) => {
    const userInfo = req.body;
   if (userInfo.name && userInfo.bio){
        db
        .insert(userInfo)
        .then(id => {
         db
         .findById(id.id)
         .then(user => {
             res.status(200).json(user)
         })
         .catch(err => {
             res.status(404).json({message: 'user with the specified id could not be found'})
         })
        })
        .catch(err => {
            res.status(500).json({message: 'there was an error while saving user'})
        })
   } else {
        res.status(400).json({message: 'please provide a name and bio for this user'})
   }
});


server.get('/api/users', (req, res) => {
    db.find()
        .then(users => {
            res.status(200).json(users);
        })
        .catch(err => {
            res.status(500).json({error: "The users information could not be retrieved."});

        });
});


server.get('/api/users/:id', (req, res) => {
    const { id } = req.params;
    db.findById(id)
        .then(user => {
            if(user) {
                res.status(200).json(user);
            }
            else { 
                res.status(404).json({ message: "The user with the specified id does not exist."})
            }
        })
        .catch(err => {
            res.status(500).json({error: "The user information could not be retrieved."});

        });
});

server.delete('/api/users/:id', (req, res) => {
    const id = req.params.id;
    db.remove(id)
        .then(user => {
            if(user){
                res.status(200).json(user);
            }
            else{
                res.status(404).json({message: "The user with the specified id does not exist."})
            }
        })
        .catch(err => {
            res.status(500).json({error: "The user could not be removed"})
        });
});

// server.put('/api/users/:id', (req, res) => {
//     const {id} = req.params;
//     const changes = req.body;
//     db.update(id, changes)
//         .then(updated => {
//             if(updated){
//                 res.status(200).json(updated);
//             }
//             else if (changes.name || changes.bio) {
//                 res.status(404).json({message: "The user with the specified id does not exist."});
//             }
//             else{
//                 res.status(400).json({message: "Please provide name and bio for the user."})
//             }
//         })
//         .catch(err => {
//             res.status(500).json({error: "The user information could not be modified."})

//         })
// })

server.put('/api/users/:id', (req,res) => {
    const id = req.params.id
    const changes = req.body

    !changes.name || !changes.bio ? res.status(400).json({errorMessage: "Please provide name and bio for the user."}) :

    db.update(id, changes)
        .then( updated => {
            console.log("SUCCESS", updated);
            console.log("ID", id);
           if(updated){
            db.findById(id).then(user => {
                res.status(200).json(user)
            } )
            .catch(error => res.status(500).json({error: "The user information could not be modified."}))
            
           } else {
               res.status(404).json({  message: "The user with the specified ID does not exist." });
           }
        })
        .catch( error => {
            res.status(500).json({ error: "The user information could not be modified." })
        })

} )





const port = 8000;
server.listen(port, () => console.log('api running'));
