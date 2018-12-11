const express = require('express')
const path = require('path');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express()
const models = require('./models/index');

/*models.enclos.hasMany(models.Monkey);
models.Monkey.belongsTo(models.enclos);*/

// Decode json and x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Add a bit of logging
app.use(morgan('short'))

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, '/views'))

app.use('/Content', express.static(__dirname + '/Content'));
app.use('/Css', express.static(__dirname + '/Css'));
app.use('/JS', express.static(__dirname + '/jS'));

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
            //res.json(monkey)
            //res.render('monkey')
            res.render('monkey', { Monkey: monkey });

        })
        .catch((err) => {
            res.json(err)
        })
})

//obtenir les infos
/*app.get('/monkey/name', function (req, res) {
    models.Monkey.findAll({
        where: req.query.name
    })
        .then((monkey) => {
            //res.json(monkey.name)
            res.render('Temp')
            //res.render('monkey', { Monkey: monkey });
        })
        .catch((err) => {
            res.json(err)
        })
})*/

//créer une table de singe
app.post('/monkey', function (req, res) {
    models.Monkey.create({
        name: req.body.name,
        race: req.body.race,
        genre: req.body.genre,
        age: req.body.age,
        weight: req.body.weight,
        enclos: req.body.enclos
    }),
        models.Monkey.findAll({
            where: req.query
        })
            .then((monkey) => {
                //res.json(monkey);
                res.redirect('/monkey');
            })
            .catch((err) => {
                res.json(err)
            })

})

/*
//recupérer un seul singe
app.get('/monkey/:id', function (req, res) {
    models.Monkey.findOne({
        where: {
            id: req.params.id
        }
    })
        .then((monkey) => {
            res.json(monkey)
        })
        .catch((err) => {
            res.json(err)
        })
})
*/

//recupérer un seul singe par nom
app.get('/monkey/name', function (req, res) {
    console.log(req.body);
    models.Monkey.findOne({
        where: {
            name: req.query.name
        }
    })
        .then((monkey) => {
            //res.json(monkey)
            //res.render('Temp')

            res.render('monkey', { Monkey: [monkey] });
        })
        .catch((err) => {
            res.json(err)
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
            //res.json(monkey)
            //res.render('Temp')

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
            //res.json(monkey);
            res.redirect('/monkey');
        })
        .catch((err) => {
            res.json(err)
        })
})


//mettre a jour plusieurs singe
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
})

/*
//supprimer plusieur singe
app.delete('/monkey', function (req, res) {
    models.Monkey.destroy({
        where: {
            id: req.body.ids
        }
    })
        .then((response) => {
            res.json(response)
        })
        .catch((err) => {
            res.json(err)
        })
})
*/

//supprimer un singe
app.delete('/monkey/:id', function (req, res) {
    models.Monkey.destroy({
        where: {
            id: req.params.id
        }
    })
        .then((response) => {
            res.json(response);
        })
        .catch((err) => {
            res.json(err)
        })
})


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

//////////////////////////////////////////////////////////////////Enclos///////////////////////////////////////////////////////////////////////////

//obtenir les infos
app.get('/enclos', function (req, res) {
    console.log(req.query)
    models.Enclos.findAll({
        where: req.query
    })

        .then((enclos) => {
            //res.json(monkey)
            //res.render('monkey')
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
        proprete: req.body.proprete,
        nbMonkey: req.body.nbMonkey

    }),
        models.Enclos.findAll({
            where: req.query
        })
            .then((enclos) => {
                //res.json(monkey);
                res.redirect('/enclos');
            })
            .catch((err) => {
                res.json(err)
            })

})


//recupérer un seul enclos
app.get('/enclos/number', function (req, res) {
    console.log(req.body);
    models.Enclos.findOne({
        where: {
            number: req.query.number
        }
    })
        .then((enclos) => {
            //res.json(monkey)
            //res.render('Temp')

            res.render('enclos', { Enclos: [enclos] });
        })
        .catch((err) => {
            res.json(err)
        })
})

//recupérer un seul singe par nom pour le modifier
app.get('/enclos/number/ToModify', function (req, res) {
    console.log(req.body);
    models.Enclos.findOne({
        where: {
            number: req.query.number
        }
    })
        .then((enclos) => {
            //res.json(monkey)
            //res.render('Temp')

            res.render('PutEnclos', { Enclos: [enclos] });
        })
        .catch((err) => {
            res.json(err)
        })
})

//mettre a jour un singe par nom
app.post('/enclos/number/Modify', function (req, res) {
    models.Enclos.update(
        req.body,
        {
            where: {
                number: req.body.oldnumber
            }
        })
        .then((enclos) => {
            //res.json(monkey);
            res.redirect('/enclos');
        })
        .catch((err) => {
            res.json(err)
        })
})


//supprimer un singe par le nom
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
// Synchronize models
models.sequelize.sync(/*{ force: true }*/).then(function () {
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