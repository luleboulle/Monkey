const express = require('express')
const path = require('path');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express()
const models = require('./models/index');



// Decode json and x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Add a bit of logging
app.use(morgan('short'))

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, '/views'))

app.use('/Content', express.static(__dirname + '/Content'));
app.use('/Css', express.static(__dirname + '/Css'));
app.use('/JS', express.static(__dirname + '/JS'));

//Association
models.Monkey.belongsTo(models.Enclos);
models.Enclos.hasMany(models.Monkey, { as: "Monkey" });

app.get('/', function (req, res) {
    res.render('index')


})


//obtenir les infos
app.get('/monkey', function (req, res) {
    console.log(req.query)
    models.Monkey.findAll({
        where: req.query
    })

        .then((monkey) => {
            res.render('monkey', { Monkey: monkey });

        })
        .catch((err) => {
            res.json(err)
        })
})


//créer une table de singe
app.post('/monkey', function (req, res) {
    models.Monkey.create({
        name: req.body.name,
        race: req.body.race,
        genre: req.body.genre,
        age: req.body.age,
        weight: req.body.weight,

    }),
        models.Monkey.findAll({
            where: req.query
        })
            .then((monkey) => {
                res.redirect('/monkey')
            })
            .catch((err) => {
                res.json(err)
            })

})


//recupérer un seul singe par nom
app.get('/monkey/name', function (req, res) {
    console.log(req.body);
    models.Monkey.findOne({
        where: {
            name: req.query.name
        }
    })
        .then((monkey) => {
            res.render('monkey', { Monkey: [monkey] });
        })
        .catch((err) => {
            res.json(err)
        })
})

//retrouver l'id du singe
app.get('/monkey/lien/:id', function (req, res) {

    models.Monkey.findOne({
        where: { id: req.params.id }
    })

        .then((monkey) => {
            res.render('lien', { Monkey: [monkey] });

        })
        .catch((err) => {
            res.json(err)
        })
})

//obtenir l'id du singe et afficher les enclos
app.get('/monkey/lienMonkey/:id', function (req, res) {
    models.Enclos.findAll({ where: req.query })
        .then((enclos) => {
            res.render('lienMonkey', { Enclos: enclos, id: req.params.id });
        })
})


//lier l'id du singe dans l'id de l'enclos
app.get('/lien/:monkey/:enclos', function (req, res) {
    models.Enclos.findOne({
        where: {
            id: req.params.enclos
        }
    })
        .then((Enclos) => {
            models.Monkey.findOne({
                where:
                {
                    id: req.params.monkey
                }
            })
                .then((Monkey) => {
                    Enclos.addMonkey(Monkey).then(() => {
                        res.redirect('/monkey')
                    })
                })
                .catch((err) => {
                    res.json(err)
                })
        })
})


//recupérer un seul singe par nom pour le modifier
app.get('/monkey/name/ToModify', function (req, res) {
    console.log(req.body);
    models.Monkey.findOne({
        where: {
            name: req.query.name
        }
    })
        .then((monkey) => {
            res.render('PutMonkey', { Monkey: [monkey] });
        })
        .catch((err) => {
            res.json(err)
        })
})


//mettre a jour un singe par nom
app.post('/monkey/name/Modify', function (req, res) {
    models.Monkey.update(
        req.body,
        {
            where: {
                name: req.body.oldname
            }
        })
        .then((monkey) => {
            res.redirect('/monkey');
        })
        .catch((err) => {
            res.json(err)
        })
})


/*//mettre a jour plusieurs singe
app.put('/monkey', function (req, res) {
    const promises = [];

    req.body.mutations
        .forEach((item) => {
            promises.push(
                models.Monkey.update(
                    item.data,
                    {
                        where:
                        {
                            id: item.id
                        }
                    }
                )
            )
        })
    Promise.all(promises)
        .then((response) => {
            res.json(response);
        })
        .catch((err) => {
            res.json(err);
        })
})*/


//supprimer un singe par le nom
app.post('/monkey/name', function (req, res) {
    console.log(req.body);
    models.Monkey.destroy({
        where: { name: req.body.name }
    })
        .then(() => {
            res.redirect('/monkey');
        })
        .catch((err) => {
            res.json(err)
        })

})



//////////////////////////////////////////////////////////////////-----------ENCLOS------------///////////////////////////////////////////////////////////////////////////


//obtenir les infos
app.get('/enclos', function (req, res) {
    console.log(req.query)
    models.Enclos.findAll({
        where: req.query
    })

        .then((enclos) => {
            res.render('enclos', { Enclos: enclos });

        })
        .catch((err) => {
            res.json(err)
        })
})

//créer une table de enclos
app.post('/enclos', function (req, res) {
    models.Enclos.create({
        number: req.body.number,
        lieux: req.body.lieux,
        proprete: req.body.proprete


    }),
        models.Enclos.findAll({
            where: req.query
        })
            .then((enclos) => {
                res.redirect('/enclos')
            })
            .catch((err) => {
                res.json(err)
            })

})

//recupérer un seul enclos par le nombre
app.get('/enclos/number', function (req, res) {
    console.log(req.body);
    models.Enclos.findOne({
        where: {
            number: req.query.number
        }
    })
        .then((enclos) => {
            res.render('enclos', { Enclos: [enclos] });
        })
        .catch((err) => {
            res.json(err)
        })
})

//obtenir l'id de l'enclos et associer l'id du singe a l'interieur
app.get('/enclos/lien/:id', function (req, res) {

    models.Enclos.findOne({
        where: { id: req.params.id }
    })

        .then((enclos) => {
            enclos.getMonkey().then(associatedTasks => {
                res.render('lienEnclos', { Enclos: [enclos], Monkey: associatedTasks })
            })


        })
        .catch((err) => {
            res.json(err)
        })
})


//recupérer un seul enclos par le numero pour le modifier
app.get('/enclos/number/ToModify', function (req, res) {
    console.log(req.body);
    models.Enclos.findOne({
        where: {
            number: req.query.number
        }
    })
        .then((enclos) => {
            res.render('PutEnclos', { Enclos: [enclos] });
        })
        .catch((err) => {
            res.json(err)
        })
})

//mettre a jour un enclos par le numero
app.post('/enclos/number/Modify', function (req, res) {
    models.Enclos.update(
        req.body,
        {
            where: {
                number: req.body.oldnumber
            }
        })
        .then((enclos) => {
            res.redirect('/enclos');
        })
        .catch((err) => {
            res.json(err)
        })
})


//supprimer un enclos par le numero
app.post('/enclos/number', function (req, res) {
    console.log(req.body);
    models.Enclos.destroy({
        where: { number: req.body.number }
    })
        .then(() => {
            res.redirect('/enclos');
        })
        .catch((err) => {
            res.json(err)
        })

})





//////////////////////////////////////////////////////////////////-----------API-REST------------///////////////////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////-----------MONKEY-API------------////////////////////////////////////////////////////////////

//Créer des singes
app.post('/API_monkey', function (req, res) {
    models.Monkey.create({
        name: req.body.name,
        race: req.body.race,
        genre: req.body.genre,
        age: req.body.age,
        weight: req.body.weight

    })
        .then(() => {
            res.send('Monkey added')
        })
        .catch((err) => {
            res.json(err)
        })
});

//retrouver tous les singes
app.get('/API_monkey', function (req, res) {
    models.Monkey.findAll({
        where: req.query
    })
        .then((monkey) => {
            res.send(monkey);
        })
        .catch((err) => {
            res.json(err)
        })
});

//retrouver un singe par le nom
app.get('/API_monkey/name', function (req, res) {
    models.Monkey.findOne({
        where: { name: req.query.name }
    })
        .then((monkey) => {
            res.send(monkey);
        })
        .catch((err) => {
            res.json(err)
        })
});

//retrouver le singe par l'id
app.get('/API_monkey/:id', function (req, res) {
    models.Monkey.findOne({
        where: { id: req.params.id }
    })
        .then((monkey) => {
            res.send(monkey);
        })
        .catch((err) => {
            res.json(err)
        })
});

//mettre a jour tous les singes
app.put('/API_monkey', function (req, res) {
    models.Monkey.update(
        req.body,
        {
            where: req.query
        }
    )
        .then(() => {
            res.send("All Monkeys updated")
        })
});

//mettre a jour un singe par son id
app.put('/API_monkey/:id', function (req, res) {
    models.Monkey.update(
        req.body,
        {
            where: { id: req.params.id }
        })
        .then(() => {
            res.send("Monkey updated")
        })
});

//supprimer tous les singes
app.delete('/API_monkey', function (req, res) {
    models.Monkey.destroy({
        where: req.query
    })
        .then(() => {
            res.send("All Monkeys deleted")
        })
});

//supprimer le singe par le nom
app.delete('/API_monkey/name', function (req, res) {
    models.Monkey.destroy({
        where: { name: req.query.name }
    })
        .then(() => {
            res.send("Monkey deleted")
        })
});

//supprimer le singe par son id
app.delete('/API_monkey/:id', function (req, res) {
    models.Monkey.destroy({
        where: { id: req.params.id }
    })
        .then(() => {
            res.send("Monkey deleted")
        })
});



///////////////////////////////////////////////////////////-----------ENCLOS-API------------////////////////////////////////////////////////////////////


//Obtenir des infos
app.post('/API_enclos', function (req, res) {
    models.Enclos.create({
        number: req.body.number,
        lieux: req.body.lieux,
        proprete: req.body.proprete

    })
        .then(() => {
            res.send('Enclos added')
        })
        .catch((err) => {
            res.json(err)
        })
});

//retrouver tous les enclos
app.get('/API_enclos', function (req, res) {
    models.Enclos.findAll({
        where: req.query
    })
        .then((enclos) => {
            res.send(enclos);
        })
        .catch((err) => {
            res.json(err)
        })
});

//retrouver les enclos par nom
app.get('/API_enclos/number', function (req, res) {
    models.Enclos.findOne({
        where: { number: req.query.number }
    })
        .then((enclos) => {
            res.send(enclos);
        })
        .catch((err) => {
            res.json(err)
        })
});

//retrouver les enclos par l'id
app.get('/API_enclos/:id', function (req, res) {
    models.Enclos.findOne({
        where: { id: req.params.id }
    })
        .then((enclos) => {
            res.send(enclos);
        })
        .catch((err) => {
            res.json(err)
        })
});

//mettre a jour tous les enclos
app.put('/API_enclos', function (req, res) {
    models.Enclos.update(
        req.body,
        {
            where: req.query
        }
    )
        .then(() => {
            res.send("All enclos updated")
        })
});

//mettre a jour les enclos par l'id
app.put('/API_enclos/:id', function (req, res) {
    models.Enclos.update(
        req.body,
        {
            where: { id: req.params.id }
        })
        .then(() => {
            res.send("Enclos updated")
        })
});




//supprimer tous les enclos
app.delete('/API_enclos', function (req, res) {
    models.Enclos.destroy({
        where: req.query
    })
        .then(() => {
            res.send("All enclos deleted")
        })
});

//supprimer les enclos par le numero
app.delete('/API_enclos/number', function (req, res) {
    models.Enclos.destroy({
        where: { number: req.query.number }
    })
        .then(() => {
            res.send("Enclos deleted")
        })
});

//supprimer les enclos par l'id
app.delete('/API_enclos/:id', function (req, res) {
    models.Enclos.destroy({
        where: { id: req.params.id }
    })
        .then(() => {
            res.send("Enclos deleted")
        })
});









// Synchronize models
models.sequelize.sync({ force: true }).then(function () {
    /**
     * Listen on provided port, on all network interfaces.
     * 
     * Listen only when database connection is sucessfull
     */
    app.listen(process.env.PORT, function () {
        console.log('Express server listening on port 3000' + process.env.PORT);
    });
});


//blablablablablab