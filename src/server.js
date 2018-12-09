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

app.get('/', function (req, res) {
    res.render('index', {
        title: "MonkeyManager3000",
        message: "MonkeyManager3000"
    })
})
//obtenir les infos
app.get('/monkey', function (req, res) {
    console.log(req.query)
    models.Monkey.findAll({
        where: req.query
    })

        .then((monkey) => {
            res.json(monkey)

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
        enclos: req.body.enclos
    })
        .then((monkey) => {
            res.json(monkey);
        })
        .catch((err) => {
            res.json(err)
        })

})

//recupérer un seul singe
app.get('/monkey/:id', function (req, res) {
    models.Monkey.findOne({
        id: req.params.id
    })
        .then((monkey) => {
            res.json(monkey)
        })
        .catch((err) => {
            res.json(err)
        })
})

//mettre a jour un singe
app.put('/monkey/:id', function (req, res) {
    models.Monkey.update(
        req.body,
        {
            where: {
                id: req.params.id
            }
        })
        .then((monkey) => {
            res.json(monkey);
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

//////////////////////////////////////////////////////////////////Enclos///////////////////////////////////////////////////////////////////////////

//obtenir les infos
app.get('/enclos', function (req, res) {
    models.Enclos.findAll({
        where: req.query
    })

        .then((enclos) => {
            res.json(enclos)
        })
        .catch((err) => {
            res.json(err)
        })
})

//créer une table de singe
app.post('/enclos', function (req, res) {
    models.Enclos.create({
        lieux: req.body.lieux,
        proprete: req.body.proprete,
        nbMonkey: req.body.nbMonkey
    })
        .then((enclos) => {
            res.json(enclos);
        })
        .catch((err) => {
            res.json(err)
        })

})

//recupérer un seul singe
app.get('/enclos/:id', function (req, res) {
    models.Enclos.findOne({
        id: req.params.id
    })
        .then((enclos) => {
            res.json(enclos)
        })
        .catch((err) => {
            res.json(err)
        })
})

//mettre a jour un singe
app.put('/enclos/:id', function (req, res) {
    models.Enclos.update(
        req.body,
        {
            where: {
                id: req.params.id
            }
        })
        .then((enclos) => {
            res.json(enclos);
        })
        .catch((err) => {
            res.json(err)
        })
})

//mettre a jour plusieurs singe
app.put('/enclos', function (req, res) {
    const promises = [];

    req.body.mutations
        .forEach((item) => {
            promises.push(
                models.Enclos.update(
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

//supprimer plusieur singe
app.delete('/enclos', function (req, res) {
    models.Enclos.destroy({
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

//supprimer un singe
app.delete('/enclos/:id', function (req, res) {
    models.Enclos.destroy({
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

// Synchronize models
models.sequelize.sync().then(function() {
  /**
   * Listen on provided port, on all network interfaces.
   * 
   
   * Listen only when database connection is sucessfull
   */
app.listen(process.env.PORT, function() {
      console.log('Express server listening on port 3000' + process.env.PORT);
      
  });
});
